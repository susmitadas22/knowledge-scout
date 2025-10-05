import { Hono } from "hono";
import { ValidationError } from "~/lib";
import { authMiddleware } from "~/middlewares";
import { documentService } from "~/services";
import { AuthSession } from "~/types";
import { getDocumentParams, listDocumentQuery } from "~/validators";

export const docsRoutes = new Hono<AuthSession>();

docsRoutes.use("*", authMiddleware);

docsRoutes.get("/:id", async (c) => {
  const params = c.req.param();
  const userId = c.get("user")?._id;

  const { success, data, error } = await getDocumentParams.safeParseAsync(
    params
  );

  if (!success) {
    throw new ValidationError(
      error.issues[0].code,
      error.issues[0].message,
      error.issues[0].path[0] as string
    );
  }

  const { id } = data;

  const result = await documentService.getDocumentById(id, userId!);

  return c.json({ result });
});

docsRoutes.get("/", async (c) => {
  const userId = c.get("user")?._id;
  const query = c.req.query();
  const { success, data, error } = await listDocumentQuery.safeParseAsync(
    query
  );

  if (!success) {
    throw new ValidationError(
      error.issues[0].code,
      error.issues[0].message,
      error.issues[0].path[0] as string
    );
  }

  const result = await documentService.listDocuments(userId!, data);

  return c.json(result);
});

docsRoutes.post("/", async (c) => {
  const body = await c.req.parseBody();
  const file = body.file;
  const userId = c.get("user")?._id;

  if (typeof file === "string") {
    throw new ValidationError("invalid_type", "File is required", "file");
  }

  const result = await documentService.uploadDocument(file, userId!);

  return c.json(result, 201);
});
