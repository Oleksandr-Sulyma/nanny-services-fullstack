import createHttpError from "http-errors";
import mongoose from "mongoose";
import { Appointment } from "../models/Appointment.js";
import { Nanny } from "../models/Nanny.js";
import { User } from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";
import { Review } from "../models/Review.js";

export const createAppointment = catchAsync(async (req, res) => {
  const { nannyId } = req.params;
  const parentId = req.user.id;

  const nanny = await Nanny.findById(nannyId);

  if (!nanny) throw createHttpError(404, "Nanny not found");

  if (nanny.isProfileComplete !== true)
    throw createHttpError(
      400,
      "Nanny profile is not available for appointments",
    );

  const { parentName, email, address, phone, childAge, scheduledAt, comment } =
    req.body;

  const newAppointment = await Appointment.create({
    parentId,
    nannyId,
    parentName,
    email,
    address,
    phone,
    childAge,
    scheduledAt,
    comment,
  });

  res.status(201).json({
    message: "Appointment created successfully",
    data: newAppointment,
  });
});

export const updateAppointmentStatus = catchAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  const nanny = await Nanny.findOne({ userId });

  if (!nanny) {
    throw createHttpError(404, "Nanny not found");
  }

  if (nanny.isProfileComplete !== true) {
    throw createHttpError(
      400,
      "Nanny profile is not available for appointments",
    );
  }

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw createHttpError(404, "Appointment not found");
  }

  if (!appointment.nannyId.equals(nanny.id)) {
    throw createHttpError(403, "You cannot update this appointment");
  }

  if (appointment.status !== "pending") {
    throw createHttpError(
      400,
      "Only pending appointments can be accepted or rejected",
    );
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { status },
    { returnDocument: "after" },
  );

  res.status(200).json({
    message: "Appointment status updated successfully",
    data: updatedAppointment,
  });
});

export const completeAppointment = catchAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const userId = req.user.id;

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw createHttpError(404, "Appointment not found");
  }

  if (!appointment.parentId.equals(userId)) {
    throw createHttpError(403, "You cannot complete this appointment");
  }

  if (appointment.status !== "accepted") {
    throw createHttpError(400, "Only accepted appointments can be completed");
  }

  const completedAppointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { status: "completed" },
    { returnDocument: "after" },
  ).populate("nannyId");

  res.status(200).json({
    message: "Appointment completed successfully",
    data: {
      ...completedAppointment.toJSON(),
      hasReview: false,
    },
  });
});

export const cancelAppointment = catchAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const userId = req.user.id;

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw createHttpError(404, "Appointment not found");
  }

  if (!appointment.parentId.equals(userId)) {
    throw createHttpError(403, "You cannot cancel this appointment");
  }

  if (!["pending", "accepted"].includes(appointment.status)) {
    throw createHttpError(
      400,
      "Only pending or accepted appointments can be cancelled",
    );
  }

  const cancelledAppointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { status: "cancelled" },
    { returnDocument: "after" },
  ).populate("nannyId");

  res.status(200).json({
    message: "Appointment cancelled successfully",
    data: cancelledAppointment,
  });
});

export const getMyAppointments = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const appointments = await Appointment.find({ parentId: userId })
    .populate("nannyId")
    .sort({ createdAt: -1 });

  const appointmentIds = appointments.map((appointment) => appointment.id);
  const reviews = await Review.aggregate([
    {
      $match: {
        authorId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        appointmentId: { $toString: "$appointmentId" },
      },
    },
    {
      $match: {
        appointmentId: { $in: appointmentIds },
      },
    },
  ]);
  const reviewedAppointmentIds = new Set(
    reviews.map((review) => review.appointmentId),
  );
  const appointmentsWithReviewStatus = appointments.map((appointment) => ({
    ...appointment.toJSON(),
    hasReview: reviewedAppointmentIds.has(appointment.id),
  }));

  res.status(200).json({
    message:
      appointments.length > 0
        ? "Your appointments"
        : "You haven't created any appointments yet",
    data: appointmentsWithReviewStatus,
  });
});

export const getIncomingAppointments = catchAsync(async (req, res) => {
  const nanny = await Nanny.findOne({ userId: req.user.id });

  if (!nanny) {
    throw createHttpError(404, "Nanny not found");
  }

  if (nanny.isProfileComplete !== true) {
    throw createHttpError(
      400,
      "Nanny profile is not available for appointments",
    );
  }

  const appointments = await Appointment.find({ nannyId: nanny.id })
    .populate("parentId")
    .sort({ createdAt: -1 });

  const appointmentIds = appointments.map((appointment) => appointment.id);

  const reviews = await Review.aggregate([
    {
      $match: {
        nannyId: new mongoose.Types.ObjectId(nanny.id),
      },
    },
    {
      $project: {
        appointmentId: { $toString: "$appointmentId" },
        rating: 1,
        comment: 1,
      },
    },
    {
      $match: {
        appointmentId: { $in: appointmentIds },
      },
    },
  ]);

  const reviewsByAppointmentId = new Map(
    reviews.map((review) => [
      review.appointmentId,
      {
        rating: review.rating,
        comment: review.comment,
      },
    ]),
  );

  const appointmentsWithReviews = appointments.map((appointment) => ({
    ...appointment.toJSON(),
    review: reviewsByAppointmentId.get(appointment.id) ?? null,
  }));

  res.status(200).json({
    message:
      appointments.length > 0
        ? "Incoming appointments"
        : "You don't have incoming appointments yet",
    data: appointmentsWithReviews,
  });
});

export const createReview = catchAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const parentId = req.user.id;
  const { rating, comment } = req.body;

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw createHttpError(404, "Appointment not found");
  }

  if (!appointment.parentId.equals(parentId)) {
    throw createHttpError(403, "You cannot review this appointment");
  }

  if (appointment.status !== "completed") {
    throw createHttpError(400, "Only completed appointments can be reviewed");
  }

  const existingReview = await Review.findOne({ appointmentId });

  if (existingReview) {
    throw createHttpError(409, "Review for this appointment already exists");
  }

  const nannyId = appointment.nannyId;

  const newReview = await Review.create({
    authorId: parentId,
    nannyId,
    appointmentId,
    rating,
    comment,
  });

  const ratingStats = await Review.aggregate([
    {
      $match: { nannyId: new mongoose.Types.ObjectId(nannyId) },
    },
    {
      $group: {
        _id: "$nannyId",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  const averageRating = ratingStats.length
    ? Number(ratingStats[0].averageRating.toFixed(2))
    : 0;

  const updatedNanny = await Nanny.findByIdAndUpdate(
    nannyId,
    { rating: averageRating },
    { returnDocument: "after" },
  );

  res.status(201).json({
    message: "Review created successfully",
    data: {
      review: newReview,
      nannyRating: updatedNanny.rating,
    },
  });
});
