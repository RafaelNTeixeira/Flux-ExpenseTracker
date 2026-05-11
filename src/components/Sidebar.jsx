import { LayoutDashboard, PiggyBank, Receipt, BarChart3, RefreshCw, Trophy } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'budget', label: 'Budget', icon: PiggyBank },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCw },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
]

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[68px] lg:w-56 bg-bg-secondary border-r border-border flex flex-col z-40 transition-all">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 lg:px-5 border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-accent-blue flex items-center justify-center text-sm font-bold shrink-0 shadow-glow">
          ƒ
        </div>
        <span className="hidden lg:block ml-3 font-bold text-lg tracking-tight text-text-primary">
          Flux
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 lg:p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all group
                ${isActive
                  ? 'bg-accent-blue-dim text-accent-blue'
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                }`}
            >
              <Icon
                size={18}
                className={`shrink-0 ${isActive ? 'text-accent-blue' : 'text-text-muted group-hover:text-text-secondary'}`}
              />
              <span className="hidden lg:block">{label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="hidden lg:flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-xs">
            👤
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-text-primary truncate">My Account</p>
            <p className="text-[10px] text-text-muted">Porto, PT</p>
          </div>
        </div>
        <div className="lg:hidden flex justify-center">
          <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-xs">
            👤
          </div>
        </div>
      </div>
    </aside>
  )
}
