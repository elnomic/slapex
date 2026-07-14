import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function POST() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Find active session
  const { data: activeSession } = await supabase
    .from('sessions')
    .select('id, started_at')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (activeSession) {
    const startTime = new Date(activeSession.started_at).getTime()
    const endTime = Date.now()
    const durationMinutes = Math.floor((endTime - startTime) / 60000)

    await supabase
      .from('sessions')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        duration_minutes: durationMinutes
      })
      .eq('id', activeSession.id)
  }

  redirect('/session/reflection')
}
