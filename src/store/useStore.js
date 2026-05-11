import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const SAMPLE_EXPENSES = [
  // MAY 2026
  { id: 'e001', amount: 900, category: 'housing', description: 'Renda Apartamento', date: '2026-05-01', isRecurring: true },
  { id: 'e002', amount: 45, category: 'utilities', description: 'MEO Internet', date: '2026-05-01', isRecurring: true },
  { id: 'e003', amount: 9.99, category: 'subscriptions', description: 'Spotify', date: '2026-05-02', isRecurring: true },
  { id: 'e004', amount: 15.99, category: 'subscriptions', description: 'Netflix', date: '2026-05-02', isRecurring: true },
  { id: 'e005', amount: 12.99, category: 'subscriptions', description: 'Disney+', date: '2026-05-02', isRecurring: true },
  { id: 'e006', amount: 35, category: 'health', description: 'Ginásio Holmes Place', date: '2026-05-02', isRecurring: true },
  { id: 'e007', amount: 40, category: 'transport', description: 'Passe Andante Mensal', date: '2026-05-03', isRecurring: true },
  { id: 'e008', amount: 87.45, category: 'groceries', description: 'Continente', date: '2026-05-04', isRecurring: false },
  { id: 'e009', amount: 42.50, category: 'restaurants', description: 'Tasca do Chico', date: '2026-05-04', isRecurring: false },
  { id: 'e010', amount: 28, category: 'entertainment', description: 'Teatro Nacional', date: '2026-05-06', isRecurring: false },
  { id: 'e011', amount: 65.30, category: 'groceries', description: 'Pingo Doce', date: '2026-05-08', isRecurring: false },
  { id: 'e012', amount: 55, category: 'restaurants', description: 'Noite de Sushi', date: '2026-05-09', isRecurring: false },
  { id: 'e013', amount: 120, category: 'shopping', description: 'FNAC – Livros e Acessórios', date: '2026-05-10', isRecurring: false },
  { id: 'e014', amount: 19.99, category: 'entertainment', description: 'Bilhetes Cinema', date: '2026-05-10', isRecurring: false },
  { id: 'e015', amount: 45.20, category: 'health', description: 'Farmácia Saúde', date: '2026-05-11', isRecurring: false },
  // APRIL 2026
  { id: 'e101', amount: 900, category: 'housing', description: 'Renda Apartamento', date: '2026-04-01', isRecurring: true },
  { id: 'e102', amount: 45, category: 'utilities', description: 'MEO Internet', date: '2026-04-01', isRecurring: true },
  { id: 'e103', amount: 9.99, category: 'subscriptions', description: 'Spotify', date: '2026-04-02', isRecurring: true },
  { id: 'e104', amount: 15.99, category: 'subscriptions', description: 'Netflix', date: '2026-04-02', isRecurring: true },
  { id: 'e105', amount: 12.99, category: 'subscriptions', description: 'Disney+', date: '2026-04-02', isRecurring: true },
  { id: 'e106', amount: 35, category: 'health', description: 'Ginásio Holmes Place', date: '2026-04-02', isRecurring: true },
  { id: 'e107', amount: 40, category: 'transport', description: 'Passe Andante Mensal', date: '2026-04-03', isRecurring: true },
  { id: 'e108', amount: 92.30, category: 'groceries', description: 'Continente', date: '2026-04-03', isRecurring: false },
  { id: 'e109', amount: 78, category: 'utilities', description: 'Electricidade EDP', date: '2026-04-05', isRecurring: false },
  { id: 'e110', amount: 65.50, category: 'restaurants', description: 'Solar dos Presuntos', date: '2026-04-05', isRecurring: false },
  { id: 'e111', amount: 45.80, category: 'groceries', description: 'Mercado de Matosinhos', date: '2026-04-07', isRecurring: false },
  { id: 'e112', amount: 85.90, category: 'groceries', description: 'Pingo Doce', date: '2026-04-10', isRecurring: false },
  { id: 'e113', amount: 95, category: 'shopping', description: 'Zara – Primavera', date: '2026-04-12', isRecurring: false },
  { id: 'e114', amount: 48.50, category: 'restaurants', description: 'Brunch Domingo', date: '2026-04-13', isRecurring: false },
  { id: 'e115', amount: 25, category: 'entertainment', description: 'NOS Alive Bilhete', date: '2026-04-15', isRecurring: false },
  { id: 'e116', amount: 72.40, category: 'groceries', description: 'Continente Frescal', date: '2026-04-17', isRecurring: false },
  { id: 'e117', amount: 38.20, category: 'restaurants', description: 'Pizzeria Vesuvio', date: '2026-04-19', isRecurring: false },
  { id: 'e118', amount: 180, category: 'shopping', description: 'Decathlon – Equipamento', date: '2026-04-20', isRecurring: false },
  { id: 'e119', amount: 55, category: 'health', description: 'Consulta Médica', date: '2026-04-22', isRecurring: false },
  { id: 'e120', amount: 28.50, category: 'entertainment', description: 'Bowling + Jantar', date: '2026-04-25', isRecurring: false },
  { id: 'e121', amount: 68.75, category: 'groceries', description: 'Lidl Compras Semana', date: '2026-04-27', isRecurring: false },
  { id: 'e122', amount: 42, category: 'restaurants', description: 'Tascas Bairro Alto', date: '2026-04-29', isRecurring: false },
  // MARCH 2026
  { id: 'e201', amount: 900, category: 'housing', description: 'Renda Apartamento', date: '2026-03-01', isRecurring: true },
  { id: 'e202', amount: 45, category: 'utilities', description: 'MEO Internet', date: '2026-03-01', isRecurring: true },
  { id: 'e203', amount: 9.99, category: 'subscriptions', description: 'Spotify', date: '2026-03-02', isRecurring: true },
  { id: 'e204', amount: 15.99, category: 'subscriptions', description: 'Netflix', date: '2026-03-02', isRecurring: true },
  { id: 'e205', amount: 12.99, category: 'subscriptions', description: 'Disney+', date: '2026-03-02', isRecurring: true },
  { id: 'e206', amount: 35, category: 'health', description: 'Ginásio Holmes Place', date: '2026-03-02', isRecurring: true },
  { id: 'e207', amount: 40, category: 'transport', description: 'Passe Andante Mensal', date: '2026-03-03', isRecurring: true },
  { id: 'e208', amount: 88.60, category: 'groceries', description: 'Continente', date: '2026-03-04', isRecurring: false },
  { id: 'e209', amount: 82, category: 'utilities', description: 'Electricidade EDP', date: '2026-03-06', isRecurring: false },
  { id: 'e210', amount: 52.30, category: 'restaurants', description: 'Aniversário Jantar', date: '2026-03-08', isRecurring: false },
  { id: 'e211', amount: 79.90, category: 'groceries', description: 'Pingo Doce', date: '2026-03-10', isRecurring: false },
  { id: 'e212', amount: 35, category: 'entertainment', description: 'Museu do Azulejo', date: '2026-03-12', isRecurring: false },
  { id: 'e213', amount: 65.80, category: 'groceries', description: 'Lidl', date: '2026-03-15', isRecurring: false },
  { id: 'e214', amount: 110, category: 'shopping', description: 'H&M Outono-Inverno', date: '2026-03-17', isRecurring: false },
  { id: 'e215', amount: 36.50, category: 'restaurants', description: 'Almoço de Negócios', date: '2026-03-19', isRecurring: false },
  { id: 'e216', amount: 28, category: 'health', description: 'Farmácia Saúde', date: '2026-03-21', isRecurring: false },
  { id: 'e217', amount: 82.40, category: 'groceries', description: 'Continente Grande', date: '2026-03-22', isRecurring: false },
  { id: 'e218', amount: 65, category: 'transport', description: 'Uber Viagem Longa', date: '2026-03-24', isRecurring: false },
  { id: 'e219', amount: 45.20, category: 'restaurants', description: 'Bar de Cocktails', date: '2026-03-28', isRecurring: false },
  { id: 'e220', amount: 250, category: 'shopping', description: 'Apple – Acessório', date: '2026-03-30', isRecurring: false },
  // FEBRUARY 2026
  { id: 'e301', amount: 900, category: 'housing', description: 'Renda Apartamento', date: '2026-02-01', isRecurring: true },
  { id: 'e302', amount: 45, category: 'utilities', description: 'MEO Internet', date: '2026-02-01', isRecurring: true },
  { id: 'e303', amount: 9.99, category: 'subscriptions', description: 'Spotify', date: '2026-02-02', isRecurring: true },
  { id: 'e304', amount: 15.99, category: 'subscriptions', description: 'Netflix', date: '2026-02-02', isRecurring: true },
  { id: 'e305', amount: 12.99, category: 'subscriptions', description: 'Disney+', date: '2026-02-02', isRecurring: true },
  { id: 'e306', amount: 35, category: 'health', description: 'Ginásio Holmes Place', date: '2026-02-02', isRecurring: true },
  { id: 'e307', amount: 40, category: 'transport', description: 'Passe Andante Mensal', date: '2026-02-03', isRecurring: true },
  { id: 'e308', amount: 76.30, category: 'groceries', description: 'Continente', date: '2026-02-04', isRecurring: false },
  { id: 'e309', amount: 68, category: 'utilities', description: 'Electricidade EDP', date: '2026-02-06', isRecurring: false },
  { id: 'e310', amount: 125, category: 'restaurants', description: 'Dia dos Namorados', date: '2026-02-14', isRecurring: false },
  { id: 'e311', amount: 72.50, category: 'groceries', description: 'Pingo Doce', date: '2026-02-10', isRecurring: false },
  { id: 'e312', amount: 45, category: 'entertainment', description: 'Concerto de Fado', date: '2026-02-15', isRecurring: false },
  { id: 'e313', amount: 58.20, category: 'groceries', description: 'Lidl', date: '2026-02-17', isRecurring: false },
  { id: 'e314', amount: 88, category: 'shopping', description: 'Parfois – Presentes', date: '2026-02-13', isRecurring: false },
  { id: 'e315', amount: 32.50, category: 'restaurants', description: 'Bica + Pastelaria', date: '2026-02-20', isRecurring: false },
  { id: 'e316', amount: 18, category: 'health', description: 'Farmácia', date: '2026-02-22', isRecurring: false },
  { id: 'e317', amount: 68.80, category: 'groceries', description: 'Continente Matosinhos', date: '2026-02-24', isRecurring: false },
  { id: 'e318', amount: 52, category: 'transport', description: 'Comboio Porto-Lisboa', date: '2026-02-26', isRecurring: false },
  { id: 'e319', amount: 38.50, category: 'restaurants', description: 'Marisqueira Porto', date: '2026-02-28', isRecurring: false },
]

