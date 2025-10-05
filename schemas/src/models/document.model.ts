import { model, Schema } from "mongoose";
import { IDocument } from "~/interfaces";

const DocumentSchema = new Schema<IDocument>(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    totalPages: {
      type: Number,
      required: true,
      min: 1,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
      enum: ["application/pdf"],
    },
    filePath: {
      type: String,
    },
    status: {
      type: String,
      enum: ["uploaded", "processing", "indexed", "failed"],
      default: "uploaded",
      index: true,
    },
    indexedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

DocumentSchema.index({ userId: 1, status: 1 });

export const Document = model<IDocument>("Document", DocumentSchema);
