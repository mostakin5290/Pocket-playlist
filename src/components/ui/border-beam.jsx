import { motion } from "motion/react";

import { cn } from "@/lib/utils"

export const BorderBeam = ({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  // tuned to match the AudioPlayer accent (theme-driven)
  colorFrom = "var(--accent-from)",
  colorTo = "var(--accent-to)",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 3
}) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]"
      style={{
        // border thickness used by the mask
        "--border-beam-width": `${borderWidth}px`,
        // subtle shadow similar to AudioPlayer card
        boxShadow: '0 3px 30px rgba(255,30,168,0.54), 0 6px 12px rgba(0,0,0,0.44)'
      }}>
      <motion.div
        className={cn(
          "absolute aspect-square",
          // gradient uses CSS variables so callers can override colors
          "bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent",
          // give it a soft glow and slightly reduced opacity so it blends as a beam
          "opacity-90 blur-[6px]",
          className
        )}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          // add a faint additive glow using filter and mixBlendMode for richer color
          mixBlendMode: 'screen',
          ...style
        }}
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }} />
    </div>
  );
}
