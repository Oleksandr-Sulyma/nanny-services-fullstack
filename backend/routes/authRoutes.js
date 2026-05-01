import { Router } from "express";
import { celebrate } from "celebrate";
import { registerUser } from "../controllers/authController.js";
import { registerValidation } from "../validations/authValidation.js";

const router = Router();

router.post("/register", celebrate(registerValidation), registerUser);

export default router;
