import { Schema } from "mongoose";
import { IChunk } from "~/interfaces";
import { model } from "mongoose";

const ChunkSchema = new Schema<IChunk>(
  {
    docId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    pageNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    chunkIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    text: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number],
      required: true,
      validate: {
        validator: function (v: number[]) {
          return v.length === 384; // for all-MiniLM-L6-v2
        },
        message: "Embedding must be 384 dimensions",
      },
    },
    tokenCount: {
      type: Number,
      required: true,
    },
    metadata: {
      startPos: Number,
      endPos: Number,
      section: String,
    },
  },
  {
    timestamps: true,
  }
);

ChunkSchema.index({ docId: 1, pageNumber: 1 });
ChunkSchema.index({ docId: 1, chunkIndex: 1 });

export const Chunk = model<IChunk>("Chunk", ChunkSchema);
