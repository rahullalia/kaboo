"use client"

import { Toaster } from "sonner"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#27272a",
            border: "1px solid #3f3f46",
            color: "#f4f4f5",
          },
        }}
      />
    </>
  )
}
