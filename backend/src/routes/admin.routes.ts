import {Router} from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/rbac.middleware.js';
import { addDoctor, fetchAllAppointments, fetchAllUsers, fetchUserById, removeUser, updateExisitingUser, viewAllMedicalRecords, deleteMedicalRecord, viewMedicalRecordByAdmin} from '../controllers/admin.controller.js';

const router=Router();
router.get('/appointments',verifyToken,authorizeRoles("ADMIN"),fetchAllAppointments);
router.get('/users',verifyToken,authorizeRoles("ADMIN"),fetchAllUsers);
router.get('/records',verifyToken,authorizeRoles("ADMIN"),viewAllMedicalRecords)
router.post("/doctor",verifyToken,authorizeRoles("ADMIN"),addDoctor)
router.get("/users/:id",verifyToken,authorizeRoles("ADMIN"),fetchUserById);
router.get("/records/:id",verifyToken,authorizeRoles("ADMIN"),viewMedicalRecordByAdmin)
router.patch("/users/:id",verifyToken,authorizeRoles("ADMIN"),updateExisitingUser);
router.delete('/users/:id',verifyToken,authorizeRoles("ADMIN"),removeUser);
router.delete('/records/:id',verifyToken,authorizeRoles("ADMIN"),deleteMedicalRecord);

export default router;
