import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground">
            <AlertTriangle className="h-4 w-4 text-background" />
          </div>
          <span className="font-semibold text-foreground">Incident Copilot</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            New Analysis
          </Link>
          <Link
            href="/incidents"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            History
          </Link>
        </nav>
      </div>
    </header>
  )
}
