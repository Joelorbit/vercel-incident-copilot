'use client'

import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { Incident, Log } from '@/lib/types'
import {
  AlertCircle,
  FileText,
  Lightbulb,
  Search,
  Server,
  Shield,
} from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface IncidentDetailProps {
  incidentId: string
}

function getConfidenceBadge(confidence: string) {
  switch (confidence) {
    case 'high':
      return (
        <Badge className="bg-success/20 text-success border-success/30 hover:bg-success/20">
          High Confidence
        </Badge>
      )
    case 'medium':
      return (
        <Badge className="bg-warning/20 text-warning border-warning/30 hover:bg-warning/20">
          Medium Confidence
        </Badge>
      )
    case 'low':
      return <Badge variant="secondary">Low Confidence</Badge>
    default:
      return <Badge variant="secondary">{confidence}</Badge>
  }
}

export function IncidentDetail({ incidentId }: IncidentDetailProps) {
  const { data, error, isLoading } = useSWR<{ incident: Incident; log: Log }>(
    `/api/incidents/${incidentId}`,
    fetcher
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full bg-card" />
        <Skeleton className="h-48 w-full bg-card" />
        <Skeleton className="h-48 w-full bg-card" />
      </div>
    )
  }

  if (error || !data?.incident) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
        <p className="text-sm text-destructive">Failed to load incident</p>
      </div>
    )
  }

  const { incident, log } = data

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Summary</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                <Server className="h-3 w-3 mr-1" />
                {incident.runtime}
              </Badge>
              {getConfidenceBadge(incident.confidence)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{incident.summary}</p>
        </CardContent>
      </Card>

      {/* Root Cause Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Root Cause</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {incident.root_cause}
          </p>
        </CardContent>
      </Card>

      {/* Suggested Fix Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Suggested Fix</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {incident.suggested_fix}
          </p>
        </CardContent>
      </Card>

      {/* Original Logs Card */}
      {log && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Original Logs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-md bg-secondary p-4 text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all">
              {log.raw_text}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
