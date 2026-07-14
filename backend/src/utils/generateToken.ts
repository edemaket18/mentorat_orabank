import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const generateToken = (id: string | Types.ObjectId) => {
  return jwt.sign({ id: id.toString() }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

export default generateToken;
