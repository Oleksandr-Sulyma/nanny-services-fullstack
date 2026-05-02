import { Router } from "express";
import { celebrate } from "celebrate";
import { registerUser, loginUser } from "../controllers/authController.js";
import { registerValidation, loginValidation } from "../validations/authValidation.js";

const router = Router();

router.post("/register", celebrate(registerValidation), registerUser);
router.post("/login", celebrate(loginValidation), loginUser );

export default router;
