import { incline } from 'lvovich'
import pkg from 'number-to-words-ru'
import type { ImageValue } from '~/types/image.interface'
import type { Ref } from 'vue'

const { convert } = pkg

type DeclensionCase = 'nominative' | 'genitive' | 'dative' | 'accusative' | 'instrumental' | 'prepositional'

const CASE_MAP: Record<string, DeclensionCase> = {
  именительный: 'nominative', nominative: 'nominative',
  родительный: 'genitive', genitive: 'genitive',
  дательный: 'dative', dative: 'dative',
  винительный: 'accusative', accusative: 'accusative',
  творительный: 'instrumental', instrumental: 'instrumental',
  предложный: 'prepositional', prepositional: 'prepositional',
}

const NUMERIC_RE = /^-?\d+([.,]\d+)?$/

const NUMERIC_FORMULA_HANDLERS: Record<string, (nums: number[]) => number> = {
  sum: nums => nums.reduce((a, b) => a + b, 0),
  avg: nums => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0),
}

const STRING_FORMULA_NAMES = ['decline', 'money-text', 'today']

const FORMULA_ALIASES: Record<string, string> = {
  сумм: 'sum',
  срзнач: 'avg',
  склонить: 'decline',
  'сумма-прописью': 'money-text',
  сегодня: 'today',
}

const FORMULA_RE = new RegExp(
  `^(${[
    ...Object.keys(NUMERIC_FORMULA_HANDLERS),
    ...STRING_FORMULA_NAMES,
    ...Object.keys(FORMULA_ALIASES),
  ].join('|')})\\(([\\s\\S]+)\\)$`,
  'i'
)

export type FormulaResult =
  | { value: number | string; error: null }
  | { value: null; error: string }

function parseNumeric(raw: string): number {
  return parseFloat(raw.trim().replace(',', '.'))
}

function isValidNumeric(raw: string): boolean {
  return NUMERIC_RE.test(raw.trim())
}

function splitArgs(raw: string): string[] {
  const args: string[] = []
  let depth = 0
  let cur = ''

  for (const ch of raw) {
    if (ch === '(') depth++
    else if (ch === ')') depth--
    else if (ch === ';' && depth === 0) { args.push(cur.trim()); cur = ''; continue }
    cur += ch
  }

  if (cur.trim()) args.push(cur.trim())

  return args
}

function declenseFio(value: string, grammaticalCase: DeclensionCase): string | false {
  if (!value.trim() || !isNaN(Number(value))) return false

  const parts = value.trim().split(/\s+/)
  const person = { last: parts[0] ?? '', first: parts[1] ?? '', middle: parts[2] ?? '' }
  const declined = incline(person, grammaticalCase)

  return [declined.last, declined.first, declined.middle].filter(Boolean).join(' ')
}

function numberToWords(value: string): string | false {
  const num = parseFloat(value.replace(',', '.'))

  if (isNaN(num)) return false

  return convert(String(num))
}

