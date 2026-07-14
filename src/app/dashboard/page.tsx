import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Dashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get today's sessions count
  const today = new Date().toISOString().split('T')[0]
  const { count: sessionsToday } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('started_at', today)

  // Get total trades avoided this week
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  
  const { data: weekData } = await supabase
    .from('sessions')
    .select('trades_avoided')
    .eq('user_id', user.id)
    .gte('started_at', weekAgo.toISOString())

  const tradesAvoided = weekData?.reduce((sum, s) => sum + (s.trades_avoided || 0), 0) || 0

  // Calculate streak (consecutive days with sessions)
  const { data: allSessions } = await supabase
    .from('sessions')
    .select('started_at')
    .eq('user_id', user.id)
    .order('started_at', { ascending: false })

  let streak = 0
  if (allSessions && allSessions.length > 0) {
    const dates = allSessions.map(s => s.started_at.split('T')[0])
    const uniqueDates = [...new Set(dates)].sort().reverse()
    
    streak = 1
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = new Date(uniqueDates[i])
      const next = new Date(uniqueDates[i + 1])
      const diff = (current.getTime() - next.getTime()) / (1000 * 3600 * 24)
      
      if (diff === 1) {
        streak++
      } else {
        break
      }
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, <span className="text-purple-500">{profile?.full_name || user.email?.split('@')[0]}</span>
            </h1>
            <p className="text-gray-400 mt-1">Ready to trade with discipline today?</p>
          </div>
          
          <div className="flex gap-3">
            <Link
              href="/trading-plan"
              className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:bg-gray-900 transition"
            >
              Trading Plan
            </Link>
            <form action="/auth/signout" method="POST">
              <button className="px-4 py-2 bg-gray-800 rounded-lg text-sm text-gray-400 hover:text-white transition">
                Sign Out
              </button>
            </form>
          </div>
        </header>

        {/* Main CTA - Start Session */}
        <div className="bg-gradient-to-br from-purple-900/50 to-gray-900 border border-purple-800/50 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Begin Trading Session</h2>
              <p className="text-gray-400">Start a monitored session. We&apos;ll watch for boredom signals.</p>
            </div>
            <Link
              href="/session"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition flex items-center gap-2"
            >
              <span>▶</span>
              Start Session
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">Sessions Today</p>
            <p className="text-3xl font-bold">{sessionsToday || 0}</p>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">Trades Avoided</p>
            <p className="text-3xl font-bold text-green-500">{tradesAvoided}</p>
            <p className="text-xs text-gray-500 mt-1">this week</p>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">Day Streak</p>
            <p className="text-3xl font-bold text-purple-500">{streak}</p>
            <p className="text-xs text-gray-500 mt-1">consecutive days</p>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">Plan Compliance</p>
            <p className="text-3xl font-bold text-blue-500">--</p>
            <p className="text-xs text-gray-500 mt-1">start session to track</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/trading-plan"
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition group"
          >
            <p className="text-lg font-semibold mb-1">📋 Trading Plan</p>
            <p className="text-sm text-gray-400 group-hover:text-gray-300">
              Review & update your trading rules
            </p>
          </Link>
          
          <Link
            href="/reflections"
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition group"
          >
            <p className="text-lg font-semibold mb-1">📝 Reflections</p>
            <p className="text-sm text-gray-400 group-hover:text-gray-300">
              View your trading journal
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
      }
