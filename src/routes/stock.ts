import { Router } from "express";
import { getStock } from "../controllers/stock.controller";

const router = Router();

router.get("/", getStock);

export default router;