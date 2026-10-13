import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  try {
    const contentPath = path.join(process.cwd(), "public", "content.json");
    const content = await readFile(contentPath, "utf8");
    const parsedContent: unknown = JSON.parse(content);

    return Response.json(parsedContent, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error(
      "Unable to read or parse portfolio content from public/content.json:",
      error,
    );

    return Response.json(
      { error: "Portfolio content is temporarily unavailable." },
      {
        status: 500,
        headers: { "Cache-Control": "no-store, max-age=0" },
      },
    );
  }
}
