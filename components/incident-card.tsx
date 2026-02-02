import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Incident } from '@/lib/types'
import { ChevronRight, Clock } from 'lucide-react'

interface IncidentCardProps {
  incident: Incident
}

function getConfidenceBadge(confidence: string) {
  switch (confidence) {
    case 'high':
      return <Badge className="bg-success/20 text-success border-success/30 hover:bg-success/20">High</Badge>
    case 'medium':
      return <Badge className="bg-warning/20 text-warning border-warning/30 hover:bg-warning/20">Medium</Badge>
    case 'low':
      return <Badge variant="secondary">Low</Badge>
    default:
      return <Badge variant="secondary">{confidence}</Badge>
  }
}

function getRuntimeBadge(runtime: string) {
  return (
    <Badge variant="outline" className="font-mono text-xs">
      {runtime}
    </Badge>
  )
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

export function IncidentCard({ incident }: IncidentCardProps) {
  return (
    <Link href={`/incidents/${incident.id}`}>
      <Card className="bg-card border-border hover:border-muted-foreground/30 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground line-clamp-2 text-pretty">
                {incident.summary}
              </p>
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                {getRuntimeBadge(incident.runtime)}
                {getConfidenceBadge(incident.confidence)}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDate(incident.created_at)}
                </span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
