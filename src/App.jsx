import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import BudgetDivider from './pages/BudgetDivider'
import Expenses from './pages/Expenses'
import Analytics from './pages/Analytics'
import Subscriptions from './pages/Subscriptions'
import Achievements from './pages/Achievements'

const PAGES = {
  dashboard: Dashboard,
  budget: BudgetDivider,
  expenses: Expenses,
  analytics: Analytics,
  subscriptions: Subscriptions,
  achievements: Achievements,
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const PageComponent = PAGES[page] || Dashboard

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <Sidebar active={page} onNavigate={setPage} />

      {/* Main content — offset by sidebar width */}
      <main className="flex-1 ml-[68px] lg:ml-56 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 h-16 bg-bg-primary/80 backdrop-blur border-b border-border flex items-center px-6">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="text-text-secondary font-medium capitalize">{page}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-xs text-text-muted font-mono">May 2026</div>
            <div className="w-px h-4 bg-border" />
            <div className="text-xs font-medium px-2.5 py-1 rounded-lg bg-accent-emerald-dim text-accent-emerald">
              Porto, PT
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6 max-w-8xl">
          <PageComponent onNavigate={setPage} />
        </div>
      </main>
    </div>
  )
}