export function useFormulaEval(
  loopValues: Ref<Record<string, Record<string, string | ImageValue>[]>>,
  values: Ref<Record<string, string | ImageValue>>
) {
  function isFormula(val: string | ImageValue | undefined): val is string {
    return typeof val === 'string' && FORMULA_RE.test(val.trim())
  }

  function resolveFieldRef(ref: string): string | null {
    const inner = ref.match(/^\{([^}]+)\}$/)
    if (!inner) return null
    const path = inner[1]!.trim()
    const direct = values.value[path]
    if (typeof direct === 'string') return direct
    const withRazno = values.value[`Разное.${path}`]
    return typeof withRazno === 'string' ? withRazno : null
  }

  function resolveNumericArg(token: string): { nums: number[]; error: string | null } {
    const t = token.trim()

    const parenIdx = t.indexOf('(')

    if (parenIdx > 0 && t.endsWith(')')) {
      const fnRaw = t.slice(0, parenIdx).toLowerCase()
      const fn = FORMULA_ALIASES[fnRaw] ?? fnRaw

      if (fn in NUMERIC_FORMULA_HANDLERS) {
        const result = evalNumericFormula(fn, t.slice(parenIdx + 1, -1))
        if (result.error) return { nums: [], error: result.error }
        return { nums: [result.value as number], error: null }
      }

      return { nums: [], error: `функция «${fnRaw}» не числовая` }
    }

    if (/^\{[^}]+\}$/.test(t)) {
      const val = resolveFieldRef(t)
      if (val === null) return { nums: [], error: `поле «${t}» не найдено` }
      if (val && !isValidNumeric(val)) return { nums: [], error: `значение «${val}» не является числом` }
      return { nums: val && isValidNumeric(val) ? [parseNumeric(val)] : [], error: null }
    }

    if (isValidNumeric(t)) {
      return { nums: [parseNumeric(t)], error: null }
    }

    const dotIdx = t.indexOf('.')
    if (dotIdx !== -1) {
      const table = t.slice(0, dotIdx)
      const field = t.slice(dotIdx + 1)
      const rows = loopValues.value[table + '[]']

      if (!rows) return { nums: [], error: `таблица «${table}» не найдена` }

      if (rows.length === 0 || !(field in rows[0]!))
        return { nums: [], error: `поле «${field}» не найдено в таблице «${table}»` }
      
      for (const row of rows) {
        const raw = row[field] as string
        if (raw && !isValidNumeric(raw))
          return { nums: [], error: `значение «${raw}» не является числом` }
      }
      return {
        nums: rows.map(r => r[field] as string).filter(r => r && isValidNumeric(r)).map(parseNumeric),
        error: null,
      }
    }

    return { nums: [], error: `неверный синтаксис «${t}»` }
  }

  function evalNumericFormula(fn: string, rawArgs: string): FormulaResult {
    const allNums: number[] = []
    for (const token of splitArgs(rawArgs)) {
      const { nums, error } = resolveNumericArg(token)
      if (error) return { value: null, error }
      allNums.push(...nums)
    }
    return { value: NUMERIC_FORMULA_HANDLERS[fn]!(allNums), error: null }
  }

  function evalDecline(rawArg: string): FormulaResult {
    const semi = rawArg.indexOf(';')
    if (semi === -1) return { value: null, error: 'неверный синтаксис' }
    const fieldRef = rawArg.slice(0, semi).trim()
    const caseStr = rawArg.slice(semi + 1).trim().replace(/^["']|["']$/g, '').toLowerCase()
    const fieldValue = resolveFieldRef(fieldRef)
    if (fieldValue === null) return { value: null, error: 'поле не найдено' }
    const declCase = CASE_MAP[caseStr]
    if (!declCase) return { value: null, error: `неизвестный падеж «${caseStr}»` }
    const result = declenseFio(fieldValue, declCase)
    if (result === false) return { value: null, error: 'не удалось склонить' }
    return { value: result, error: null }
  }

  function evalMoneyText(rawArg: string): FormulaResult {
    const arg = rawArg.trim()

    const parenIdx = arg.indexOf('(')
    if (parenIdx > 0 && arg.endsWith(')')) {
      const fnRaw = arg.slice(0, parenIdx).toLowerCase()
      const fn = FORMULA_ALIASES[fnRaw] ?? fnRaw
      if (fn in NUMERIC_FORMULA_HANDLERS) {
        const result = evalNumericFormula(fn, arg.slice(parenIdx + 1, -1))
        if (result.error) return result
        const words = numberToWords(String(result.value))
        if (words === false) return { value: null, error: 'не является числом' }
        return { value: words, error: null }
      }
      return { value: null, error: `функция «${fnRaw}» не числовая` }
    }

    let numStr: string
    if (/^\{[^}]+\}$/.test(arg)) {
      const fieldValue = resolveFieldRef(arg)
      if (fieldValue === null) return { value: null, error: 'поле не найдено' }
      numStr = fieldValue
    } else {
      numStr = arg
    }
    const result = numberToWords(numStr)
    if (result === false) return { value: null, error: 'не является числом' }
    return { value: result, error: null }
  }

  function evalToday(format: string): FormulaResult {
    const d = new Date()
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = String(d.getFullYear())
    const result = format.replace(/yyyy/gi, yyyy).replace(/mm/gi, mm).replace(/dd/gi, dd)
    return { value: result, error: null }
  }

  function evalFormula(val: string): FormulaResult {
    const match = val.trim().match(FORMULA_RE)
    if (!match) return { value: null, error: 'неверный синтаксис' }
    const rawFn = match[1]!.toLowerCase()
    const fn = FORMULA_ALIASES[rawFn] ?? rawFn
    const rawArg = match[2]!

    if (fn === 'decline') return evalDecline(rawArg)
    if (fn === 'money-text') return evalMoneyText(rawArg)
    if (fn === 'today') return evalToday(rawArg)

    return evalNumericFormula(fn, rawArg)
  }

  function resolveFormula(val: string): string {
    if (!isFormula(val)) return val
    const { value, error } = evalFormula(val)
    return error ? '' : String(value)
  }

  return { isFormula, evalFormula, resolveFormula }
}
