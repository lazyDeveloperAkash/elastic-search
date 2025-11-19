import { Client } from "@elastic/elasticsearch";

const elasticClient = new Client({
    node: process.env.ELASTIC_URL || "http://elasticsearch:9200",
});

export default elasticClient;
