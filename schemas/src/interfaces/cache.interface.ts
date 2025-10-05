import { Document, Types } from "mongoose";

export interface ICache extends Document {
  _id: Types.ObjectId;
  queryHash: string;
  query: string;
  userId?: Types.ObjectId;
  result: {
    answer?: string;
    sources: Array<{
      text: string;
      page: number;
      filename: string;
      docId: Types.ObjectId;
      score: number;
    }>;
  };
  createdAt: Date;
}
