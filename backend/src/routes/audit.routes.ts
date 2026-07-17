import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/rbac.middleware.js";
import { viewAuditLogs } from "../controllers/audit.controller.js";

const router=Router();

router.get("/",verifyToken,authorizeRoles("ADMIN"),viewAuditLogs);

export default router;