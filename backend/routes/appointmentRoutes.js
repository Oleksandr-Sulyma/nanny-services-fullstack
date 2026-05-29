import { Router } from "express";
import { celebrate } from "celebrate";
import { updateAppointmentStatus, completeAppointment, cancelAppointment, getMyAppointments, getIncomingAppointments, createReview } from "../controllers/appointmentController.js";
import { updateAppointmentStatusSchema, appointmentIdSchema, createReviewSchema } from "../validations/appointmentsValidation.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.patch(
  "/:appointmentId/status",
  authenticate,
  authorize("nanny"),
  celebrate(updateAppointmentStatusSchema),
  updateAppointmentStatus,
);

router.patch(
  "/:appointmentId/complete",
  authenticate,
  authorize("parent"),
  celebrate(appointmentIdSchema),
  completeAppointment,
);

router.patch(
  "/:appointmentId/cancel",
  authenticate,
  authorize("parent"),
  celebrate(appointmentIdSchema),
  cancelAppointment,
);

router.get(
    "/my",
    authenticate,
    authorize("parent"),
    getMyAppointments,

);

router.get(
    "/incoming",
    authenticate,
    authorize("nanny"),
    getIncomingAppointments,
);

router.post(
  "/:appointmentId/reviews",
  authenticate,
  authorize("parent"),
  celebrate(createReviewSchema),
  createReview,
);


export default router;
