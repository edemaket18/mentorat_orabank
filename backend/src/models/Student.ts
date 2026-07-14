import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  enrolled: boolean;
}

const StudentSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    enrolled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IStudent>('Student', StudentSchema);
