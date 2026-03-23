import { Router } from "express";
import { postSale, getSales } from "../controllers/sales.controller";

const router = Router();

router.get("/", getSales);
router.post("/", postSale);

export default router;