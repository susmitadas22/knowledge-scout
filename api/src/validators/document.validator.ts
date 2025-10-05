import z from "zod";

export const listDocumentQuery = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, {
      message: "Limit must be between 1 and 100",
    }),

  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0))
    .refine((val) => val >= 0, {
      message: "Offset must be greater than or equal to 0",
    }),
});

export type ListDocumentQuery = z.infer<typeof listDocumentQuery>;

export const getDocumentParams = z.object({
  id: z.string().min(1, { message: "Document ID is required" }),
});

export type GetDocumentParams = z.infer<typeof getDocumentParams>;
