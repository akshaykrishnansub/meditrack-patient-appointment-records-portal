import {Router} from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/rbac.middleware.js';
import { getMedicalRecords, uploadMedicalRecord } from '../controllers/medicalrecord.controller.js';
import { deleteMedicalRecord } from '../models/medicalrecord.model.js';
import { upload } from '../middleware/upload.js';

const router=Router();

//Upload Medical records
router.post("/upload",verifyToken,authorizeRoles("PATIENT"),upload.single("record"),uploadMedicalRecord);

//View Own Medical records
router.get("/",verifyToken,authorizeRoles("PATIENT"),getMedicalRecords);

//Delete Medical Records
router.delete("/:id",verifyToken,authorizeRoles("PATIENT"),deleteMedicalRecord);

export default router;