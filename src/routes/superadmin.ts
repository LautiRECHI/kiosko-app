import { Router } from "express";
import { loginSuperadmin, getTenants, createTenant, toggleTenant, updateTenant, deleteTenant } from "../controllers/superadmin.controller";

const router = Router();

router.post("/login", loginSuperadmin);
router.get("/tenants", getTenants);
router.post("/tenants", createTenant);
router.put("/tenants/:id/toggle", toggleTenant);
router.put("/tenants/:id", updateTenant);
router.delete("/tenants/:id", deleteTenant);

export default router;