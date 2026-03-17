import { Router } from "express";
import multer from "multer";
import { previewImport, confirmImport } from "../controllers/import.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/preview", upload.single("file"), previewImport);
router.post("/confirm", confirmImport);

export default router;