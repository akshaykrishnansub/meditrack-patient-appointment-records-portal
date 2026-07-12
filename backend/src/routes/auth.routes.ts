import { Router } from "express";
import { forgotPassword, getDoctors, getProfile, login, logout, registerUser, resetPassword } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router=Router();

router.post("/register",registerUser)
router.post("/login",login)
router.post("/logout",logout)
router.post("/forgot-password",forgotPassword)
router.post("/reset-password",resetPassword)
router.get("/doctor",verifyToken,getDoctors)
router.get("/me",verifyToken,getProfile)

export default router;