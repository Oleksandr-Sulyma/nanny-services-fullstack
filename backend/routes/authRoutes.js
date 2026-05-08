import { Router } from "express";
import { celebrate } from "celebrate";
import { registerUser, loginUser, logoutUser, getCurrentUser, updateAvatar, updatePassword } from "../controllers/authController.js";
import { registerUserSchema, loginUserSchema, updateAvatarSchema, updatePasswordSchema } from "../validations/authValidation.js";
import {authenticate} from '../middleware/authenticate.js'

const router = Router();

router.post("/register", celebrate(registerUserSchema), registerUser);
router.post("/login", celebrate(loginUserSchema), loginUser );
router.post("/logout", authenticate, logoutUser );
router.get('/me', authenticate, getCurrentUser);
router.patch('/avatar', authenticate, celebrate(updateAvatarSchema),  updateAvatar);
router.patch("/update-password", authenticate, celebrate(updatePasswordSchema), updatePassword);

export default router;
