import {Router} from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/rbac.middleware.js';
import { addDoctor, fetchAllUsers, removeUser } from '../controllers/admin.controller.js';

const router=Router();
router.get('/users',verifyToken,authorizeRoles("ADMIN"),fetchAllUsers);
router.post("/doctor",verifyToken,authorizeRoles("ADMIN"),addDoctor)
router.delete('/users/:id',verifyToken,authorizeRoles("ADMIN"),removeUser);

export default router;
