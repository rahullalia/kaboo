"use client"

import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost"
  size?: "sm" | "md" | "lg"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]",
          {
            "bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:from-violet-600 hover:to-pink-600":
              variant === "primary",
            "bg-zinc-700 text-zinc-200 hover:bg-zinc-600":
              variant === "secondary",
            "bg-red-500/20 text-red-400 hover:bg-red-500/30":
              variant === "danger",
            "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800":
              variant === "ghost",
          },
          {
            "h-9 px-3 text-sm": size === "sm",
            "h-11 px-5 text-base": size === "md",
            "h-13 px-6 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export default Button
