"use client";

import { useState } from "react";
import { CarImage } from "./car-image";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-200">
        <CarImage image={images[active]} alt={alt} sizes="(min-width: 1024px) 60vw, 100vw" priority />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, i) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`relative aspect-[4/3] overflow-hidden rounded-lg ring-2 ${
                i === active ? "ring-red-600" : "ring-transparent hover:ring-neutral-300"
              }`}
            >
              <CarImage image={image} alt="" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
