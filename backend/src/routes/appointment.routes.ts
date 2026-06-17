import Router from "express"
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/rbac.middleware.js";
import { bookAppointment } from "../controllers/appointment.controller.js";

const router=Router();

router.post("/",verifyToken,authorizeRoles("PATIENT"),bookAppointment);

export default router;