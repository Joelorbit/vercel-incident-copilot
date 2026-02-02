'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Zap } from 'lucide-react'

export function LogInputForm() {
  console.log('[v0] LogInputForm rendering')
  const [logText, setLogText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!logText.trim()) {
      setError('Please paste your logs')
      return
    }

    setIsAnalyzing(true)

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

      router.push(`/incidents/${data.incident.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="logs"
          className="text-sm font-medium text-foreground"
        >
          Deployment Logs
        </label>
        <Textarea
          id="logs"
          placeholder="Paste your Vercel deployment or function logs here..."
          className="min-h-[300px] font-mono text-sm bg-card border-border placeholder:text-muted-foreground resize-none"
          value={logText}
          onChange={(e) => setLogText(e.target.value)}
          disabled={isAnalyzing}
        />
        <p className="text-xs text-muted-foreground">
          Supports build logs, runtime errors, and function invocation logs
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button
        type="submit"
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
          <>
            <Zap className="mr-2 h-4 w-4" />
            Analyze Logs
          </>
        )}
      </Button>
    </form>
  )
}
