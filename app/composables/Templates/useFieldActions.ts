import { incline } from 'lvovich'
import { convert } from 'number-to-words-ru'

type DeclensionCase = 'nominative' | 'genitive' | 'dative' | 'accusative' | 'instrumental' | 'prepositional'

export function useFieldActions() {
  function declenseFio(value: string, grammaticalCase: DeclensionCase): string | false {
    if (!value.trim() || !isNaN(Number(value))) return false

    const parts = value.trim().split(/\s+/)

    const person = {
      last: parts[0] ?? '',
      first: parts[1] ?? '',
      middle: parts[2] ?? '',
    }

    const declined = incline(person, grammaticalCase)

    return [declined.last, declined.first, declined.middle].filter(Boolean).join(' ')
  }

  function numberToWords(value: string): string | false {
    const num = parseFloat(value.replace(',', '.'))

    if (isNaN(num)) return false

    return convert(String(num))
  }

  function insertDate(format: 'full' | 'day' | 'month' | 'year'): string {
    const d = new Date()

    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = String(d.getFullYear())
    
    if (format === 'full') return `${day}.${month}.${year}`
    if (format === 'day') return day
    if (format === 'month') return month
    return year
  }

  return { declenseFio, numberToWords, insertDate }
}
