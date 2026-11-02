import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/db";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

// Only names we generate ourselves (uuid + extension) are served.
const SAFE_NAME = /^[a-f0-9-]{36}\.(jpg|png|webp)$/;

export async function GET(_req: Request, ctx: RouteContext<"/uploads/[name]">) {
  const { name } = await ctx.params;
  if (!SAFE_NAME.test(name)) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const file = await readFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name));
    return new Response(file, {
      headers: {
        "Content-Type": CONTENT_TYPES[path.extname(name)],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
