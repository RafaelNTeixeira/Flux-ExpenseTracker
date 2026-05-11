import { useState, useMemo, useRef } from 'react'
import { format } from 'date-fns'
import { Plus, Search, Trash2, Edit2, Upload, Filter, X, ChevronDown } from 'lucide-react'
import { useStore } from '../store/useStore'
import { CATEGORIES, CATEGORY_LIST } from '../utils/categories'
import { parseCSV } from '../utils/csvImport'
import Modal from '../components/Modal'

const fmt = (n) => `€${n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const MONTHS = [
  { value: '2026-05', label: 'May 2026' },
  { value: '2026-04', label: 'April 2026' },
  { value: '2026-03', label: 'March 2026' },
  { value: '2026-02', label: 'February 2026' },
  { value: 'all', label: 'All time' },
]

function ExpenseForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    description: initial?.description || '',
    amount: initial?.amount?.toString() || '',
    category: initial?.category || 'other',
    date: initial?.date || format(new Date('2026-05-11'), 'yyyy-MM-dd'),
    isRecurring: initial?.isRecurring || false,
    ...initial,
  })

  const valid = form.description.trim() && parseFloat(form.amount) > 0

  return (
    <div className="p-6 space-y-4">
      <div>
        <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">Description</label>
        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="e.g. Continente Weekly Shop"
          className="w-full bg-bg-elevated border border-border rounded-lg py-2.5 px-3.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue/50 transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">Amount (€)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="0.00"
            className="w-full bg-bg-elevated border border-border rounded-lg py-2.5 px-3.5 text-sm font-mono text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue/50 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full bg-bg-elevated border border-border rounded-lg py-2.5 px-3.5 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1.5">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORY_LIST.filter(c => c.id !== 'savings' && c.id !== 'investments').map((cat) => (
            <button
              key={cat.id}
              onClick={() => setForm({ ...form, category: cat.id })}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${form.category === cat.id ? 'border-current' : 'border-border bg-bg-elevated text-text-secondary hover:border-border-bright'}`}
              style={form.category === cat.id ? { background: cat.color + '22', color: cat.color, borderColor: cat.color + '55' } : {}}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => setForm({ ...form, isRecurring: !form.isRecurring })}
          className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center px-0.5 ${form.isRecurring ? 'bg-accent-gold' : 'bg-bg-elevated border border-border'}`}
          style={{ height: '22px' }}
        >
          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${form.isRecurring ? 'translate-x-5' : 'translate-x-0'}`} style={{ minWidth: '16px' }} />
        </div>
        <span className="text-sm text-text-secondary">Recurring expense</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => valid && onSave({ ...form, amount: parseFloat(form.amount) })}
          disabled={!valid}
          className="flex-1 py-2.5 bg-accent-blue text-white rounded-lg text-sm font-medium hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-glow"
        >
          {initial ? 'Update Expense' : 'Add Expense'}
        </button>
        <button onClick={onClose} className="px-5 py-2.5 border border-border text-text-secondary rounded-lg text-sm hover:text-text-primary transition-colors">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function Expenses() {
  const { expenses, addExpense, updateExpense, deleteExpense, importExpenses } = useStore()
  const [search, setSearch] = useState('')
  const [filterMonth, setFilterMonth] = useState('2026-05')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('date_desc')
  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importPreview, setImportPreview] = useState(null)
  const fileRef = useRef()

  const filtered = useMemo(() => {
    let list = expenses
    if (filterMonth !== 'all') list = list.filter((e) => e.date.startsWith(filterMonth))
    if (filterCategory !== 'all') list = list.filter((e) => e.category === filterCategory)
    if (search) list = list.filter((e) => e.description.toLowerCase().includes(search.toLowerCase()))
    return list.sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date)
      if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date)
      if (sortBy === 'amount_desc') return b.amount - a.amount
      if (sortBy === 'amount_asc') return a.amount - b.amount
      return 0
    })
  }, [expenses, filterMonth, filterCategory, search, sortBy])

  const total = filtered.reduce((s, e) => s + e.amount, 0)

  const handleCSV = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      const imported = await parseCSV(file)
      setImportPreview(imported)
    } catch (err) {
      alert('Failed to parse CSV. Make sure it has Description, Amount, and Date columns.')
    }
    setImporting(false)
    e.target.value = ''
  }

  const confirmImport = () => {
    if (!importPreview) return
    importExpenses(importPreview)
    setImportPreview(null)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Expenses</h1>
          <p className="text-sm text-text-secondary mt-0.5">{filtered.length} transactions · {fmt(total)} total</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 bg-bg-elevated border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-border-bright transition-colors"
          >
            <Upload size={14} /> Import CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSV} />
          <button
            onClick={() => { setEditingExpense(null); setShowModal(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors shadow-glow"
          >
            <Plus size={14} /> Add Expense
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses..."
            className="bg-bg-card border border-border rounded-lg py-2 pl-8 pr-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-border-bright transition-colors w-52"
          />
        </div>
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="bg-bg-card border border-border rounded-lg py-2 px-3 text-sm text-text-primary focus:outline-none appearance-none cursor-pointer hover:border-border-bright transition-colors"
        >
          {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-bg-card border border-border rounded-lg py-2 px-3 text-sm text-text-primary focus:outline-none appearance-none cursor-pointer hover:border-border-bright transition-colors"
        >
          <option value="all">All categories</option>
          {CATEGORY_LIST.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-bg-card border border-border rounded-lg py-2 px-3 text-sm text-text-primary focus:outline-none appearance-none cursor-pointer hover:border-border-bright transition-colors"
        >
          <option value="date_desc">Date ↓</option>
          <option value="date_asc">Date ↑</option>
          <option value="amount_desc">Amount ↓</option>
          <option value="amount_asc">Amount ↑</option>
        </select>
        {(search || filterCategory !== 'all') && (
          <button
            onClick={() => { setSearch(''); setFilterCategory('all') }}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-accent-rose bg-accent-rose-dim hover:bg-accent-rose/20 transition-colors"
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      {/* Import Preview */}
      {importPreview && (
        <div className="bg-bg-card border border-accent-blue/30 rounded-xl p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary">📥 Import Preview — {importPreview.length} expenses found</h3>
            <button onClick={() => setImportPreview(null)} className="text-text-muted hover:text-text-primary">
              <X size={15} />
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
            {importPreview.slice(0, 8).map((e, i) => {
              const cat = CATEGORIES[e.category] || CATEGORIES.other
              return (
                <div key={i} className="flex items-center justify-between text-sm bg-bg-elevated rounded-lg px-3 py-2">
                  <span className="flex items-center gap-2 text-text-primary">
                    <span>{cat.icon}</span> {e.description}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-accent-gold">{cat.label}</span>
                    <span className="font-mono text-accent-rose">{fmt(e.amount)}</span>
                  </div>
                </div>
              )
            })}
            {importPreview.length > 8 && <p className="text-xs text-text-muted text-center">+{importPreview.length - 8} more...</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={confirmImport} className="flex-1 py-2 bg-accent-blue text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors">
              Import All {importPreview.length} Expenses
            </button>
            <button onClick={() => setImportPreview(null)} className="px-4 py-2 border border-border text-text-secondary rounded-lg text-sm hover:text-text-primary transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Expenses Table */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-4xl mb-3">💸</p>
            <p className="text-text-secondary text-sm">No expenses found</p>
            <p className="text-text-muted text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((expense) => {
              const cat = CATEGORIES[expense.category] || CATEGORIES.other
              return (
                <div key={expense.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg-elevated/50 group transition-colors">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                    style={{ background: cat.color + '22' }}
                  >
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{expense.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-text-secondary">{format(new Date(expense.date), 'MMM d, yyyy')}</p>
                      <span className="text-text-muted">·</span>
                      <p className="text-xs" style={{ color: cat.color }}>{cat.label}</p>
                      {expense.isRecurring && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-gold-dim text-accent-gold font-medium">Recurring</span>
                      )}
                      {expense.importedFromCSV && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-violet-dim text-accent-violet font-medium">CSV</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingExpense(expense); setShowModal(true) }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:text-accent-blue hover:bg-accent-blue-dim transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:text-accent-rose hover:bg-accent-rose-dim transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <span className="text-base font-mono font-bold text-accent-rose">{fmt(expense.amount)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {/* Footer total */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-bg-secondary/50">
            <span className="text-xs text-text-secondary">{filtered.length} transactions</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary">Total:</span>
              <span className="text-sm font-mono font-bold text-accent-rose">{fmt(total)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingExpense(null) }}
        title={editingExpense ? 'Edit Expense' : 'New Expense'}
      >
        <ExpenseForm
          initial={editingExpense}
          onSave={(data) => {
            if (editingExpense) {
              updateExpense(editingExpense.id, data)
            } else {
              addExpense(data)
            }
            setShowModal(false)
            setEditingExpense(null)
          }}
          onClose={() => { setShowModal(false); setEditingExpense(null) }}
        />
      </Modal>
    </div>
  )
}
