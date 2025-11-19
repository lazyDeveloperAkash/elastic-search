import { Router } from "express";
import productRoutes from './productRoutes.js';

const router = Router();

router.use("/product", productRoutes);

export default router;