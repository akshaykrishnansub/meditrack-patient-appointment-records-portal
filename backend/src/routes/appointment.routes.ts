import {Router} from "express"
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/rbac.middleware.js";
import { approveAppointment, bookAppointment, cancelAppointment, getAppointments, reschedule } from "../controllers/appointment.controller.js";

const router=Router();

router.post("/",verifyToken,authorizeRoles("PATIENT"),bookAppointment);
router.get("/",verifyToken,getAppointments);
router.patch("/:id/cancel",verifyToken,authorizeRoles("PATIENT","DOCTOR"),cancelAppointment);
router.patch("/:id/approve",verifyToken,authorizeRoles("DOCTOR"),approveAppointment);
router.patch("/:id/reschedule",verifyToken,authorizeRoles("DOCTOR"),reschedule)

export default router;