"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { MotionConfig, motion } from "motion/react";
import { cn } from "@/lib/utils/cn";

type SpringCheckProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "children"
> & {
  checked: boolean;
  label: ReactNode;
  error?: string;
};

/**
 * Casilla con muelle: al marcarla la caja da un bote y el tic se dibuja solo
 * (pathLength). Debajo hay un <input type="checkbox"> real (invisible), así
 * que funciona con teclado, lectores de pantalla y React Hook Form.
 */
export const SpringCheck = forwardRef<HTMLInputElement, SpringCheckProps>(
  function SpringCheck({ checked, label, error, id, className, ...input }, ref) {
    const errorId = error ? `${id}-error` : undefined;

    return (
      <MotionConfig reducedMotion="user">
        <div className={className}>
          <label htmlFor={id} className="group flex cursor-pointer items-start gap-3">
            <input
              ref={ref}
              id={id}
              type="checkbox"
              checked={checked}
              aria-invalid={Boolean(error)}
              aria-describedby={errorId}
              className="peer sr-only"
              {...input}
            />
            <motion.span
              aria-hidden
              className={cn(
                "mt-0.5 grid size-7 shrink-0 place-items-center rounded-sm border-2 transition-colors",
                "peer-focus-visible:outline-ring peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3",
                checked
                  ? "border-fg bg-fg"
                  : "border-fg-muted bg-bg group-hover:border-fg",
                error && !checked && "border-accent"
              )}
              animate={checked ? { scale: [1, 0.8, 1.15, 1] } : { scale: 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <svg viewBox="0 0 24 24" className="text-primary size-5">
                <motion.path
                  d="M5 12.5l4.5 4.5L19 7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={false}
                  animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                    delay: checked ? 0.08 : 0,
                  }}
                />
              </svg>
            </motion.span>
            <span className="text-sm leading-relaxed">{label}</span>
          </label>
          {error && (
            <p id={errorId} className="text-accent mt-1.5 ml-10 text-sm font-semibold">
              {error}
            </p>
          )}
        </div>
      </MotionConfig>
    );
  }
);
