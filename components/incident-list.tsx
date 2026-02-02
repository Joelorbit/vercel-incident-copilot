'use client'

import useSWR from 'swr'
import { IncidentCard } from '@/components/incident-card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Incident } from '@/lib/types'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function IncidentList() {
  const { data, error, isLoading } = useSWR<{ incidents: Incident[] }>(
    '/api/incidents',
    fetcher
  )

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full bg-card" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
        <p className="text-sm text-destructive">Failed to load incidents</p>
      </div>
    )
  }

  if (!data?.incidents || data.incidents.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground mb-4">No incidents analyzed yet</p>
        <Link
          href="/"
          className="text-sm text-foreground hover:underline underline-offset-4"
        >
          Analyze your first log
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.incidents.map((incident) => (
        <IncidentCard key={incident.id} incident={incident} />
      ))}
    </div>
  )
}
