import { Router } from "express";
import { getProfile, login, logout, registerUser } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router=Router();

router.post("/register",registerUser)
router.post("/login",login)
router.post("/logout",logout)

router.get("/me",verifyToken,getProfile)

export default router;