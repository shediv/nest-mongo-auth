import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  email: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  dob: { type: String, required: true },
  picture: { type: String, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, required: true }
});

export interface User extends mongoose.Document {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string;
  picture: string;
  password: string;
  isActive: boolean
}