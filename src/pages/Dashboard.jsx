import { useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, ArrowRight, Wallet, Target, AlertCircle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { CATEGORIES } from '../utils/categories'

const fmt = (n) => `€${n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function StatCard({ label, value, sub, color = 'blue', icon: Icon, trend }) {
  const colors = {
    blue: { text: 'text-accent-blue', bg: 'bg-accent-blue-dim', border: 'border-accent-blue/20' },
    gold: { text: 'text-accent-gold', bg: 'bg-accent-gold-dim', border: 'border-accent-gold/20' },
    emerald: { text: 'text-accent-emerald', bg: 'bg-accent-emerald-dim', border: 'border-accent-emerald/20' },
    rose: { text: 'text-accent-rose', bg: 'bg-accent-rose-dim', border: 'border-accent-rose/20' },
  }
  const c = colors[color]
  return (
    <div className={`bg-bg-card border ${c.border} rounded-xl p-5 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
            <Icon size={15} className={c.text} />
          </div>
        )}
      </div>
      <div>
        <p className={`text-2xl font-bold font-mono ${c.text}`}>{value}</p>
        {sub && (
          <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
            {trend === 'up' && <TrendingUp size={11} className="text-accent-rose" />}
            {trend === 'down' && <TrendingDown size={11} className="text-accent-emerald" />}
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}

function MiniHeatmap({ expenses }) {
  const today = new Date('2026-05-11')
  const days = eachDayOfInterval({ start: startOfMonth(today), end: endOfMonth(today) })

  const dailySpend = useMemo(() => {
    const map = {}
    expenses.forEach((e) => {
      if (!map[e.date]) map[e.date] = 0
      map[e.date] += e.amount
    })
    return map
  }, [expenses])

  const maxSpend = Math.max(...Object.values(dailySpend), 1)
  const startDow = days[0].getDay() // 0=Sun

  const intensity = (amount) => {
    if (!amount) return 0
    const ratio = amount / maxSpend
    if (ratio > 0.75) return 4
    if (ratio > 0.5) return 3
    if (ratio > 0.25) return 2
    return 1
  }

  const colors = ['bg-bg-elevated', 'bg-accent-blue/20', 'bg-accent-blue/40', 'bg-accent-blue/70', 'bg-accent-blue']

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-[10px] text-text-muted text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDow }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const spend = dailySpend[dateStr] || 0
          const lvl = intensity(spend)
          const isToday = isSameDay(day, today)
          return (
            <div
              key={dateStr}
              title={spend ? `${format(day, 'MMM d')}: ${fmt(spend)}` : format(day, 'MMM d')}
              className={`aspect-square rounded-sm cursor-default transition-all ${colors[lvl]} ${isToday ? 'ring-1 ring-accent-blue' : ''}`}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function Dashboard({ onNavigate }) {
  const { expenses, salary, buckets } = useStore()

  const today = new Date('2026-05-11')
  const monthKey = format(today, 'yyyy-MM')

  const thisMonthExpenses = useMemo(
    () => expenses.filter((e) => e.date.startsWith(monthKey)),
    [expenses, monthKey]
  )

  const lastMonthExpenses = useMemo(
    () => expenses.filter((e) => e.date.startsWith('2026-04')),
    [expenses]
  )

  const totalSpent = useMemo(() => thisMonthExpenses.reduce((s, e) => s + e.amount, 0), [thisMonthExpenses])
  const lastMonthTotal = useMemo(() => lastMonthExpenses.reduce((s, e) => s + e.amount, 0), [lastMonthExpenses])
  const remaining = salary - totalSpent
  const savingsBucket = buckets.find((b) => b.id === 'savings')
  const plannedSavings = salary * ((savingsBucket?.percentage || 20) / 100)
  const savingsRate = ((plannedSavings / salary) * 100).toFixed(0)

  const spendChange = lastMonthTotal ? ((totalSpent - lastMonthTotal) / lastMonthTotal * 100) : 0

  // Category breakdown for pie
  const catBreakdown = useMemo(() => {
    const map = {}
    thisMonthExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount
    })
    return Object.entries(map).map(([cat, amount]) => ({
      name: CATEGORIES[cat]?.label || cat,
      value: amount,
      color: CATEGORIES[cat]?.color || '#7B88A4',
    })).sort((a, b) => b.value - a.value).slice(0, 6)
  }, [thisMonthExpenses])

  const recentExpenses = useMemo(
    () => [...thisMonthExpenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6),
    [thisMonthExpenses]
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">{format(today, 'MMMM yyyy')} · Overview</p>
        </div>
        <button
          onClick={() => onNavigate('expenses')}
          className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors shadow-glow"
        >
          + Add Expense
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Spent This Month"
          value={fmt(totalSpent)}
          sub={`${spendChange > 0 ? '+' : ''}${spendChange.toFixed(1)}% vs last month`}
          trend={spendChange > 0 ? 'up' : 'down'}
          color="rose"
          icon={Wallet}
        />
        <StatCard
          label="Remaining Budget"
          value={fmt(Math.max(remaining, 0))}
          sub={`of ${fmt(salary)} salary`}
          color={remaining >= 0 ? 'blue' : 'rose'}
          icon={Target}
        />
        <StatCard
          label="Planned Savings"
          value={fmt(plannedSavings)}
          sub={`${savingsRate}% of salary`}
          color="emerald"
          icon={TrendingUp}
        />
        <StatCard
          label="Transactions"
          value={thisMonthExpenses.length}
          sub={`${thisMonthExpenses.filter(e => e.isRecurring).length} recurring`}
          color="gold"
          icon={AlertCircle}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Pie */}
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Spending by Category</h2>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={catBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {catBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [fmt(v), '']}
                  contentStyle={{ background: '#111520', border: '1px solid #1E2438', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#E8ECF5' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {catBreakdown.slice(0, 4).map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="text-xs text-text-secondary">{c.name}</span>
                </div>
                <span className="text-xs font-mono text-text-primary">{fmt(c.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spending Heatmap */}
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-primary">Spending Heatmap</h2>
            <button onClick={() => onNavigate('analytics')} className="text-xs text-accent-blue hover:underline flex items-center gap-1">
              Full view <ArrowRight size={11} />
            </button>
          </div>
          <MiniHeatmap expenses={thisMonthExpenses} />
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] text-text-muted">Less</span>
            {['bg-bg-elevated', 'bg-accent-blue/20', 'bg-accent-blue/40', 'bg-accent-blue/70', 'bg-accent-blue'].map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span className="text-[10px] text-text-muted">More</span>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-primary">Budget Buckets</h2>
            <button onClick={() => onNavigate('budget')} className="text-xs text-accent-blue hover:underline flex items-center gap-1">
              Manage <ArrowRight size={11} />
            </button>
          </div>
          <div className="space-y-4">
            {buckets.map((bucket) => {
              const allocated = salary * (bucket.percentage / 100)
              const bucketCategories = Object.values(CATEGORIES)
                .filter((c) => c.bucket === bucket.id)
                .map((c) => c.id)
              const spent = thisMonthExpenses
                .filter((e) => bucketCategories.includes(e.category))
                .reduce((s, e) => s + e.amount, 0)
              const pct = Math.min((spent / allocated) * 100, 100)
              const over = spent > allocated
              return (
                <div key={bucket.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{bucket.icon}</span>
                      <span className="text-xs font-medium text-text-primary">{bucket.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-text-primary">{fmt(spent)}</span>
                      <span className="text-xs text-text-muted"> / {fmt(allocated)}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: over ? '#F87171' : bucket.color }}
                    />
                  </div>
                  {over && (
                    <p className="text-[10px] text-accent-rose mt-1">Over budget by {fmt(spent - allocated)}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-bg-card border border-border rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">Recent Expenses</h2>
          <button onClick={() => onNavigate('expenses')} className="text-xs text-accent-blue hover:underline flex items-center gap-1">
            See all <ArrowRight size={11} />
          </button>
        </div>
        <div className="divide-y divide-border">
          {recentExpenses.map((expense) => {
            const cat = CATEGORIES[expense.category] || CATEGORIES.other
            return (
              <div key={expense.id} className="flex items-center gap-4 px-5 py-3 hover:bg-bg-elevated/40 transition-colors">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ background: cat.color + '22' }}
                >
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{expense.description}</p>
                  <p className="text-xs text-text-secondary">{format(new Date(expense.date), 'MMM d, yyyy')} · {cat.label}</p>
                </div>
                {expense.isRecurring && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-gold-dim text-accent-gold font-medium shrink-0">Recurring</span>
                )}
                <span className="text-sm font-mono font-semibold text-accent-rose shrink-0">{fmt(expense.amount)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
