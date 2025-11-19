import elasticClient from "../config/elasticsearchClient.js";

export const ensureIndex = async (index) => {
  const isExist = await elasticClient.indices.exists({ index: index });
  if (isExist) return;

  await elasticClient.indices.create({
    index: index,
    mappings: {
      properties: {
        id: { type: "integer" },
        title: { type: "text" },
        description: { type: "text" },
        price: { type: "integer" },
        discount: { type: "integer" },
        image: { type: "text" },
        category: { type: "text" },
      },
    },
  });
};

export const createElasticDb = async (index, document) => {
  if (!index) {
    throw new Error("Index not found!");
  } else if (!document || !document?.id) {
    throw new Error("document id not found!");
  }

  await elasticClient.index({
    index: index,
    id: document.id.toString(),
    document: document,
  });
};

export const updateElasticDb = async (index, document) => {
  if (!index) {
    throw new Error("Index not found!");
  } else if (!document || !document?.id) {
    throw new Error("document id not found!");
  }

  await elasticClient.update({
    index: index,
    id: document.id.toString(),
    doc: document,
  });
};

export const deleteElasticDb = async (index, id) => {
  if (!index) {
    throw new Error("Index not found!");
  } else if (!id) {
    throw new Error("document id not found!");
  }

  await elasticClient.delete({
    index: index,
    id: document.id.toString(),
  });
};
