import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { User } from "../models/User.js";
import { createToken } from "../utils/createToken.js";

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

export const loginUser = async (req, res, next) => {
  let { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(createHttpError(401, "Invalid credentials"));
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    return next(createHttpError(401, 'Invalid credentials'));
  } 

  const token = createToken(user._id);

  res.status(200).json({
    message: "User logged successfully",
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        favorites: user.favorites,
      },
    },
  });
};
