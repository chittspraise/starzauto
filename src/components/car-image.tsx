import Image from "next/image";
import { imageUrl } from "@/lib/format";

type Props = {
  image?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
};

/** Fills its (relatively positioned) parent; shows a placeholder when the car has no photos. */
export function CarImage({ image, alt, sizes, priority }: Props) {
  if (!image) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-neutral-200 to-neutral-300 text-neutral-500">
        <svg viewBox="0 0 64 32" className="w-1/3" fill="currentColor" aria-hidden>
          <path d="M8 22c-2 0-4-1-4-3v-3c0-2 1-3 3-4l8-2 7-6c1-1 3-2 5-2h12c2 0 4 1 5 2l6 6 7 2c2 1 3 2 3 4v3c0 2-2 3-4 3h-3a6 6 0 0 0-12 0H23a6 6 0 0 0-12 0zm9-12h11V6h-5c-1 0-2 0-3 1zm14 0h13l-4-3c-1-1-2-1-3-1h-6zM17 26a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm30 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
        </svg>
        <span className="text-xs font-medium uppercase tracking-wide">Photo coming soon</span>
      </div>
    );
  }
  return (
    <Image
      src={imageUrl(image)}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
    />
  );
}
