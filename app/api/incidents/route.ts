import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: incidents, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching incidents:', error)
      return Response.json({ error: 'Failed to fetch incidents' }, { status: 500 })
    }

    return Response.json({ incidents })
  } catch (error) {
    console.error('Fetch error:', error)
    return Response.json({ error: 'Failed to fetch incidents' }, { status: 500 })
  }
}
