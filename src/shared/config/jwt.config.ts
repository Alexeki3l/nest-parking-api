import * as dotenv from 'dotenv';
dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: process.env.JWT_SECRET_EXPIRATION },
};
