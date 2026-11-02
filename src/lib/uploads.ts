import "server-only";
import { randomUUID } from "node:crypto";
import { rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "./db";

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const MAX_PHOTOS = 12;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export function validatePhotos(files: File[]): string | null {
  for (const file of files) {
    if (!EXTENSIONS[file.type]) return `${file.name}: only JPG, PNG or WebP images are allowed.`;
    if (file.size > MAX_PHOTO_BYTES) return `${file.name}: each photo must be 5MB or smaller.`;
  }
  return null;
}

/** Saves validated photos and returns their stored file names. */
export async function savePhotos(files: File[]): Promise<string[]> {
  return Promise.all(
    files.map(async (file) => {
      const name = `${randomUUID()}${EXTENSIONS[file.type]}`;
      await writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
      return name;
    }),
  );
}

export async function deletePhotos(names: string[]) {
  await Promise.all(
    names.map((name) => rm(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, path.basename(name)), { force: true })),
  );
}
