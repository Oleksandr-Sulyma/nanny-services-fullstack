import { Router } from "express";
import { celebrate } from "celebrate";
import {
  getAllNannies,
  getNannyById,
  updateMyNannyProfile,
  getMyNannyProfile,
} from "../controllers/nannyController.js";
import {
  getNanniesSchema,
  nannyIdSchema,
  updateMyNannyProfileSchema,
} from "../validations/nanniesValidation.js";
import { createAppointment } from "../controllers/appointmentController.js";
import { appointmentSchema } from "../validations/appointmentsValidation.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get("/", celebrate(getNanniesSchema), getAllNannies);
router.get(
  "/me",
  authenticate,
  authorize("nanny"),
  getMyNannyProfile,
);
router.get("/:nannyId", celebrate(nannyIdSchema), getNannyById);
router.post(
  "/:nannyId/appointments",
  authenticate,
  authorize("parent"),
  celebrate(nannyIdSchema),
  celebrate(appointmentSchema),
  createAppointment,
);
router.patch(
  "/me",
  authenticate,
  authorize("nanny"),
  celebrate(updateMyNannyProfileSchema),
  updateMyNannyProfile,
);

export default router;
