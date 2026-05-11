import Papa from 'papaparse'
import { KEYWORD_MAP } from './categories.js'

export function autoCategory(description = '') {
  const lower = description.toLowerCase()
  for (const rule of KEYWORD_MAP) {
    if (rule.keywords.some((k) => lower.includes(k))) {
      return rule.category
    }
  }
  return 'other'
}

export function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const expenses = results.data.map((row, idx) => {
            // Support multiple column naming conventions
            const description =
              row['Description'] ||
              row['Descrição'] ||
              row['Descricao'] ||
              row['description'] ||
              row['Merchant'] ||
              row['merchant'] ||
              row['Name'] ||
              row['name'] ||
              'Imported Expense'

            const amountRaw =
              row['Amount'] ||
              row['Montante'] ||
              row['amount'] ||
              row['Value'] ||
              row['value'] ||
              '0'
            const amount = Math.abs(parseFloat(String(amountRaw).replace(/[€$,\s]/g, '').replace(',', '.')))

            const dateRaw =
              row['Date'] ||
              row['Data'] ||
              row['date'] ||
              row['Transaction Date'] ||
              new Date().toISOString().slice(0, 10)
            
            // Attempt date parsing
            let date = dateRaw
            try {
              const d = new Date(dateRaw)
              if (!isNaN(d.getTime())) {
                date = d.toISOString().slice(0, 10)
              }
            } catch (_) {}

            const category = autoCategory(description)

            return {
              id: `csv_${Date.now()}_${idx}`,
              description,
              amount: isNaN(amount) ? 0 : amount,
              date,
              category,
              isRecurring: false,
              importedFromCSV: true,
            }
          }).filter((e) => e.amount > 0)

          resolve(expenses)
        } catch (err) {
          reject(err)
        }
      },
      error: reject,
    })
  })
}
