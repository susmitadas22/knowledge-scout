import z from "zod";

export const askSchema = z.object({
  query: z.string().min(1, "Query is required"),
  k: z.number().min(1).max(10).optional(),
});

export type AskInput = z.infer<typeof askSchema>;
