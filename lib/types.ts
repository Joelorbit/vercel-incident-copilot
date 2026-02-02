export interface Log {
  id: string
  raw_text: string
  created_at: string
}

export interface Incident {
  id: string
  log_id: string
  summary: string
  root_cause: string
  suggested_fix: string
  runtime: string
  confidence: string
  created_at: string
}

export interface IncidentAnalysis {
  summary: string
  root_cause: string
  suggested_fix: string
  runtime: string
  confidence: 'high' | 'medium' | 'low'
}
