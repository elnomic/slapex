import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ReflectionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Get last completed session
  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('ended_at', { ascending: false })
    .limit(1)
    .single()

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-2">Session Complete! 🎉</h1>
          <p className="text-gray-400 mb-6">
            Great job staying disciplined. Quick reflection before you go.
          </p>

          {session && (
            <div className="bg-gray-800 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-purple-400">{session.duration_minutes || 0}m</p>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">{session.boredom_alerts || 0}</p>
                  <p className="text-xs text-gray-500">Alerts</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">How was your session? (1-5)</label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className="flex-1 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition text-lg"
                  >
                    {rating === 1 ? '😞' : rating === 2 ? '😐' : rating === 3 ? '🙂' : rating === 4 ? '😊' : '🤩'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Any thoughts or lessons learned?</label>
              <textarea
                name="reflection"
                rows={3}
                placeholder="What worked? What triggered you? What will you do differently?"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl font-semibold transition"
            >
              Save & Return to Dashboard
            </button>

            <a
              href="/dashboard"
              className="block text-center text-sm text-gray-500 hover:text-gray-400 mt-3"
            >
              Skip for now
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
