import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function POST() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Check for existing active session
  const { data: existingSession } = await supabase
    .from('sessions')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (existingSession) {
    // End existing session first
    await supabase
      .from('sessions')
      .update({ 
        status: 'abandoned',
        ended_at: new Date().toISOString()
      })
      .eq('id', existingSession.id)
  }

  // Create new session
  const { error } = await supabase
    .from('sessions')
    .insert({
      user_id: user.id,
      status: 'active',
      started_at: new Date().toISOString()
    })

  if (error) {
    redirect('/session?error=Could not start session')
  }

  redirect('/session')
}
