"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ImagePlus, X } from "lucide-react";
import { WarmTooltip } from "@/components/ui/WarmTooltip";
import { cn } from "@/lib/utils/cn";

/**
 * Reduce una foto en el navegador antes de enviarla: lado mayor de 1280 px y
 * JPEG; si aún pesa mucho, baja calidad y tamaño. Así una foto de móvil de
 * 5 MB viaja en ~300 KB y cabe en el email.
 */
async function compress(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  for (const [side, quality] of [
    [1280, 0.8],
    [1024, 0.7],
    [800, 0.6],
  ] as const) {
    const scale = Math.min(1, side / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL("image/jpeg", quality);
    if (url.length <= 680_000) return url;
  }
  throw new Error("too-big");
}

type PhotoPickerProps = {
  value: string[];
  onChange: (photos: string[]) => void;
  max: number;
  copy: {
    label: string;
    add: string;
    hint: string;
    tooltip: string;
    remove: string;
    error: string;
  };
  error?: string;
};

/** Selector de fotos con miniaturas que entran con un muelle y se pueden quitar. */
export function PhotoPicker({ value, onChange, max, copy, error }: PhotoPickerProps) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [readError, setReadError] = useState<string | null>(null);
  const message = readError ?? error;

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setReadError(null);
    const next = [...value];
    for (const file of Array.from(files).slice(0, max - value.length)) {
      try {
        next.push(await compress(file));
      } catch {
        setReadError(copy.error);
      }
    }
    onChange(next);
    setBusy(false);
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-sm font-semibold">{copy.label}</span>
        <span className="text-fg-muted text-sm">(opcional)</span>
        <WarmTooltip content={copy.tooltip} label={copy.tooltip}>
          <span
            aria-hidden
            className="rounded-pill bg-bg grid size-5 place-items-center text-xs font-black"
          >
            ?
          </span>
        </WarmTooltip>
      </div>

      <ul className="flex flex-wrap gap-3">
        <AnimatePresence initial={false}>
          {value.map((src, i) => (
            <motion.li
              key={src.slice(-40)}
              layout
              className="relative size-24"
              initial={{ scale: 0.5, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: i % 2 ? 3 : -3, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 20 }}
            >
              <Image
                src={src}
                alt={`Foto ${i + 1} de tu reseña`}
                fill
                unoptimized
                sizes="96px"
                className="border-bg shadow-card rounded-md border-4 object-cover"
              />
              <button
                type="button"
                aria-label={`${copy.remove} ${i + 1}`}
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="rounded-pill bg-fg text-primary absolute -top-2 -right-2 grid size-7 place-items-center transition-transform hover:scale-110"
              >
                <X aria-hidden size={16} />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>

        {value.length < max && (
          <li>
            <label
              htmlFor={id}
              className={cn(
                "border-fg-muted hover:border-fg hover:bg-bg flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed text-xs font-semibold transition-colors",
                "has-[:focus-visible]:outline-ring has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3",
                busy && "animate-pulse"
              )}
            >
              <ImagePlus aria-hidden size={24} />
              {copy.add}
              <input
                id={id}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                aria-describedby={`${id}-hint`}
                disabled={busy}
                onChange={(e) => {
                  void onFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </li>
        )}
      </ul>

      <p
        id={`${id}-hint`}
        className={cn(
          "mt-1.5 text-sm",
          message ? "text-accent font-semibold" : "text-fg-muted"
        )}
      >
        {message ?? copy.hint}
      </p>
    </div>
  );
}
