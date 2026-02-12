"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

interface HeaderProps {
  title: string
  showBack?: boolean
  backHref?: string
  action?: React.ReactNode
}

export default function Header({
  title,
  showBack = false,
  backHref,
  action,
}: HeaderProps) {
  const router = useRouter()

  return (
    <header className="flex items-center justify-between px-4 py-4 border-b border-zinc-700/50">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => (backHref ? router.push(backHref) : router.back())}
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </button>
        )}
        <h1 className="text-lg font-bold text-zinc-100">{title}</h1>
      </div>
      {action && <div>{action}</div>}
    </header>
  )
}