const DEFAULT_BUCKETS = [
  { id: 'needs', name: 'Needs', percentage: 50, color: '#4F8EF7', icon: '🏠', description: 'Rent, groceries, utilities, transport' },
  { id: 'wants', name: 'Wants', percentage: 30, color: '#F5A623', icon: '🎯', description: 'Dining, entertainment, shopping' },
  { id: 'savings', name: 'Savings', percentage: 20, color: '#34D399', icon: '💎', description: 'Emergency fund, investments' },
]

export const useStore = create(
  persist(
    (set, get) => ({
      // -- Budget ------------------------------------------
      salary: 3200,
      budgetPreset: '50/30/20',
      buckets: DEFAULT_BUCKETS,
      plannedSavings: 640, // 20% of 3200

      // -- Expenses -----------------------------------------
      expenses: SAMPLE_EXPENSES,

      // -- Emergency Fund Goal -------------------------------
      emergencyFundGoal: 6000,
      emergencyFundCurrent: 1800,

      // -- Achievements -------------------------------------
      unlockedBadges: ['first_expense', 'budget_setter'],

      // -- Actions: Budget -----------------------------------
      setSalary: (salary) => set({ salary }),
      setBuckets: (buckets) => set({ buckets }),
      setBudgetPreset: (preset) => {
        const salary = get().salary
        let buckets = [...DEFAULT_BUCKETS]
        if (preset === '50/30/20') {
          buckets = [
            { id: 'needs', name: 'Needs', percentage: 50, color: '#4F8EF7', icon: '🏠', description: 'Rent, groceries, utilities, transport' },
            { id: 'wants', name: 'Wants', percentage: 30, color: '#F5A623', icon: '🎯', description: 'Dining, entertainment, shopping' },
            { id: 'savings', name: 'Savings', percentage: 20, color: '#34D399', icon: '💎', description: 'Emergency fund, investments' },
          ]
        } else if (preset === '60/20/20') {
          buckets = [
            { id: 'needs', name: 'Needs', percentage: 60, color: '#4F8EF7', icon: '🏠', description: 'Rent, groceries, utilities, transport' },
            { id: 'wants', name: 'Wants', percentage: 20, color: '#F5A623', icon: '🎯', description: 'Dining, entertainment, shopping' },
            { id: 'savings', name: 'Savings', percentage: 20, color: '#34D399', icon: '💎', description: 'Emergency fund, investments' },
          ]
        } else if (preset === '70/20/10') {
          buckets = [
            { id: 'needs', name: 'Needs', percentage: 70, color: '#4F8EF7', icon: '🏠', description: 'Rent, groceries, utilities, transport' },
            { id: 'wants', name: 'Wants', percentage: 20, color: '#F5A623', icon: '🎯', description: 'Dining, entertainment, shopping' },
            { id: 'savings', name: 'Savings', percentage: 10, color: '#34D399', icon: '💎', description: 'Emergency fund, investments' },
          ]
        }
        set({ budgetPreset: preset, buckets, plannedSavings: Math.round(salary * (buckets.find(b => b.id === 'savings')?.percentage || 20) / 100) })
      },

      updateBucket: (id, updates) =>
        set((state) => ({
          buckets: state.buckets.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        })),

      addBucket: (bucket) =>
        set((state) => ({ buckets: [...state.buckets, bucket] })),

      removeBucket: (id) =>
        set((state) => ({ buckets: state.buckets.filter((b) => b.id !== id) })),

      // -- Actions: Expenses ---------------------------------
      addExpense: (expense) => {
        const newExpense = { ...expense, id: `e_${Date.now()}` }
        set((state) => {
          const expenses = [...state.expenses, newExpense]
          const badges = get()._checkBadges(expenses, state.unlockedBadges)
          return { expenses, unlockedBadges: badges }
        })
        return newExpense
      },

      updateExpense: (id, updates) =>
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),

      deleteExpense: (id) =>
        set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),

      importExpenses: (imported) =>
        set((state) => ({ expenses: [...state.expenses, ...imported] })),

      // -- Actions: Goals ------------------------------------
      setEmergencyFundGoal: (goal) => set({ emergencyFundGoal: goal }),
      setEmergencyFundCurrent: (current) => set({ emergencyFundCurrent: current }),

      // -- Badge helpers -------------------------------------
      unlockBadge: (id) =>
        set((state) => ({
          unlockedBadges: state.unlockedBadges.includes(id)
            ? state.unlockedBadges
            : [...state.unlockedBadges, id],
        })),

      _checkBadges: (expenses, current) => {
        const badges = [...current]
        if (expenses.length >= 1 && !badges.includes('first_expense')) badges.push('first_expense')
        if (expenses.length >= 10 && !badges.includes('ten_expenses')) badges.push('ten_expenses')
        if (expenses.length >= 50 && !badges.includes('fifty_expenses')) badges.push('fifty_expenses')
        return badges
      },

      resetToSampleData: () =>
        set({
          salary: 3200,
          budgetPreset: '50/30/20',
          buckets: DEFAULT_BUCKETS,
          expenses: SAMPLE_EXPENSES,
          emergencyFundGoal: 6000,
          emergencyFundCurrent: 1800,
          unlockedBadges: ['first_expense', 'budget_setter'],
        }),
    }),
    { name: 'flux-expense-tracker-v1' }
  )
)
