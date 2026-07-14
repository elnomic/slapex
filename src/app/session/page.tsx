import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function SessionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Get trading plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('trading_plan')
    .eq('id', user.id)
    .single()

  const plan = profile?.trading_plan || {
    maxTradesPerDay: 3,
    maxRiskPerTrade: 2,
    tradingHours: { start: '09:00', end: '17:00' },
    rules: []
  }

  // Check for active session
  const { data: activeSession } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('started_at', { ascending: false })
    .limit(1)
    .single()

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <a href="/dashboard" className="text-gray-400 hover:text-white text-sm mb-2 block">
              ← Back to Dashboard
            </a>
            <h1 className="text-3xl font-bold">
              {activeSession ? 'Trading Session Active' : 'Start Trading Session'}
            </h1>
          </div>
          
          {activeSession && (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-green-500 text-sm font-medium">LIVE</span>
              </span>
            </div>
          )}
        </header>

        {activeSession ? (
          /* ACTIVE SESSION VIEW */
          <div className="space-y-6">
            {/* Timer Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
              <p className="text-gray-400 mb-2">Session Duration</p>
              <p className="text-5xl font-bold font-mono" id="session-timer">00:00:00</p>
              <p className="text-sm text-gray-500 mt-2">
                Started at {new Date(activeSession.started_at).toLocaleTimeString()}
              </p>
            </div>

            {/* Boredom Status */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Boredom Monitor</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: '15%' }}
                    id="boredom-bar"
                  ></div>
                </div>
                <span className="text-sm text-gray-400 w-12 text-right" id="boredom-level">Low</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-400">Last Activity</p>
                  <p className="text-lg font-semibold" id="last-activity">Just now</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-400">Boredom Alerts</p>
                  <p className="text-lg font-semibold">{activeSession.boredom_alerts || 0}</p>
                </div>
              </div>
            </div>

            {/* Manual "I'm Bored" Button */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
              <p className="text-sm text-gray-400 mb-4">
                Feeling bored or tempted to overtrade? Hit the button.
              </p>
              
              <div className="grid grid-cols-3 gap-3">
                <button className="bg-yellow-600/20 border border-yellow-600/50 rounded-xl p-4 text-center hover:bg-yellow-600/30 transition">
                  <span className="text-2xl block mb-1">😴</span>
                  <span className="text-sm font-medium">I&apos;m Bored</span>
                </button>
                
                <button className="bg-blue-600/20 border border-blue-600/50 rounded-xl p-4 text-center hover:bg-blue-600/30 transition">
                  <span className="text-2xl block mb-1">📋</span>
                  <span className="text-sm font-medium">Review Plan</span>
                </button>
                
                <button className="bg-red-600/20 border border-red-600/50 rounded-xl p-4 text-center hover:bg-red-600/30 transition">
                  <span className="text-2xl block mb-1">⏸️</span>
                  <span className="text-sm font-medium">Take Break</span>
                </button>
              </div>
            </div>

            {/* Rules Reminder */}
            <div className="bg-purple-900/30 border border-purple-800/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-3 text-purple-300">📋 Your Rules</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3">
                  <span className="text-sm">Max trades today</span>
                  <span className="font-bold text-purple-400">{plan.maxTradesPerDay}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3">
                  <span className="text-sm">Max risk per trade</span>
                  <span className="font-bold text-purple-400">{plan.maxRiskPerTrade}%</span>
                </div>
                <div className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3">
                  <span className="text-sm">Trading hours</span>
                  <span className="font-bold text-purple-400">
                    {plan.tradingHours?.start} - {plan.tradingHours?.end}
                  </span>
                </div>
              </div>

              {plan.rules && plan.rules.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Personal Rules:</p>
                  <ul className="space-y-1">
                    {plan.rules.map((rule: string, i: number) => (
                      <li key={i} className="text-sm text-gray-300 flex gap-2">
                        <span>•</span> {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* End Session Button */}
            <form action="/api/session/end" method="POST">
              <button
                type="submit"
                className="w-full bg-red-600/20 border border-red-600/50 text-red-400 hover:bg-red-600/30 p-4 rounded-xl font-semibold transition"
              >
                End Trading Session
              </button>
            </form>
          </div>
        ) : (
          /* START SESSION VIEW */
          <div className="space-y-6">
            {/* Trading Plan Summary */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Your Trading Plan</h3>
              
              {plan.rules && plan.rules.length > 0 ? (
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-sm text-gray-400">Max Trades/Day</span>
                    <span className="font-bold">{plan.maxTradesPerDay}</span>
                  </div>
                  <div className="flex justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-sm text-gray-400">Max Risk/Trade</span>
                    <span className="font-bold">{plan.maxRiskPerTrade}%</span>
                  </div>
                  <div className="flex justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-sm text-gray-400">Trading Hours</span>
                    <span className="font-bold">{plan.tradingHours?.start} - {plan.tradingHours?.end}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 mb-4">
                  <p className="text-gray-400 mb-3">No trading plan set up yet.</p>
                  <a href="/trading-plan" className="text-purple-400 hover:text-purple-300 text-sm">
                    Set up your trading plan →
                  </a>
                </div>
              )}
            </div>

            {/* Start Button */}
            <form action="/api/session/start" method="POST">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white p-6 rounded-2xl font-bold text-xl transition flex items-center justify-center gap-3"
              >
                <span className="text-2xl">▶</span>
                Begin Trading Session
              </button>
            </form>

            <p className="text-center text-sm text-gray-600">
              We&apos;ll monitor for boredom signals and intervene when needed.
            </p>
          </div>
        )}
      </div>

      {/* Boredom Detector Script (only in active session) */}
      {activeSession && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Simple boredom detection
              let lastActivity = Date.now();
              let boredomLevel = 0;
              
              // Track user activity
              ['mousemove', 'keypress', 'click', 'scroll', 'touchstart'].forEach(event => {
                document.addEventListener(event, () => {
                  lastActivity = Date.now();
                  if (boredomLevel > 0) {
                    boredomLevel = Math.max(0, boredomLevel - 10);
                    updateBoredomUI();
                  }
                });
              });
              
              // Check every 30 seconds
              setInterval(() => {
                const idleTime = (Date.now() - lastActivity) / 1000;
                const lastActivityEl = document.getElementById('last-activity');
                
                if (lastActivityEl) {
                  if (idleTime < 60) lastActivityEl.textContent = 'Just now';
                  else if (idleTime < 300) lastActivityEl.textContent = Math.floor(idleTime / 60) + 'm ago';
                  else lastActivityEl.textContent = Math.floor(idleTime / 300) + 'm ago';
                }
                
                // Increase boredom if idle > 5 minutes
                if (idleTime > 300) {
                  boredomLevel = Math.min(100, boredomLevel + 5);
                  updateBoredomUI();
                }
              }, 30000);
              
              // Update timer
              const startTime = new Date('${activeSession.started_at}').getTime();
              setInterval(() => {
                const now = Date.now();
                const diff = Math.floor((now - startTime) / 1000);
                const hours = Math.floor(diff / 3600);
                const minutes = Math.floor((diff % 3600) / 60);
                const seconds = diff % 60;
                
                const timerEl = document.getElementById('session-timer');
                if (timerEl) {
                  timerEl.textContent = 
                    String(hours).padStart(2, '0') + ':' +
                    String(minutes).padStart(2, '0') + ':' +
                    String(seconds).padStart(2, '0');
                }
              }, 1000);
              
              function updateBoredomUI() {
                const bar = document.getElementById('boredom-bar');
                const level = document.getElementById('boredom-level');
                
                if (bar) bar.style.width = boredomLevel + '%';
                if (level) {
                  if (boredomLevel < 30) level.textContent = 'Low';
                  else if (boredomLevel < 60) level.textContent = 'Medium';
                  else level.textContent = 'High';
                }
              }
            `
          }}
        />
      )}
    </div>
  );
                  }
