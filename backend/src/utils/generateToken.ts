import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const generateToken = (id: string | Types.ObjectId) => {
  return jwt.sign({ id: id.toString() }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || '30d',
  });
};

export default generateToken;