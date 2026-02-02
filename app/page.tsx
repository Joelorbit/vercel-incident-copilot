import Link from 'next/link'
import { ArrowRight, Zap, Clock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-foreground" />
            <span className="font-semibold">Incident Copilot</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/analyze" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Analyze
            </Link>
            <Link href="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              History
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-balance">
            AI-Powered Incident Triage for Vercel
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-balance">
            Paste your deployment logs and get instant root cause analysis, suggested fixes, and confidence scores powered by AI.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/analyze">
                Start Analyzing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/history">View History</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
              <Zap className="h-5 w-5 text-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Instant Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Get root cause analysis in seconds, not hours. Our AI understands Vercel-specific errors.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
              <Clock className="h-5 w-5 text-foreground" />
            </div>
            <h3 className="font-semibold mb-2">History Tracking</h3>
            <p className="text-sm text-muted-foreground">
              All your incidents are saved and searchable. Track patterns and recurring issues over time.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
              <Shield className="h-5 w-5 text-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Confidence Scores</h3>
            <p className="text-sm text-muted-foreground">
              Know how confident the AI is in its analysis with clear high, medium, and low indicators.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
