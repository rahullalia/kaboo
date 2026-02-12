import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "kaboo" | "caution" | "danger" | "success"
}

export default function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        {
          "bg-zinc-700 text-zinc-300": variant === "default",
          "bg-cyan-500/20 text-cyan-300": variant === "kaboo",
          "bg-amber-500/20 text-amber-300": variant === "caution",
          "bg-red-500/20 text-red-300": variant === "danger",
          "bg-emerald-500/20 text-emerald-300": variant === "success",
        },
        className
      )}
      {...props}
    />
  )
}
