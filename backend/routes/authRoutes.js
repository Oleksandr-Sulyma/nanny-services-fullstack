import { Router } from "express";
import { celebrate } from "celebrate";
import { registerUser, loginUser, logoutUser, getCurrentUser, updateAvatar } from "../controllers/authController.js";
import { registerValidation, loginValidation, updateAvatarValidation } from "../validations/authValidation.js";
import {authenticate} from '../middleware/authenticate.js'

const router = Router();

router.post("/register", celebrate(registerValidation), registerUser);
router.post("/login", celebrate(loginValidation), loginUser );
router.post("/logout", authenticate, logoutUser );
router.get('/me', authenticate, getCurrentUser);
router.patch('/avatar', celebrate(updateAvatarValidation), authenticate, updateAvatar);

export default router;
