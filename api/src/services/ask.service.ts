import { generateEmbeddings, mongo } from "~/lib";
import { AskInput } from "~/validators";
import * as crypto from "node:crypto";
import { QueryCache } from "@knowledgescout/schemas";

export const askService = {
  async ask(userId: string, input: AskInput) {
    const { query, k = 5 } = input;

    const queryHash = crypto
      .createHash("md5")
      .update(query + userId)
      .digest("hex");

    const cached = await QueryCache.findOne({
      queryHash,
      createdAt: { $gt: new Date(Date.now() - 60000) },
    });

    if (cached) {
      return { ...cached.result, cached: true };
    }

    const queryEmbedding = await generateEmbeddings([query]);

    const results = await mongo
      .collection("chunks")
      .aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryEmbedding[0],
            numCandidates: k * 10,
            limit: k,
          },
        },
        {
          $lookup: {
            from: "documents",
            localField: "docId",
            foreignField: "_id",
            as: "document",
          },
        },
        {
          $project: {
            text: 1,
            pageNumber: 1,
            score: { $meta: "vectorSearchScore" },
            docId: 1,
            filename: { $arrayElemAt: ["$document.filename", 0] },
          },
        },
      ])
      .toArray();

    const answer = {
      query,
      sources: results.map((r) => ({
        text: r.text,
        page: r.pageNumber,
        filename: r.filename,
        docId: r.docId,
        score: r.score,
      })),
    };

    await QueryCache.create({
      userId,
      query,
      queryHash,
      result: answer,
    });

    return answer;
  },
};
