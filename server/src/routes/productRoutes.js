import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createMany,
  fizzySearch,
  suggections,
  recomendations,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

router.post("/create-multiple", createMany);

//search
//Fuzzy search
router.get("/search/suggest", suggections);
router.get("/search/:input", fizzySearch);
router.get("/recommend/:id", recomendations);

export default router;
