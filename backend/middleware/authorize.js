export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw createHttpError(403, "Access denied");
  }
  next();
};