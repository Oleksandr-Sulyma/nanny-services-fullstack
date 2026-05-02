import jwt from 'jsonwebtoken';

export const createToken = (userId) => {
  const payload = {
    id: userId,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};