import { Router } from "express";
import { login, loginKiosco } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/login-kiosco", loginKiosco);

export default router;