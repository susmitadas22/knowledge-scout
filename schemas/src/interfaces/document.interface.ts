import { Document, Types } from "mongoose";

export interface IDocument extends Document {
  _id: Types.ObjectId;
  filename: string;
  originalName: string;
  userId: Types.ObjectId;
  uploadedAt: Date;
  totalPages: number;
  fileSize: number;
  mimeType: string;
  filePath: string;
  status: "uploaded" | "processing" | "indexed" | "failed";
  indexedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
