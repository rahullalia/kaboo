"use client"

import { cn } from "@/lib/utils"
import { InputHTMLAttributes, forwardRef } from "react"

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full h-11 rounded-xl bg-zinc-900/80 border border-zinc-600/50 px-3 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400/50 focus:border-zinc-400/50 transition-colors",
        className
      )}
      {...props}
    />
  )
})
Input.displayName = "Input"

export default Input
