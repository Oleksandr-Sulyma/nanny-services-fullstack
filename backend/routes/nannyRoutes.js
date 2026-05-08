import { Router } from "express";
import { celebrate } from "celebrate";
import { getAllNannies, getNannyById } from "../controllers/nannyController.js";
import { getNanniesSchema, nannyIdSchema } from "../validations/nanniesValidation.js"

const router = Router();

router.get("/", celebrate(getNanniesSchema), getAllNannies);
router.get("/:nannyId", celebrate(nannyIdSchema), getNannyById);

export default router;