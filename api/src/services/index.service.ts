import { Chunk, Document } from "@knowledgescout/schemas";
import { Types } from "mongoose";
import { parseDocument } from "~/lib/parser";
import * as fs from "node:fs";
import { generateEmbeddings } from "~/lib";
import { documentService } from "./document.service";

export const indexService = {
  rebuildIndex: async (userId: string) => {
    const userDocs = await Document.find({ userId }).lean();
    console.log(`Found ${userDocs.length} documents for user:`, userId);

    const chunks: {
      docId: Types.ObjectId;
      pageNumber: number;
      chunkIndex: number;
      text: string;
    }[] = [];

    for (const doc of userDocs) {
      console.log("processing doc:", doc._id, " on file path:", doc.filePath);

      const buffer = fs.readFileSync(doc.filePath);

      const file = new File([buffer], doc.originalName, { type: doc.mimeType });
      const { pages } = await parseDocument(file);

      for (const page of pages) {
        const pageChunks = documentService.chunkText(page.text, 512, 50);
        pageChunks.forEach((chunkText, idx) => {
          chunks.push({
            docId: doc._id,
            pageNumber: page.num,
            chunkIndex: idx,
            text: chunkText,
          });
        });
      }
    }
    const embeddings = await generateEmbeddings(chunks.map((c) => c.text));

    const chunksToStore = chunks.map((chunk, idx) => ({
      ...chunk,
      embedding: embeddings[idx],
      tokenCount: chunk.text.split(" ").length,
    }));

    await Chunk.deleteMany({ docId: { $in: userDocs.map((d) => d._id) } });
    await Chunk.insertMany(chunksToStore).then(() => {
      console.log(`Inserted ${chunksToStore.length} chunks for user:`, userId);
    });

    return { chunks: chunks.length };
  },

  getStats: async (userId: string) => {
    const totalDocs = await Document.countDocuments({ userId });
    const indexedDocs = await Chunk.countDocuments({
      docId: {
        $in: (await Document.find({ userId }).select("_id")).map((d) => d._id),
      },
    });

    return { totalDocs, indexedDocs };
  },
};
