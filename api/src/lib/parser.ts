import { createRequire } from "module";
// @ts-ignore
const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFParse = require("pdf-parse");

export const parseDocument = async (file: File) => {
  const buffer = await file.arrayBuffer();
  console.log("Parsing document:", file.name, file.type, file.size);

  if (file.type === "application/pdf") {
    const pdf = await PDFParse(Buffer.from(buffer));

    const sortedPages = pdf.pages.sort((a: any, b: any) => a.num - b.num);

    return {
      text: pdf.text,
      pages: sortedPages,
    };
  }

  throw new Error("Unsupported file type");
};
