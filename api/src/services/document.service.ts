import { Chunk, Document } from "@knowledgescout/schemas";
import { Types } from "mongoose";
import { ApiError, generateEmbeddings } from "~/lib";
import { parseDocument } from "~/lib/parser";
import { ListDocumentQuery } from "~/validators";
import * as fs from "node:fs";
import * as path from "node:path";

export const documentService = {
  listDocuments: async (userId: string, query: ListDocumentQuery) => {
    const { limit = 10, offset = 0 } = query;

    const documents = await Document.find({ userId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const total = await Document.countDocuments({ userId });

    return {
      items: documents,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    };
  },

  getDocumentById: async (docId: string, userId?: string) => {
    const document = await Document.findOne({
      _id: docId,
    }).lean();
    if (!document) {
      throw new ApiError(404, "DOCUMENT_NOT_FOUND", "Document not found");
    }
    return document;
  },

  uploadDocument: async (file: File, userId: string) => {
    const { pages } = await parseDocument(file);

    const documentDoc = await Document.create({
      filename: file.name,
      originalName: file.name,
      userId: userId!,
      totalPages: pages.length,
      fileSize: file.size,
      mimeType: file.type,
    });

    const filePath = await documentService.saveFile(
      file,
      userId,
      documentDoc._id.toString()
    );

    documentDoc.filePath = filePath;
    await documentDoc.save();

    const chunks: {
      docId: Types.ObjectId;
      pageNumber: number;
      chunkIndex: number;
      text: string;
    }[] = [];
    for (const page of pages) {
      const pageChunks = documentService.chunkText(page.text, 512, 50);

      pageChunks.forEach((chunkText, idx) => {
        chunks.push({
          docId: documentDoc._id,
          pageNumber: page.num,
          chunkIndex: idx,
          text: chunkText,
        });
      });
    }

    const embeddings = await generateEmbeddings(chunks.map((c) => c.text));

    const chunksToStore = chunks.map((chunk, idx) => ({
      ...chunk,
      embedding: embeddings[idx],
      tokenCount: chunk.text.split(" ").length,
    }));

    await Chunk.insertMany(chunksToStore).then(() => {
      console.log(`Inserted ${chunksToStore.length} chunks`);
    });

    return { document: documentDoc, chunks: chunksToStore.length };
  },

  chunkText: (text: string, chunkSize: number, overlap: number): string[] => {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize - overlap) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  },

  saveFile: async (file: File, userId: string, fileId: string) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadDir = path.join(process.cwd(), "uploads", userId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(
      uploadDir,
      `${fileId || Date.now()}_${file.name}`
    );
    fs.writeFileSync(filePath, buffer);
    return filePath;
  },
};
