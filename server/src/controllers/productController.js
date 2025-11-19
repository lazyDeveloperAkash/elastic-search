import elasticClient from "../config/elasticsearchClient.js";
import prisma from "../config/prismaClient.js";
import sendResponce from "../utils/sendResponse.js";
import {
  createElasticDb,
  deleteElasticDb,
  ensureIndex,
  updateElasticDb,
} from "../utils/updateElastic.js";

const INDEX = "products";

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, discount, image, category } = req.body;
    await ensureIndex(INDEX);
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: Number(price),
        discount: Number(discount) || 0,
        image:
          image ||
          "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/396e9/MainBefore.jpg",
        category,
      },
    });

    //sync to elastic
    await createElasticDb(INDEX, product);

    sendResponce(res, 201, true, product, "product created");
  } catch (error) {
    console.log(error);
    sendResponce(res, error?.status || 500, false, error, error.message);
  }
};

export const createMany = async (req, res) => {
  try {
    const { products } = req.body;
    await ensureIndex(INDEX);

    //sync to elastic
    for (const product of products) {
      const newproduct = await prisma.product.create({
        data: product,
      });
      await createElasticDb(INDEX, newproduct);
    }

    sendResponce(res, 201, true, null, "product created");
  } catch (error) {
    sendResponce(res, error?.status || 500, false, error, error.message);
  }
};

export const getAllProducts = async (req, res) => {
  try {
    await ensureIndex(INDEX);
    const resp = await elasticClient.search({
      index: INDEX,
      query: { match_all: {} },
      sort: [{ id: { order: "desc" } }],
      size: 100,
    });

    const products = resp?.hits?.hits.map((hit) => hit._source) || [];

    sendResponce(res, 200, true, products, "products fetched");
  } catch (error) {
    sendResponce(res, error?.status || 500, false, error, error.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product)
      return sendResponce(res, 404, false, null, "Product not found");
    return sendResponce(res, 200, true, product, "Product fetched");
  } catch (error) {
    sendResponce(res, error?.status || 500, false, error, error.message);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { title, description, price, discount, image, category } = req.body;
    await ensureIndex(INDEX);
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        price: Number(price),
        discount: Number(discount),
        image,
        category,
      },
    });

    //sync to elastic
    await updateElasticDb(INDEX, product);

    sendResponce(res, 200, true, product, "product updated");
  } catch (error) {
    sendResponce(res, error?.status || 500, false, error, error.message);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await ensureIndex(INDEX);
    const { id } = req.params;
    const product = await prisma.product.delete({
      where: { id: Number(id) },
    });

    //sync to elastic
    await deleteElasticDb(INDEX, id);

    sendResponce(res, 200, true, product, "product deleted");
  } catch (error) {
    sendResponce(res, error?.status || 500, false, error, error.message);
  }
};

//search options
export const fizzySearch = async (req, res) => {
  try {
    const { input } = req.params;
    const resp = await elasticClient.search({
      index: INDEX,
      query: {
        multi_match: {
          query: input,
          fields: ["title", "description", "category"],
          fuzziness: "AUTO",
          operator: "OR",
        },
      },
    });

    const products = resp?.hits?.hits.map((hit) => hit._source) || [];

    sendResponce(res, 200, true, products, "FZuzzy search result");
  } catch (error) {
    sendResponce(res, 500, false, error, "Failed to fetch");
  }
};

//suggection search
export const suggections = async (req, res) => {
  try {
    const q = req.query.q || "";
    if (!q) return res.json([]);
    const body = await elasticClient.search({
      index: "products",
      size: 10,
      query: {
        multi_match: {
          query: q,
          fields: ["title", "description"],
          type: "bool_prefix",
        },
      },
    });
    res.json(body.hits.hits.map((h) => h._source));
  } catch (error) {
    console.log(error);
    sendResponce(res, 500, false, error, "Failed to fetch");
  }
};

// Recommendation: similar products by category + title/description
export const recomendations = async (req, res) => {
  try {
    const id = req.params.id;
    const prod = await elasticClient
      .get({ index: "products", id })
      .catch(() => null);
    if (!prod || !prod._source)
      return res.status(404).json({ error: "not found" });
    const p = prod._source;

    const body = await elasticClient.search({
      index: "products",
      size: 12,
      query: {
        bool: {
          must: [{ term: { category: p.category } }],
          should: [
            {
              more_like_this: {
                fields: ["title", "description"],
                like: [{ _id: id }],
                min_term_freq: 1,
                min_doc_freq: 1,
              },
            },
            { match: { title: { query: p.title, boost: 3 } } },
          ],
          must_not: [{ term: { id: Number(id) } }],
        },
      },
    });

    const recomendations = body.hits.hits.map((h) => h._source);
    sendResponce(res, 200, true, recomendations, "recomendation's result");
  } catch (error) {
    sendResponce(res, 500, false, error, "Failed to fetch");
  }
};
