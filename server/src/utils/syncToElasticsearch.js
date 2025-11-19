import elasticClient from "../config/elasticsearchClient.js";
import prisma from "../config/prismaClient.js";

async function createIndex() {
  const indexName = "products";

  // Delete old index if exists
  const exists = await elasticClient.indices.exists({ index: indexName });
  if (exists) {
    console.log("Deleting old index...");
    await elasticClient.indices.delete({ index: indexName });
  }

  console.log("Creating new index...");

  await elasticClient.indices.create({
    index: indexName,
    body: {
      settings: {
        index: {
          max_ngram_diff: 20
        },
        analysis: {
          tokenizer: {
            autocomplete_tokenizer: {
              type: "ngram",
              min_gram: 2,
              max_gram: 20,
              token_chars: ["letter", "digit"]
            }
          },
          analyzer: {
            autocomplete_analyzer: {
              type: "custom",
              tokenizer: "autocomplete_tokenizer",
              filter: ["lowercase"]
            },
            autocomplete_search_analyzer: {
              type: "custom",
              tokenizer: "standard",
              filter: ["lowercase"]
            }
          }
        }
      },
      mappings: {
        properties: {
          id: { type: "integer" },
          title: {
            type: "text",
            analyzer: "autocomplete_analyzer",
            search_analyzer: "autocomplete_search_analyzer"
          },
          description: {
            type: "text",
            analyzer: "autocomplete_analyzer",
            search_analyzer: "autocomplete_search_analyzer"
          },
          price: { type: "float" },
          discount: { type: "integer" },
          image: { type: "keyword" },
          category: { type: "keyword" }
        }
      }
    }
  });

  console.log("Index created successfully.");
}

async function syncData() {
  console.log("Fetching products from DB...");
  const products = await prisma.product.findMany();

  if (products.length === 0) {
    console.log("No products found in DB!");
    return;
  }

  console.log(`Found ${products.length} products. Syncing to Elasticsearch...`);

  const body = products.flatMap((p) => [
    { index: { _index: "products", _id: p.id } },
    {
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      discount: p.discount,
      image: p.image,
      category: p.category,
    },
  ]);

  const bulkResponse = await elasticClient.bulk({ refresh: true, body });

  if (bulkResponse.errors) {
    console.error("Bulk upload errors:", bulkResponse);
  }

  console.log("Data synced successfully to Elasticsearch.");
}

async function main() {
  try {
    await createIndex();
    await syncData();
  } catch (err) {
    console.error("Error syncing:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
