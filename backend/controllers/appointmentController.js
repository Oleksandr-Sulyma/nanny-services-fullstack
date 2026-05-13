import createHttpError from "http-errors";
import { Appointment } from "../models/Appointment.js";
import { Nanny } from "../models/Nanny.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createAppointment = catchAsync(async (req, res) => {
  const { nannyId } = req.params;
  const parentId = req.user.id;

  const nanny = await Nanny.findById(nannyId);

  if (!nanny) throw createHttpError(404, "Nanny not found");

  if (nanny.isProfileComplete !== true) throw createHttpError(400, "Nanny profile is not available for appointments")

  const { parentName, email, address, phone, childAge, time, comment } =
    req.body;

  const newAppointment = await Appointment.create({
    parentId,
    nannyId,
    parentName,
    email,
    address,
    phone,
    childAge,
    time,
    comment,
  });
 
  res.status(201).json({
  message: "Appointment created successfully",
  data: newAppointment,
});
});
