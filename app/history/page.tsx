import Link from 'next/link'
import { ArrowLeft, Plus, Clock, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { Footer } from '@/components/footer'
import { DeleteButton } from '@/components/delete-button'

function formatRelativeTime(date: string) {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const config = {
    high: { icon: CheckCircle, label: 'High', className: 'text-green-400 bg-green-400/10' },
    medium: { icon: AlertTriangle, label: 'Medium', className: 'text-yellow-400 bg-yellow-400/10' },
    low: { icon: HelpCircle, label: 'Low', className: 'text-red-400 bg-red-400/10' },
  }[confidence] || { icon: HelpCircle, label: 'Unknown', className: 'text-muted-foreground bg-muted' }

  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  )
}

function RuntimeBadge({ runtime }: { runtime: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
      {runtime}
    </span>
  )
}

export default async function HistoryPage() {
  const supabase = await createClient()

  const { data: incidents, error } = await supabase
    .from('incidents')
    .select('*')
    .order('created_at', { ascending: false })

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
            <span className="font-semibold">Incident History</span>
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
          {error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Failed to load incidents</p>
            </div>
          ) : !incidents || incidents.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold mb-2">No incidents yet</h2>
              <p className="text-muted-foreground mb-6">
                Start by analyzing your first deployment logs
              </p>
              <Button asChild>
                <Link href="/analyze">Analyze Logs</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-center gap-2"
                >
                  <Link
                    href={`/history/${incident.id}`}
                    className="flex-1 p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <p className="font-medium line-clamp-1">{incident.summary}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatRelativeTime(incident.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RuntimeBadge runtime={incident.runtime} />
                      <ConfidenceBadge confidence={incident.confidence} />
                    </div>
                  </Link>
                  <DeleteButton id={incident.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
