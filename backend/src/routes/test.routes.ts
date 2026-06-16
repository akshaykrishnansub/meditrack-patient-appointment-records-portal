import {Router} from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/rbac.middleware.js";
import { adminDashboard, doctorDashboard, patientDashboard } from "../controllers/test.controller.js";

const router=Router();

router.get("/patient",verifyToken,authorizeRoles("PATIENT"),patientDashboard);
router.get("/doctor",verifyToken,authorizeRoles("DOCTOR"),doctorDashboard);
router.get("/admin",verifyToken,authorizeRoles("ADMIN"),adminDashboard);

export default router;