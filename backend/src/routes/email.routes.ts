import { Router } from "express";
import { testMail } from "../controllers/email.controller.js";

const router=Router();

router.post("/test-email",testMail);

export default router;