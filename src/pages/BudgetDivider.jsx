import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Plus, Trash2, Check, DollarSign } from 'lucide-react'
import { useStore } from '../store/useStore'

const fmt = (n) => `€${n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const PRESETS = [
  { id: '50/30/20', label: '50/30/20', description: 'Classic rule — Needs / Wants / Savings' },
  { id: '60/20/20', label: '60/20/20', description: 'High-needs households' },
  { id: '70/20/10', label: '70/20/10', description: 'Early career / tight budget' },
  { id: 'custom', label: 'Custom', description: 'Define your own allocation' },
]

const PALETTE = ['#4F8EF7', '#F5A623', '#34D399', '#F87171', '#A78BFA', '#22D3EE', '#FB923C', '#E879F9']
const ICONS = ['🏠', '🎯', '💎', '🎓', '🚀', '❤️', '🎨', '⚡']

export default function BudgetDivider() {
  const { salary, buckets, budgetPreset, setSalary, setBuckets, setBudgetPreset, addBucket, updateBucket, removeBucket } = useStore()
  const [localSalary, setLocalSalary] = useState(salary.toString())
  const [addingBucket, setAddingBucket] = useState(false)
  const [newBucket, setNewBucket] = useState({ name: '', percentage: 0, color: '#4F8EF7', icon: '💡' })

  const totalPct = buckets.reduce((s, b) => s + b.percentage, 0)
  const unallocated = 100 - totalPct

  const handleSalaryBlur = () => {
    const parsed = parseFloat(localSalary.replace(',', '.'))
    if (!isNaN(parsed) && parsed > 0) setSalary(parsed)
  }

  const handlePctChange = (id, val) => {
    const num = Math.max(0, Math.min(100, parseInt(val) || 0))
    updateBucket(id, { percentage: num })
  }

  const handleAddBucket = () => {
    if (!newBucket.name.trim()) return
    addBucket({
      id: `bucket_${Date.now()}`,
      name: newBucket.name,
      percentage: newBucket.percentage,
      color: newBucket.color,
      icon: newBucket.icon,
      description: '',
    })
    setNewBucket({ name: '', percentage: 0, color: '#4F8EF7', icon: '💡' })
    setAddingBucket(false)
  }

  const pieData = [
    ...buckets.map((b) => ({ name: b.name, value: b.percentage, color: b.color })),
    ...(unallocated > 0 ? [{ name: 'Unallocated', value: unallocated, color: '#1E2438' }] : []),
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Budget Divider</h1>
        <p className="text-sm text-text-secondary mt-0.5">Split your salary into spending buckets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Controls */}
        <div className="space-y-5">
          {/* Salary Input */}
          <div className="bg-bg-card border border-border rounded-xl p-5">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider block mb-3">
              Monthly Net Salary
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary font-mono text-sm">€</span>
                <input
                  type="text"
                  value={localSalary}
                  onChange={(e) => setLocalSalary(e.target.value)}
                  onBlur={handleSalaryBlur}
                  className="w-full bg-bg-elevated border border-border rounded-lg py-3 pl-8 pr-4 text-lg font-mono font-semibold text-accent-gold focus:outline-none focus:border-accent-gold/50 transition-colors"
                />
              </div>
              <button
                onClick={handleSalaryBlur}
                className="w-11 h-11 rounded-lg bg-accent-gold-dim border border-accent-gold/20 flex items-center justify-center text-accent-gold hover:bg-accent-gold/20 transition-colors"
              >
                <Check size={16} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[2000, 2500, 3000, 3200, 4000, 5000].map((n) => (
                <button
                  key={n}
                  onClick={() => { setSalary(n); setLocalSalary(n.toString()) }}
                  className={`text-xs py-1.5 rounded-lg border transition-colors font-mono ${salary === n ? 'bg-accent-gold-dim border-accent-gold/30 text-accent-gold' : 'border-border text-text-secondary hover:border-border-bright hover:text-text-primary bg-bg-elevated'}`}
                >
                  €{n.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Selector */}
          <div className="bg-bg-card border border-border rounded-xl p-5">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider block mb-3">
              Allocation Preset
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    if (preset.id !== 'custom') setBudgetPreset(preset.id)
                    else setBudgetPreset('custom')
                  }}
                  className={`p-3 rounded-lg border text-left transition-all ${budgetPreset === preset.id ? 'bg-accent-blue-dim border-accent-blue/30 text-accent-blue' : 'border-border bg-bg-elevated text-text-secondary hover:border-border-bright hover:text-text-primary'}`}
                >
                  <p className="text-sm font-semibold">{preset.label}</p>
                  <p className="text-[11px] mt-0.5 opacity-70 leading-tight">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Buckets List */}
          <div className="bg-bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Buckets</label>
              <div className={`text-xs font-mono font-medium px-2 py-0.5 rounded ${Math.abs(unallocated) < 1 ? 'text-accent-emerald bg-accent-emerald-dim' : unallocated < 0 ? 'text-accent-rose bg-accent-rose-dim' : 'text-accent-gold bg-accent-gold-dim'}`}>
                {unallocated >= 0 ? `${unallocated.toFixed(0)}% unallocated` : `${Math.abs(unallocated).toFixed(0)}% over`}
              </div>
            </div>

            <div className="space-y-3">
              {buckets.map((bucket, idx) => (
                <div key={bucket.id} className="bg-bg-elevated rounded-xl p-4 border border-border-subtle">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: bucket.color + '22' }}>
                      {bucket.icon}
                    </div>
                    <div className="flex-1">
                      <input
                        value={bucket.name}
                        onChange={(e) => updateBucket(bucket.id, { name: e.target.value })}
                        className="bg-transparent text-sm font-semibold text-text-primary focus:outline-none w-full"
                      />
                      <p className="text-[11px] text-text-muted">{fmt(salary * bucket.percentage / 100)} / month</p>
                    </div>
                    <button
                      onClick={() => removeBucket(bucket.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:text-accent-rose hover:bg-accent-rose-dim transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={bucket.percentage}
                      onChange={(e) => handlePctChange(bucket.id, e.target.value)}
                      className="flex-1 accent-current h-1.5"
                      style={{ accentColor: bucket.color }}
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={bucket.percentage}
                        onChange={(e) => handlePctChange(bucket.id, e.target.value)}
                        className="w-12 text-center bg-bg-card border border-border rounded-md py-0.5 text-sm font-mono font-semibold focus:outline-none focus:border-accent-blue/50"
                        style={{ color: bucket.color }}
                      />
                      <span className="text-xs text-text-muted">%</span>
                    </div>
                  </div>
                  {/* Color picker */}
                  <div className="flex gap-1.5 mt-3">
                    {PALETTE.map((c) => (
                      <button
                        key={c}
                        onClick={() => updateBucket(bucket.id, { color: c })}
                        className={`w-4 h-4 rounded-full transition-transform hover:scale-110 ${bucket.color === c ? 'ring-1 ring-white ring-offset-1 ring-offset-bg-elevated' : ''}`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Add Bucket */}
              {addingBucket ? (
                <div className="bg-bg-elevated rounded-xl p-4 border border-accent-blue/20">
                  <input
                    placeholder="Bucket name (e.g. Travel Fund)"
                    value={newBucket.name}
                    onChange={(e) => setNewBucket({ ...newBucket, name: e.target.value })}
                    className="w-full bg-transparent text-sm text-text-primary placeholder-text-muted focus:outline-none mb-2 border-b border-border pb-2"
                  />
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={newBucket.percentage}
                      onChange={(e) => setNewBucket({ ...newBucket, percentage: parseInt(e.target.value) || 0 })}
                      className="w-16 bg-bg-card border border-border rounded-md py-1 px-2 text-sm font-mono focus:outline-none"
                    />
                    <span className="text-xs text-text-muted">%</span>
                    <div className="flex gap-1 flex-wrap">
                      {ICONS.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setNewBucket({ ...newBucket, icon })}
                          className={`text-base p-0.5 rounded ${newBucket.icon === icon ? 'bg-accent-blue-dim' : ''}`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddBucket} className="flex-1 py-1.5 bg-accent-blue text-white rounded-lg text-xs font-medium hover:bg-blue-500 transition-colors">
                      Add Bucket
                    </button>
                    <button onClick={() => setAddingBucket(false)} className="flex-1 py-1.5 border border-border text-text-secondary rounded-lg text-xs hover:text-text-primary transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingBucket(true)}
                  className="w-full py-3 border border-dashed border-border rounded-xl text-sm text-text-muted hover:text-text-secondary hover:border-border-bright transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Add Bucket
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Visualization */}
        <div className="space-y-5">
          {/* Pie Chart */}
          <div className="bg-bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Allocation Overview</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => value > 5 ? `${value}%` : ''}
                    labelLine={false}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, n) => [`${v}% (${fmt(salary * v / 100)})`, n]}
                    contentStyle={{ background: '#111520', border: '1px solid #1E2438', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#E8ECF5' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Breakdown Table */}
          <div className="bg-bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Monthly Breakdown</h2>
            <div className="space-y-3">
              {buckets.map((bucket) => (
                <div key={bucket.id} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-10 rounded-full" style={{ background: bucket.color }} />
                    <div>
                      <p className="text-sm font-medium text-text-primary flex items-center gap-1.5">
                        {bucket.icon} {bucket.name}
                      </p>
                      <p className="text-xs text-text-muted">{bucket.percentage}% of salary</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-mono font-bold" style={{ color: bucket.color }}>{fmt(salary * bucket.percentage / 100)}</p>
                    <p className="text-xs text-text-muted font-mono">per month</p>
                  </div>
                </div>
              ))}
              {unallocated > 0 && (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-10 rounded-full bg-border" />
                    <div>
                      <p className="text-sm text-text-muted">Unallocated</p>
                      <p className="text-xs text-text-muted">{unallocated.toFixed(0)}% remaining</p>
                    </div>
                  </div>
                  <p className="text-base font-mono text-text-muted">{fmt(salary * unallocated / 100)}</p>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 mt-1">
                <span className="text-sm font-semibold text-text-primary">Total Salary</span>
                <span className="text-lg font-mono font-bold text-accent-gold">{fmt(salary)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
