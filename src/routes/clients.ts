import { Router } from "express";
import { getClients, postClient } from "../controllers/clients.controller";

const router = Router();

router.get("/", getClients);
router.post("/", postClient);

export default router;