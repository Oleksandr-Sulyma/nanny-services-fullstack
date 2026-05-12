import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { User } from "../models/User.js";
import { Nanny } from "../models/Nanny.js";
import { createToken } from "../utils/createToken.js";
import { catchAsync } from "../utils/catchAsync.js";

export const registerUser = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, "A user with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    passwordHash: hashedPassword,
    role,
  });

  let nanny = null;

  if (role === "nanny") {
    nanny = await Nanny.create({
      name: newUser.name,
      userId: newUser._id,
      rating: 0,
      price_per_hour: 0,
      experience: "New",
      reviews: [],
    });
  }

  res.status(201).json({
    data: {
      user: newUser,
      nanny,
    },
  });
});

export const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, "Invalid credentials");
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw createHttpError(401, "Invalid credentials");
  }

  const token = createToken(user.id);

  res.status(200).json({
    message: "User logged successfully",
    data: {
      token,
      user,
    },
  });
});

export const logoutUser = (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
};
