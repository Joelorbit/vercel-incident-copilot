'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Footer } from '@/components/footer'

export default function AnalyzePage() {
  const [logText, setLogText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAnalyze = async () => {
    if (!logText.trim()) {
      setError('Please paste your deployment logs')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logText }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      router.push(`/history/${data.incident.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="h-4 w-px bg-border" />
            <span className="font-semibold">Analyze Logs</span>
          </div>
          <Link href="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            History
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-2xl px-6">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">Paste Your Logs</h1>
            <p className="text-muted-foreground">
              Paste your Vercel deployment or function logs below. We will analyze them and provide root cause analysis.
            </p>
          </div>

          <div className="space-y-4">
            <Textarea
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
              placeholder={`Paste your logs here...

Example:
Error: Cannot find module 'next/server'
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:1145:15)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
Runtime: nodejs20.x
Deployment: myapp.vercel.app`}
              className="min-h-[300px] font-mono text-sm bg-card border-border resize-none"
              disabled={isAnalyzing}
            />

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !logText.trim()}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Logs'
              )}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
