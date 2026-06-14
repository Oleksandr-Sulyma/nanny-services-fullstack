import { Router } from "express";
import { celebrate } from "celebrate";
import { getCurrentUser, updateAvatar, updatePassword, toggleFavoriteNanny, updateProfile } from "../controllers/userController.js";
import { updateAvatarSchema, updatePasswordSchema, updateProfileSchema } from "../validations/userValidation.js";
import { favoriteNannySchema } from "../validations/nanniesValidation.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.get("/me", authenticate, getCurrentUser);
router.patch("/avatar", authenticate, celebrate(updateAvatarSchema), updateAvatar);
router.patch("/update-password", authenticate, celebrate(updatePasswordSchema), updatePassword);
router.post("/favorites", authenticate, celebrate(favoriteNannySchema), toggleFavoriteNanny);
router.patch("/profile", authenticate, celebrate(updateProfileSchema), updateProfile);

export default router;