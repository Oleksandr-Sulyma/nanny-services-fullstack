import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { upload } from "../middleware/upload.js";
import { uploadAvatar } from "../controllers/uploadController.js";

const router = Router();

router.post("/avatar", authenticate, upload.single("avatar"), uploadAvatar);

export default router;