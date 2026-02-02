import { createClient } from '@/lib/supabase/server'

interface IncidentAnalysis {
  summary: string
  root_cause: string
  suggested_fix: string
  runtime: 'nodejs' | 'edge' | 'python' | 'other'
  confidence: 'high' | 'medium' | 'low'
}

function parseAnalysis(text: string): IncidentAnalysis {
  const lines = text.split('\n')
  let summary = ''
  let rootCause = ''
  let suggestedFix = ''
  let runtime: 'nodejs' | 'edge' | 'python' | 'other' = 'nodejs'
  let confidence: 'high' | 'medium' | 'low' = 'medium'

  let currentSection = ''

  for (const line of lines) {
    const lowerLine = line.toLowerCase()
    
    if (lowerLine.includes('summary:') || lowerLine.includes('**summary')) {
      currentSection = 'summary'
      const content = line.split(/summary[:\s]*/i)[1]?.trim()
      if (content) summary = content
    } else if (lowerLine.includes('root cause:') || lowerLine.includes('**root cause')) {
      currentSection = 'rootCause'
      const content = line.split(/root cause[:\s]*/i)[1]?.trim()
      if (content) rootCause = content
    } else if (lowerLine.includes('suggested fix:') || lowerLine.includes('**suggested fix') || lowerLine.includes('fix:')) {
      currentSection = 'suggestedFix'
      const content = line.split(/(?:suggested )?fix[:\s]*/i)[1]?.trim()
      if (content) suggestedFix = content
    } else if (lowerLine.includes('runtime:') || lowerLine.includes('**runtime')) {
      currentSection = 'runtime'
      const content = line.toLowerCase()
      if (content.includes('edge')) runtime = 'edge'
      else if (content.includes('python')) runtime = 'python'
      else if (content.includes('node')) runtime = 'nodejs'
      else runtime = 'other'
    } else if (lowerLine.includes('confidence:') || lowerLine.includes('**confidence')) {
      currentSection = 'confidence'
      const content = line.toLowerCase()
      if (content.includes('high')) confidence = 'high'
      else if (content.includes('low')) confidence = 'low'
      else confidence = 'medium'
    } else if (line.trim() && currentSection) {
      if (currentSection === 'summary' && !summary) summary = line.trim()
      else if (currentSection === 'rootCause') rootCause += (rootCause ? ' ' : '') + line.trim()
      else if (currentSection === 'suggestedFix') suggestedFix += (suggestedFix ? ' ' : '') + line.trim()
    }
  }

  return {
    summary: summary || 'Analysis completed',
    root_cause: rootCause || 'Unable to determine specific root cause',
    suggested_fix: suggestedFix || 'Review the logs for more details',
    runtime,
    confidence,
  }
}

export async function POST(req: Request) {
  try {
    const { logText } = await req.json()

    if (!logText || typeof logText !== 'string' || logText.trim().length === 0) {
      return Response.json({ error: 'Log text is required' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return Response.json({ error: 'GROQ_API_KEY is not configured' }, { status: 500 })
    }

    const supabase = await createClient()

    // Insert log into database
    const { data: logData, error: logError } = await supabase
      .from('logs')
      .insert({ raw_text: logText })
      .select()
      .single()

    if (logError) {
      console.error('[v0] Error inserting log:', logError)
      return Response.json({ error: 'Failed to save log' }, { status: 500 })
    }

    // Call Groq API directly
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are an expert Vercel deployment incident analyst. Analyze logs and respond in this exact format:

Summary: [1-2 sentence summary of the issue]

Root Cause: [Detailed explanation of what caused the issue]

Suggested Fix: [Step-by-step actionable fix]

Runtime: [nodejs, edge, python, or other]

Confidence: [high, medium, or low]`,
          },
          {
            role: 'user',
            content: `Analyze these deployment logs:\n\n${logText}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    })

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text()
      console.error('[v0] Groq API error:', errorText)
      return Response.json({ error: `AI service error: ${groqResponse.status}` }, { status: 500 })
    }

    const groqData = await groqResponse.json()
    const text = groqData.choices?.[0]?.message?.content

    if (!text) {
      return Response.json({ error: 'Failed to analyze logs - no response from AI' }, { status: 500 })
    }

    const analysis = parseAnalysis(text)

    // Insert incident into database
    const { data: incidentData, error: incidentError } = await supabase
      .from('incidents')
      .insert({
        log_id: logData.id,
        summary: analysis.summary,
        root_cause: analysis.root_cause,
        suggested_fix: analysis.suggested_fix,
        runtime: analysis.runtime,
        confidence: analysis.confidence,
      })
      .select()
      .single()

    if (incidentError) {
      console.error('[v0] Error inserting incident:', incidentError)
      return Response.json({ error: 'Failed to save incident' }, { status: 500 })
    }

    return Response.json({ incident: incidentData })
  } catch (error) {
    console.error('[v0] Analysis error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return Response.json({ error: `Analysis failed: ${errorMessage}` }, { status: 500 })
  }
}
