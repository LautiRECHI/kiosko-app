import { Router } from "express";
import { getProducts, updateVariante } from "../controllers/products.controller";

const router = Router();

router.get("/", getProducts);
router.put("/variante/:id", updateVariante);

export default router;