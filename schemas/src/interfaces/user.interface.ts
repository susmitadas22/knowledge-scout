import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;

  email: string;
  password: string; // Hashed password
  shareToken: string; // Token used for sharing documents

  createdAt: Date;
  updatedAt: Date;
}
