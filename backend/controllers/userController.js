import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { User } from "../models/User.js";
import { Nanny } from "../models/Nanny.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getCurrentUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "favorites",
    match: { isProfileComplete: true },
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }
  res.json({ data: user });
});

export const updateAvatar = catchAsync(async (req, res) => {
  const { avatar } = req.body;

  if (!avatar) {
    throw createHttpError(400, "Avatar URL is required");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { avatar },
    { returnDocument: "after" },
  );

  res.status(200).json({
    message: "Avatar updated successfully",
    data: updatedUser,
  });
});

export const updatePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isMatch) {
    throw createHttpError(401, "Old password is incorrect");
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({
    message: "Password updated successfully",
    data: { email: user.email },
  });
});

export const toggleFavoriteNanny = catchAsync(async (req, res) => {
  const { nannyId } = req.body;
  const userId = req.user.id;

  const [user, nanny] = await Promise.all([
    User.findById(userId),
    Nanny.findOne({ _id: nannyId, isProfileComplete: true }),
  ]);

  if (!user) throw createHttpError(404, "User not found");
  if (!nanny) throw createHttpError(404, "Nanny not found");

  const isFavorite = user.favorites.some((id) => id.equals(nannyId));

  if (isFavorite) {
    user.favorites = user.favorites.filter((id) => !id.equals(nannyId));
  } else {
    user.favorites.push(nannyId);
  }

  await user.save();

  res.status(200).json({
    message: isFavorite ? "Removed from favorites" : "Added to favorites",
    favorites: user.favorites,
  });
});
