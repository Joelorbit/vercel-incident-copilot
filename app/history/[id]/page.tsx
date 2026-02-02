import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Plus, CheckCircle, AlertTriangle, HelpCircle, FileText, Lightbulb, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { Footer } from '@/components/footer'

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const config = {
    high: { icon: CheckCircle, label: 'High Confidence', className: 'text-green-400 bg-green-400/10 border-green-400/20' },
    medium: { icon: AlertTriangle, label: 'Medium Confidence', className: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
    low: { icon: HelpCircle, label: 'Low Confidence', className: 'text-red-400 bg-red-400/10 border-red-400/20' },
  }[confidence] || { icon: HelpCircle, label: 'Unknown', className: 'text-muted-foreground bg-muted border-border' }

  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}>
      <Icon className="h-4 w-4" />
      {config.label}
    </span>
  )
}

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: incident, error } = await supabase
    .from('incidents')
    .select('*, logs(*)')
    .eq('id', id)
    .single()

  if (error || !incident) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/history" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">History</span>
            </Link>
            <div className="h-4 w-px bg-border" />
            <span className="font-semibold">Incident Details</span>
          </div>
          <Button asChild size="sm">
            <Link href="/analyze">
              <Plus className="mr-2 h-4 w-4" />
              New Analysis
            </Link>
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-6">
          {/* Summary Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                {incident.runtime}
              </span>
              <ConfidenceBadge confidence={incident.confidence} />
            </div>
            <h1 className="text-2xl font-semibold text-balance">{incident.summary}</h1>
          </div>

          {/* Analysis Cards */}
          <div className="space-y-6">
            {/* Root Cause */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold">Root Cause</h2>
              </div>
              <p className="text-muted-foreground whitespace-pre-wrap">{incident.root_cause}</p>
            </div>

            {/* Suggested Fix */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold">Suggested Fix</h2>
              </div>
              <p className="text-muted-foreground whitespace-pre-wrap">{incident.suggested_fix}</p>
            </div>

            {/* Original Logs */}
            {incident.logs?.raw_text && (
              <div className="p-6 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-semibold">Original Logs</h2>
                </div>
                <pre className="text-sm text-muted-foreground font-mono overflow-x-auto whitespace-pre-wrap bg-secondary/50 p-4 rounded-lg">
                  {incident.logs.raw_text}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
