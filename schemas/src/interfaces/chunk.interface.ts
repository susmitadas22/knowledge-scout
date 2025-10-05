import { Document, Types } from "mongoose";

export interface IChunk extends Document {
  _id: Types.ObjectId;
  docId: Types.ObjectId;
  pageNumber: number;
  chunkIndex: number;
  text: string;
  embedding: number[]; // Vector embedding array
  tokenCount: number;
  metadata: {
    startPos?: number;
    endPos?: number;
    section?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
