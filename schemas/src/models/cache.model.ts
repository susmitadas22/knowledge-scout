import { model, Schema } from "mongoose";
import { ICache } from "~/interfaces";

const CacheSchema = new Schema<ICache>(
  {
    queryHash: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    query: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    result: {
      answer: String,
      sources: [
        {
          text: { type: String, required: true },
          page: { type: Number, required: true },
          filename: { type: String, required: true },
          docId: {
            type: Schema.Types.ObjectId,
            ref: "Document",
            required: true,
          },
          score: { type: Number, required: true },
        },
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

CacheSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

export const QueryCache = model<ICache>("Cache", CacheSchema);
