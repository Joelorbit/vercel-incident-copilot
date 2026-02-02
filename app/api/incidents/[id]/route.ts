import { createClient } from '@/lib/supabase/server'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: incident, error: incidentError } = await supabase
      .from('incidents')
      .select('*')
      .eq('id', id)
      .single()

    if (incidentError) {
      console.error('Error fetching incident:', incidentError)
      return Response.json({ error: 'Incident not found' }, { status: 404 })
    }

    const { data: log, error: logError } = await supabase
      .from('logs')
      .select('*')
      .eq('id', incident.log_id)
      .single()

    if (logError) {
      console.error('Error fetching log:', logError)
    }

    return Response.json({ incident, log })
  } catch (error) {
    console.error('Fetch error:', error)
    return Response.json({ error: 'Failed to fetch incident' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { error } = await supabase
      .from('incidents')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting incident:', error)
      return Response.json({ error: 'Failed to delete incident' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return Response.json({ error: 'Failed to delete incident' }, { status: 500 })
  }
}
