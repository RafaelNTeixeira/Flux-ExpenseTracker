import { useMemo, useState } from 'react'
import { AlertTriangle, TrendingUp, RefreshCw, Plus, Trash2, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { CATEGORIES } from '../utils/categories'
import Modal from '../components/Modal'

const fmt = (n) => `€${n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const DEFAULT_SUBS = [
  { id: 's1', name: 'Netflix', amount: 15.99, icon: '🎬', color: '#E50914', category: 'entertainment', isEssential: false, lastUsed: '2026-05-10' },
  { id: 's2', name: 'Spotify', amount: 9.99, icon: '🎵', color: '#1DB954', category: 'entertainment', isEssential: false, lastUsed: '2026-05-11' },
  { id: 's3', name: 'Disney+', amount: 12.99, icon: '✨', color: '#113CCF', category: 'entertainment', isEssential: false, lastUsed: '2026-04-28' },
  { id: 's4', name: 'MEO Internet', amount: 45.00, icon: '📡', color: '#00A0E3', category: 'utilities', isEssential: true, lastUsed: '2026-05-11' },
  { id: 's5', name: 'Ginásio Holmes Place', amount: 35.00, icon: '💪', color: '#F5A623', category: 'health', isEssential: false, lastUsed: '2026-05-03' },
]

function SubForm({ onSave, onClose }) {
  const [form, setForm] = useState({ name: '', amount: '', icon: '📱', color: '#4F8EF7', isEssential: false, lastUsed: new Date('2026-05-11').toISOString().slice(0, 10) })
  const valid = form.name.trim() && parseFloat(form.amount) > 0

  const ICONS = ['📱', '🎬', '🎵', '📺', '☁️', '🎮', '📰', '💪', '📡', '🎓', '🛡️', '🔧']

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. YouTube Premium"
            className="w-full bg-bg-elevated border border-border rounded-lg py-2.5 px-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue/50 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">Monthly (€)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="0.00"
            className="w-full bg-bg-elevated border border-border rounded-lg py-2.5 px-3 text-sm font-mono text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue/50 transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">Icon</label>
        <div className="flex flex-wrap gap-2">
          {ICONS.map((ic) => (
            <button
              key={ic}
              onClick={() => setForm({ ...form, icon: ic })}
              className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-colors ${form.icon === ic ? 'bg-accent-blue-dim ring-1 ring-accent-blue/40' : 'bg-bg-elevated hover:bg-bg-hover'}`}
            >
              {ic}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">Last used</label>
        <input
          type="date"
          value={form.lastUsed}
          onChange={(e) => setForm({ ...form, lastUsed: e.target.value })}
          className="w-full bg-bg-elevated border border-border rounded-lg py-2.5 px-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 transition-colors"
        />
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => setForm({ ...form, isEssential: !form.isEssential })}
          className="relative flex items-center px-0.5 rounded-full transition-colors"
          style={{ width: 40, height: 22, background: form.isEssential ? '#4F8EF7' : '#1E2438' }}
        >
          <div
            className="w-4 h-4 rounded-full bg-white transition-transform"
            style={{ transform: form.isEssential ? 'translateX(18px)' : 'translateX(0)' }}
          />
        </div>
        <span className="text-sm text-text-secondary">Mark as essential</span>
      </label>
      <div className="flex gap-3 pt-1">
        <button
          onClick={() => valid && onSave({ ...form, id: `s_${Date.now()}`, amount: parseFloat(form.amount) })}
          disabled={!valid}
          className="flex-1 py-2.5 bg-accent-blue text-white rounded-lg text-sm font-medium hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Add Subscription
        </button>
        <button onClick={onClose} className="px-5 py-2.5 border border-border text-text-secondary rounded-lg text-sm hover:text-text-primary transition-colors">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function Subscriptions() {
  const [subs, setSubs] = useState(DEFAULT_SUBS)
  const [showModal, setShowModal] = useState(false)

  const today = new Date('2026-05-11')
  const monthlyTotal = subs.reduce((s, sub) => s + sub.amount, 0)
  const yearlyTotal = monthlyTotal * 12

  const enriched = useMemo(() => subs.map((sub) => {
    const lastUsed = new Date(sub.lastUsed)
    const daysSince = Math.floor((today - lastUsed) / (1000 * 60 * 60 * 24))
    const isGhost = daysSince > 21 && !sub.isEssential
    const isWarning = daysSince > 10 && daysSince <= 21 && !sub.isEssential
    return { ...sub, daysSince, isGhost, isWarning }
  }), [subs])

  const ghosts = enriched.filter((s) => s.isGhost)
  const ghostCost = ghosts.reduce((s, sub) => s + sub.amount, 0)

  const deleteSub = (id) => setSubs((prev) => prev.filter((s) => s.id !== id))
  const toggleEssential = (id) => setSubs((prev) => prev.map((s) => s.id === id ? { ...s, isEssential: !s.isEssential } : s))

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Subscriptions</h1>
          <p className="text-sm text-text-secondary mt-0.5">Ghost subscription detector & manager</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors shadow-glow"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">Monthly Cost</p>
          <p className="text-2xl font-mono font-bold text-accent-rose">{fmt(monthlyTotal)}</p>
          <p className="text-xs text-text-muted mt-1">{subs.length} active subscriptions</p>
        </div>
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">Yearly Cost</p>
          <p className="text-2xl font-mono font-bold text-accent-gold">{fmt(yearlyTotal)}</p>
          <p className="text-xs text-text-muted mt-1">Committed annually</p>
        </div>
        <div className={`bg-bg-card border rounded-xl p-5 ${ghosts.length > 0 ? 'border-accent-rose/30' : 'border-border'}`}>
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">Ghost Subs</p>
          <p className={`text-2xl font-mono font-bold ${ghosts.length > 0 ? 'text-accent-rose' : 'text-accent-emerald'}`}>
            {ghosts.length}
          </p>
          <p className="text-xs text-text-muted mt-1">{ghosts.length > 0 ? `Wasting ${fmt(ghostCost)}/mo` : 'All subscriptions used recently!'}</p>
        </div>
      </div>

      {/* Ghost Alert */}
      {ghosts.length > 0 && (
        <div className="bg-accent-rose-dim border border-accent-rose/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-accent-rose mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-accent-rose">Ghost Subscriptions Detected!</p>
            <p className="text-xs text-text-secondary mt-0.5">
              You have {ghosts.length} subscription{ghosts.length > 1 ? 's' : ''} you haven't used in over 3 weeks.
              Cancelling them would save you <span className="font-semibold text-accent-rose">{fmt(ghostCost)}/month</span> ({fmt(ghostCost * 12)}/year).
            </p>
          </div>
        </div>
      )}

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {enriched.map((sub) => (
          <div
            key={sub.id}
            className={`bg-bg-card border rounded-xl p-5 transition-all ${sub.isGhost ? 'border-accent-rose/30' : sub.isWarning ? 'border-accent-gold/30' : 'border-border'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: sub.color + '22' }}
                >
                  {sub.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{sub.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {sub.isGhost && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-rose-dim text-accent-rose font-medium">👻 Ghost</span>
                    )}
                    {sub.isWarning && !sub.isGhost && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-gold-dim text-accent-gold font-medium">⚠️ Unused</span>
                    )}
                    {sub.isEssential && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-blue-dim text-accent-blue font-medium">Essential</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-mono font-bold text-accent-rose">{fmt(sub.amount)}<span className="text-xs text-text-muted font-normal">/mo</span></p>
                <p className="text-[11px] text-text-muted font-mono">{fmt(sub.amount * 12)}/yr</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-text-secondary border-t border-border-subtle pt-3">
              <span>
                Last used: <span className={sub.isGhost ? 'text-accent-rose' : sub.isWarning ? 'text-accent-gold' : 'text-accent-emerald'}>
                  {sub.daysSince === 0 ? 'Today' : `${sub.daysSince}d ago`}
                </span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleEssential(sub.id)}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${sub.isEssential ? 'bg-accent-blue-dim text-accent-blue' : 'bg-bg-elevated text-text-muted hover:text-text-secondary'}`}
                >
                  {sub.isEssential ? '✓ Essential' : 'Mark Essential'}
                </button>
                <button
                  onClick={() => deleteSub(sub.id)}
                  className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-accent-rose hover:bg-accent-rose-dim transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Subscription">
        <SubForm
          onSave={(sub) => { setSubs((prev) => [...prev, sub]); setShowModal(false) }}
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </div>
  )
}
