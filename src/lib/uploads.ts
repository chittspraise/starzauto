import "server-only";
import { randomUUID } from "node:crypto";
import { adminClient, check, PHOTO_BUCKET } from "./supabase";

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

/** Uploads validated photos to Supabase Storage and returns their object paths. */
export async function savePhotos(files: File[]): Promise<string[]> {
  return Promise.all(
    files.map(async (file) => {
      const name = `${randomUUID()}${EXTENSIONS[file.type]}`;
      check(
        await adminClient().storage.from(PHOTO_BUCKET).upload(name, file, {
          contentType: file.type,
          cacheControl: "31536000",
        }),
      );
      return name;
    }),
  );
}

export async function deletePhotos(names: string[]) {
  if (names.length === 0) return;
  check(await adminClient().storage.from(PHOTO_BUCKET).remove(names));
}
