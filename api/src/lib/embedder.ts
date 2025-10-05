import { FeatureExtractionPipeline, pipeline } from "@xenova/transformers";

let embedder: FeatureExtractionPipeline | null = null;

const VECTOR_DIMENSIONS = 384;

export const getEmbedder = async () => {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
};

export const generateEmbeddings = async (
  texts: string[],
  batchSize: number = 32
): Promise<number[][]> => {
  const extractor = await getEmbedder();
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const response = await extractor(batch, {
      pooling: "mean",
      normalize: true,
    });

    const batchEmbeddings = response.tolist();
    allEmbeddings.push(...batchEmbeddings);

    console.log(
      `Processed ${Math.min(i + batchSize, texts.length)}/${
        texts.length
      } chunks`
    );
  }

  return allEmbeddings;
};
