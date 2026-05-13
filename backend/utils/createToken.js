import jwt from 'jsonwebtoken';

export const createToken = (userId, userRole) => {
  const payload = {
    id: userId,
    role: userRole,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};