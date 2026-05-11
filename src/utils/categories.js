export const CATEGORIES = {
  housing: {
    id: 'housing',
    label: 'Housing',
    icon: '🏠',
    color: '#4F8EF7',
    bucket: 'needs',
  },
  groceries: {
    id: 'groceries',
    label: 'Groceries',
    icon: '🛒',
    color: '#34D399',
    bucket: 'needs',
  },
  utilities: {
    id: 'utilities',
    label: 'Utilities',
    icon: '⚡',
    color: '#22D3EE',
    bucket: 'needs',
  },
  transport: {
    id: 'transport',
    label: 'Transport',
    icon: '🚌',
    color: '#A78BFA',
    bucket: 'needs',
  },
  health: {
    id: 'health',
    label: 'Health',
    icon: '💊',
    color: '#F87171',
    bucket: 'needs',
  },
  subscriptions: {
    id: 'subscriptions',
    label: 'Subscriptions',
    icon: '📱',
    color: '#F5A623',
    bucket: 'wants',
  },
  restaurants: {
    id: 'restaurants',
    label: 'Restaurants',
    icon: '🍽️',
    color: '#FB923C',
    bucket: 'wants',
  },
  entertainment: {
    id: 'entertainment',
    label: 'Entertainment',
    icon: '🎭',
    color: '#E879F9',
    bucket: 'wants',
  },
  shopping: {
    id: 'shopping',
    label: 'Shopping',
    icon: '🛍️',
    color: '#38BDF8',
    bucket: 'wants',
  },
  education: {
    id: 'education',
    label: 'Education',
    icon: '📚',
    color: '#6EE7B7',
    bucket: 'wants',
  },
  savings: {
    id: 'savings',
    label: 'Savings',
    icon: '🏦',
    color: '#34D399',
    bucket: 'savings',
  },
  investments: {
    id: 'investments',
    label: 'Investments',
    icon: '📈',
    color: '#F5A623',
    bucket: 'savings',
  },
  other: {
    id: 'other',
    label: 'Other',
    icon: '💰',
    color: '#7B88A4',
    bucket: 'wants',
  },
}

export const CATEGORY_LIST = Object.values(CATEGORIES)

// Auto-categorization keywords (useful for CSV import)
export const KEYWORD_MAP = [
  { keywords: ['continente', 'pingo doce', 'lidl', 'aldi', 'mercadona', 'minipreço', 'intermarché', 'jumbo', 'supermercado', 'mercado'], category: 'groceries' },
  { keywords: ['meo', 'nos ', 'vodafone', 'nowo', 'internet', 'telecomunicações', 'electricidade', 'edp', 'água', 'gás', 'agua', 'gas'], category: 'utilities' },
  { keywords: ['netflix', 'spotify', 'disney', 'hbo', 'amazon prime', 'apple tv', 'youtube premium', 'twitch', 'adobe'], category: 'subscriptions' },
  { keywords: ['uber', 'bolt', 'cp ', 'comboio', 'metro', 'andante', 'rede expressos', 'galp', 'bp ', 'repsol', 'cepsa', 'autoestrada', 'portagem'], category: 'transport' },
  { keywords: ['farmácia', 'farmacia', 'clínica', 'clinica', 'hospital', 'médico', 'medico', 'dentista', 'optician', 'ginásio', 'ginasio', 'gym', 'fitness'], category: 'health' },
  { keywords: ['renda', 'arrendamento', 'condomínio', 'condominio', 'hipoteca'], category: 'housing' },
  { keywords: ['restaurante', 'tasca', 'café', 'cafe', 'pizzeria', 'sushi', 'marisqueira', 'bifanas', 'hamburguer', 'mcdonalds', 'kfc', 'pizza hut', 'nandos', 'wingstop', 'food delivery', 'uber eats', 'glovo'], category: 'restaurants' },
  { keywords: ['cinema', 'teatro', 'museu', 'concerto', 'festival', 'bilhete', 'escape room', 'bowling', 'fnac', 'worten', 'gaming', 'steam'], category: 'entertainment' },
  { keywords: ['zara', 'h&m', 'primark', 'decathlon', 'sport zone', 'footlocker', 'nike', 'adidas', 'parfois', 'pull&bear', 'stradivarius', 'bershka', 'amazon', 'aliexpress', 'shein'], category: 'shopping' },
  { keywords: ['udemy', 'coursera', 'livro', 'livros', 'curso', 'escola', 'universidade'], category: 'education' },
]
