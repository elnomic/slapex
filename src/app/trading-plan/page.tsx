import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function TradingPlanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

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

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <header className="mb-8">
          <a href="/dashboard" className="text-gray-400 hover:text-white text-sm mb-4 block">
            ← Back to Dashboard
          </a>
          <h1 className="text-3xl font-bold">Trading Plan</h1>
          <p className="text-gray-400 mt-1">Define your rules. We&apos;ll help you stick to them.</p>
        </header>

        <form className="space-y-6">
          {/* Max Trades Per Day */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <label className="text-lg font-semibold mb-3 block">
              Max Trades Per Day
            </label>
            <p className="text-sm text-gray-400 mb-3">
              Stop trading after this many entries to prevent overtrading.
            </p>
            <input
              name="maxTradesPerDay"
              type="number"
              defaultValue={plan.maxTradesPerDay}
              min={1}
              max={20}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Max Risk Per Trade */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <label className="text-lg font-semibold mb-3 block">
              Max Risk Per Trade (%)
            </label>
            <p className="text-sm text-gray-400 mb-3">
              Maximum account risk per single trade.
            </p>
            <input
              name="maxRiskPerTrade"
              type="number"
              defaultValue={plan.maxRiskPerTrade}
              min={0.1}
              max={100}
              step={0.1}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Trading Hours */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <label className="text-lg font-semibold mb-3 block">
              Trading Hours
            </label>
            <p className="text-sm text-gray-400 mb-3">
              Define your active trading window.
            </p>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">Start</label>
                <input
                  name="tradingStart"
                  type="time"
                  defaultValue={plan.tradingHours?.start || '09:00'}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">End</label>
                <input
                  name="tradingEnd"
                  type="time"
                  defaultValue={plan.tradingHours?.end || '17:00'}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Personal Rules */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <label className="text-lg font-semibold mb-3 block">
              Personal Trading Rules
            </label>
            <p className="text-sm text-gray-400 mb-3">
              Add rules you want to follow (e.g., &ldquo;No trading first 30 minutes&rdquo;).
            </p>
            <textarea
              name="rules"
              rows={5}
              defaultValue={plan.rules?.join('\n') || ''}
              placeholder="Enter your rules, one per line..."
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl font-bold text-lg transition"
          >
            Save Trading Plan
          </button>
        </form>
      </div>
    </div>
  );
            }
