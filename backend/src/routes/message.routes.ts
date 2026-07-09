import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getChatMessages, getConversationList } from "../controllers/message.controller.js";
import { authorizeRoles } from "../middleware/rbac.middleware.js";

const router=Router();
router.get("/conversations",verifyToken,authorizeRoles("PATIENT","DOCTOR"),getConversationList);
router.get("/:userId",verifyToken,authorizeRoles("PATIENT","DOCTOR"),getChatMessages);

export default router;