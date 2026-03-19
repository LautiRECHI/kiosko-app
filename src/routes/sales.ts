import { Router } from "express";
import { postSale } from "../controllers/sales.controller";

const router = Router();

router.post("/", postSale);

export default router;