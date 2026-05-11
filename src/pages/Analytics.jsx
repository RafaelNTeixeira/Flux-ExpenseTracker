import { useMemo, useState } from 'react'
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, LineChart, Line,
} from 'recharts'
import { useStore } from '../store/useStore'
import { CATEGORIES, CATEGORY_LIST } from '../utils/categories'

const fmt = (n) => `€${n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const MONTHS_LIST = [
  { key: '2026-05', label: 'May' },
  { key: '2026-04', label: 'Apr' },
  { key: '2026-03', label: 'Mar' },
  { key: '2026-02', label: 'Feb' },
]

const HEAT_MONTHS = [
  { key: '2026-05', label: 'May 2026' },
  { key: '2026-04', label: 'April 2026' },
  { key: '2026-03', label: 'March 2026' },
]

function SpendingHeatmap({ expenses, monthKey }) {
  const firstDay = new Date(`${monthKey}-01`)
  const days = eachDayOfInterval({ start: startOfMonth(firstDay), end: endOfMonth(firstDay) })
  const today = new Date('2026-05-11')

  const dailySpend = useMemo(() => {
    const map = {}
    expenses.filter(e => e.date.startsWith(monthKey)).forEach((e) => {
      if (!map[e.date]) map[e.date] = 0
      map[e.date] += e.amount
    })
    return map
  }, [expenses, monthKey])

  const values = Object.values(dailySpend)
  const maxSpend = values.length ? Math.max(...values) : 1

  const intensity = (amount) => {
    if (!amount) return 0
    const ratio = amount / maxSpend
    if (ratio > 0.75) return 4
    if (ratio > 0.5) return 3
    if (ratio > 0.25) return 2
    return 1
  }

  const colors = [
    'bg-bg-elevated border border-border-subtle',
    'bg-blue-900/40',
    'bg-blue-700/50',
    'bg-accent-blue/70',
    'bg-accent-blue',
  ]

  const startDow = days[0].getDay()

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-[10px] text-text-muted text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: startDow }).map((_, i) => <div key={`e-${i}`} />)}
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const spend = dailySpend[dateStr] || 0
          const lvl = intensity(spend)
          const isFuture = day > today
          const isToday = isSameDay(day, today)
          return (
            <div
              key={dateStr}
              title={spend ? `${format(day, 'MMM d')}: ${fmt(spend)}` : format(day, 'MMM d')}
              className={`aspect-square rounded flex items-center justify-center cursor-default transition-all ${isFuture ? 'opacity-20' : colors[lvl]} ${isToday ? 'ring-2 ring-accent-blue ring-offset-1 ring-offset-bg-card' : ''}`}
            >
              <span className="text-[8px] text-white/50 font-mono">{day.getDate()}</span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-end gap-1.5 mt-3">
        <span className="text-[10px] text-text-muted">Less</span>
        {colors.map((c, i) => (
          <div key={i} className={`w-4 h-4 rounded-sm ${c}`} />
        ))}
        <span className="text-[10px] text-text-muted">More</span>
      </div>
    </div>
  )
}

export default function Analytics() {
  const { expenses, salary, buckets, emergencyFundGoal, emergencyFundCurrent, setEmergencyFundGoal, setEmergencyFundCurrent } = useStore()
  const [heatmapMonth, setHeatmapMonth] = useState('2026-05')
  const [momCategory, setMomCategory] = useState('restaurants')

  // MoM data
  const momData = useMemo(() => {
    return MONTHS_LIST.map(({ key, label }) => {
      const monthExpenses = expenses.filter((e) => e.date.startsWith(key))
      const total = monthExpenses.reduce((s, e) => s + e.amount, 0)
      const catAmount = monthExpenses.filter((e) => e.category === momCategory).reduce((s, e) => s + e.amount, 0)
      return { month: label, total, [momCategory]: catAmount }
    }).reverse()
  }, [expenses, momCategory])

  // Spending by category over months
  const catTrendData = useMemo(() => {
    return MONTHS_LIST.map(({ key, label }) => {
      const monthExpenses = expenses.filter((e) => e.date.startsWith(key))
      const obj = { month: label }
      CATEGORY_LIST.slice(0, 5).forEach((cat) => {
        obj[cat.label] = monthExpenses.filter((e) => e.category === cat.id).reduce((s, e) => s + e.amount, 0)
      })
      return obj
    }).reverse()
  }, [expenses])

  // Savings analysis
  const savingsData = useMemo(() => {
    return MONTHS_LIST.map(({ key, label }) => {
      const monthExpenses = expenses.filter((e) => e.date.startsWith(key))
      const spent = monthExpenses.reduce((s, e) => s + e.amount, 0)
      const planned = salary * 0.2
      const actual = Math.max(salary - spent, 0)
      return { month: label, planned: Math.round(planned), actual: Math.round(actual) }
    }).reverse()
  }, [expenses, salary])

  // Emergency fund projection
  const avgMonthlySavings = useMemo(() => {
    const recentMonths = ['2026-04', '2026-03', '2026-02']
    const monthSavings = recentMonths.map((key) => {
      const spent = expenses.filter(e => e.date.startsWith(key)).reduce((s, e) => s + e.amount, 0)
      return Math.max(salary - spent, 0)
    })
    return monthSavings.reduce((s, v) => s + v, 0) / monthSavings.length
  }, [expenses, salary])

  const remaining = emergencyFundGoal - emergencyFundCurrent
  const monthsToGoal = avgMonthlySavings > 0 ? Math.ceil(remaining / avgMonthlySavings) : null
  const projectedDate = monthsToGoal
    ? new Date(new Date('2026-05-11').setMonth(new Date('2026-05-11').getMonth() + monthsToGoal))
    : null

  const progressPct = Math.min((emergencyFundCurrent / emergencyFundGoal) * 100, 100)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
        <p className="text-sm text-text-secondary mt-0.5">Spending patterns and financial health</p>
      </div>

      {/* Heatmap */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Spending Heatmap</h2>
            <p className="text-xs text-text-secondary mt-0.5">Daily spending intensity — darker = more spent</p>
          </div>
          <div className="flex gap-1">
            {HEAT_MONTHS.map((m) => (
              <button
                key={m.key}
                onClick={() => setHeatmapMonth(m.key)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${heatmapMonth === m.key ? 'bg-accent-blue-dim text-accent-blue' : 'text-text-secondary hover:text-text-primary'}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <SpendingHeatmap expenses={expenses} monthKey={heatmapMonth} />
      </div>

      {/* MoM Comparison */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Month-over-Month Comparison</h2>
            <p className="text-xs text-text-secondary mt-0.5">Total spending vs. selected category</p>
          </div>
          <select
            value={momCategory}
            onChange={(e) => setMomCategory(e.target.value)}
            className="bg-bg-elevated border border-border rounded-lg py-1.5 px-3 text-xs text-text-primary focus:outline-none hover:border-border-bright transition-colors"
          >
            {CATEGORY_LIST.filter(c => !['savings', 'investments'].includes(c.id)).map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </select>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={momData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `€${v}`} width={60} />
              <Tooltip
                formatter={(v, n) => [fmt(v), n === 'total' ? 'Total Spent' : CATEGORIES[momCategory]?.label]}
                contentStyle={{ background: '#111520', border: '1px solid #1E2438', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#E8ECF5' }}
              />
              <Legend formatter={(v) => v === 'total' ? 'Total Spent' : CATEGORIES[momCategory]?.label} />
              <Bar dataKey="total" fill="#4F8EF7" radius={[4, 4, 0, 0]} fillOpacity={0.7} />
              <Bar dataKey={momCategory} fill={CATEGORIES[momCategory]?.color || '#F5A623'} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Trends */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-text-primary">Category Trends</h2>
          <p className="text-xs text-text-secondary mt-0.5">Top 5 categories over the last 4 months</p>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={catTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `€${v}`} width={60} />
              <Tooltip
                formatter={(v, n) => [fmt(v), n]}
                contentStyle={{ background: '#111520', border: '1px solid #1E2438', borderRadius: 8, fontSize: 12 }}
              />
              {CATEGORY_LIST.slice(0, 5).map((cat) => (
                <Area
                  key={cat.id}
                  type="monotone"
                  dataKey={cat.label}
                  stroke={cat.color}
                  fill={cat.color + '22'}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Savings Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-text-primary">Actual vs. Planned Savings</h2>
            <p className="text-xs text-text-secondary mt-0.5">Monthly target: {fmt(salary * 0.2)}</p>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={savingsData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `€${v}`} width={55} />
                <Tooltip
                  formatter={(v, n) => [fmt(v), n === 'planned' ? 'Planned' : 'Actual']}
                  contentStyle={{ background: '#111520', border: '1px solid #1E2438', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="planned" fill="#1E2438" radius={[4, 4, 0, 0]} name="planned" />
                <Bar dataKey="actual" fill="#34D399" radius={[4, 4, 0, 0]} name="actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emergency Fund Projection */}
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-1">Emergency Fund</h2>
          <p className="text-xs text-text-secondary mb-5">Track your safety net progress</p>

          <div className="space-y-4">
            <div className="flex items-end justify-between mb-1">
              <span className="text-2xl font-mono font-bold text-accent-emerald">{fmt(emergencyFundCurrent)}</span>
              <span className="text-sm text-text-secondary">of {fmt(emergencyFundGoal)}</span>
            </div>
            <div className="h-2.5 bg-bg-elevated rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-emerald/80 to-accent-emerald rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-text-secondary">{progressPct.toFixed(1)}% funded</p>

            {projectedDate && (
              <div className="bg-bg-elevated rounded-xl p-4 border border-border-subtle">
                <p className="text-xs text-text-secondary mb-1">Estimated completion</p>
                <p className="text-lg font-semibold text-accent-emerald">{format(projectedDate, 'MMMM yyyy')}</p>
                <p className="text-xs text-text-muted mt-0.5">
                  ~{monthsToGoal} months · Avg. monthly savings: {fmt(avgMonthlySavings)}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">Goal (€)</label>
                <input
                  type="number"
                  value={emergencyFundGoal}
                  onChange={(e) => setEmergencyFundGoal(parseFloat(e.target.value) || 0)}
                  className="w-full bg-bg-elevated border border-border rounded-lg py-2 px-3 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-emerald/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">Current (€)</label>
                <input
                  type="number"
                  value={emergencyFundCurrent}
                  onChange={(e) => setEmergencyFundCurrent(parseFloat(e.target.value) || 0)}
                  className="w-full bg-bg-elevated border border-border rounded-lg py-2 px-3 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-emerald/50 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
