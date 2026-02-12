import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import Providers from "@/components/Providers"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Kaboo Score Tracker",
  description: "Track scores for the card game Kaboo (Cabo)",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#09090b",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <Providers>
          <div className="mx-auto max-w-lg min-h-dvh flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
