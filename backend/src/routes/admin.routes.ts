import {Router} from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/rbac.middleware.js';
import { addDoctor, fetchAllUsers, fetchUserById, removeUser, updateExisitingUser } from '../controllers/admin.controller.js';

const router=Router();
router.get('/users',verifyToken,authorizeRoles("ADMIN"),fetchAllUsers);
router.post("/doctor",verifyToken,authorizeRoles("ADMIN"),addDoctor)
router.get("/users/:id",verifyToken,authorizeRoles("ADMIN"),fetchUserById);
router.patch("/users/:id",verifyToken,authorizeRoles("ADMIN"),updateExisitingUser);
router.delete('/users/:id',verifyToken,authorizeRoles("ADMIN"),removeUser);

export default router;
