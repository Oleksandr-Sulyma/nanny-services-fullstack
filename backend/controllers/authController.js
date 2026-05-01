import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { User } from "../models/User.js";

export const registerUser = async (req, res, next) => {
  let { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(createHttpError(409, "A user with this email already exists"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    passwordHash: hashedPassword,
  });

  res.status(201).json(newUser);
};
