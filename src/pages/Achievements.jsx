import { useMemo, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { useStore } from '../store/useStore'
import { format } from 'date-fns'

const ALL_BADGES = [
  {
    id: 'first_expense',
    icon: '🎯',
    name: 'First Step',
    description: 'Logged your very first expense',
    color: '#4F8EF7',
    category: 'Getting Started',
  },
  {
    id: 'budget_setter',
    icon: '📐',
    name: 'Budget Architect',
    description: 'Set up your salary and budget buckets',
    color: '#F5A623',
    category: 'Getting Started',
  },
  {
    id: 'ten_expenses',
    icon: '🔟',
    name: 'Getting Serious',
    description: 'Logged 10 or more expenses',
    color: '#34D399',
    category: 'Consistency',
  },
  {
    id: 'fifty_expenses',
    icon: '📊',
    name: 'Data Driven',
    description: 'Logged 50 or more expenses',
    color: '#A78BFA',
    category: 'Consistency',
  },
  {
    id: 'no_leisure_overspend',
    icon: '🏅',
    name: 'Iron Discipline',
    description: "Stayed within your Wants budget for an entire month",
    color: '#F87171',
    category: 'Spending',
  },
  {
    id: 'savings_goal_25',
    icon: '💰',
    name: 'First Quarter',
    description: 'Reached 25% of your emergency fund goal',
    color: '#34D399',
    category: 'Savings',
  },
  {
    id: 'savings_goal_50',
    icon: '🏦',
    name: 'Halfway There',
    description: 'Reached 50% of your emergency fund goal',
    color: '#F5A623',
    category: 'Savings',
  },
  {
    id: 'savings_goal_100',
    icon: '🏆',
    name: 'Safety Net',
    description: 'Fully funded your emergency goal!',
    color: '#F5A623',
    category: 'Savings',
  },
  {
    id: 'csv_importer',
    icon: '📥',
    name: 'Bank Synced',
    description: 'Imported expenses from a CSV file',
    color: '#22D3EE',
    category: 'Features',
  },
  {
    id: 'streak_3',
    icon: '🔥',
    name: 'On a Roll',
    description: 'Logged expenses 3 months in a row',
    color: '#FB923C',
    category: 'Consistency',
  },
  {
    id: 'under_budget_month',
    icon: '🌟',
    name: 'Under Budget',
    description: 'Spent less than your salary in a complete month',
    color: '#F5A623',
    category: 'Spending',
  },
  {
    id: 'subscription_audit',
    icon: '🔍',
    name: 'Ghost Hunter',
    description: 'Removed at least one ghost subscription',
    color: '#F87171',
    category: 'Subscriptions',
  },
]

function BadgeCard({ badge, unlocked, isNew }) {
  return (
    <div
      className={`relative rounded-xl p-5 border transition-all ${
        unlocked
          ? 'bg-bg-card border-border hover:border-border-bright'
          : 'bg-bg-secondary border-border-subtle opacity-50'
      }`}
    >
      {isNew && (
        <div className="absolute -top-2 -right-2 bg-accent-gold text-black text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse_slow">
          NEW!
        </div>
      )}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3 mx-auto"
        style={{ background: unlocked ? badge.color + '22' : '#1E2438' }}
      >
        {unlocked ? badge.icon : '🔒'}
      </div>
      <h3 className="text-sm font-semibold text-center" style={{ color: unlocked ? badge.color : '#3D4A63' }}>
        {badge.name}
      </h3>
      <p className="text-[11px] text-text-muted text-center mt-1 leading-relaxed">{badge.description}</p>
    </div>
  )
}

export default function Achievements() {
  const { expenses, unlockedBadges, unlockBadge, emergencyFundCurrent, emergencyFundGoal, salary, buckets } = useStore()

  // Compute which badges should be auto-unlocked
  const shouldBeUnlocked = useMemo(() => {
    const ids = new Set(unlockedBadges)
    if (expenses.length >= 1) ids.add('first_expense')
    if (expenses.length >= 10) ids.add('ten_expenses')
    if (expenses.length >= 50) ids.add('fifty_expenses')
    const monthKeys = [...new Set(expenses.map(e => e.date.slice(0, 7)))]
    if (monthKeys.length >= 3) ids.add('streak_3')
    const pct = (emergencyFundCurrent / emergencyFundGoal) * 100
    if (pct >= 25) ids.add('savings_goal_25')
    if (pct >= 50) ids.add('savings_goal_50')
    if (pct >= 100) ids.add('savings_goal_100')
    // Under budget for April
    const aprSpent = expenses.filter(e => e.date.startsWith('2026-04')).reduce((s, e) => s + e.amount, 0)
    if (aprSpent < salary) ids.add('under_budget_month')
    return ids
  }, [expenses, unlockedBadges, emergencyFundCurrent, emergencyFundGoal, salary])

  // Unlock any newly earned
  useEffect(() => {
    shouldBeUnlocked.forEach((id) => {
      if (!unlockedBadges.includes(id)) {
        unlockBadge(id)
      }
    })
  }, []) // eslint-disable-line

  const newlyUnlocked = useMemo(
    () => unlockedBadges.filter((id) => shouldBeUnlocked.has(id)),
    [unlockedBadges, shouldBeUnlocked]
  )

  const handleConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#4F8EF7', '#F5A623', '#34D399', '#F87171', '#A78BFA'],
    })
  }

  const categories = [...new Set(ALL_BADGES.map((b) => b.category))]
  const totalUnlocked = unlockedBadges.length
  const total = ALL_BADGES.length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Achievements</h1>
          <p className="text-sm text-text-secondary mt-0.5">{totalUnlocked} / {total} badges unlocked</p>
        </div>
        <button
          onClick={handleConfetti}
          className="flex items-center gap-2 px-4 py-2 bg-accent-gold-dim border border-accent-gold/20 text-accent-gold rounded-lg text-sm font-medium hover:bg-accent-gold/20 transition-colors"
        >
          🎉 Celebrate
        </button>
      </div>

      {/* Progress bar */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-text-primary">Overall Progress</span>
          <span className="text-sm font-mono text-accent-gold">{totalUnlocked}/{total}</span>
        </div>
        <div className="h-3 bg-bg-elevated rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${(totalUnlocked / total) * 100}%`,
              background: 'linear-gradient(90deg, #4F8EF7, #A78BFA, #F5A623)',
            }}
          />
        </div>
        <p className="text-xs text-text-muted mt-2">{total - totalUnlocked} badges remaining. Keep tracking!</p>
      </div>

      {/* Badges by category */}
      {categories.map((cat) => {
        const catBadges = ALL_BADGES.filter((b) => b.category === cat)
        const catUnlocked = catBadges.filter((b) => unlockedBadges.includes(b.id)).length
        return (
          <div key={cat}>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">{cat}</h2>
              <div className="text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded-full font-mono">{catUnlocked}/{catBadges.length}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {catBadges.map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  unlocked={unlockedBadges.includes(badge.id)}
                  isNew={false}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
