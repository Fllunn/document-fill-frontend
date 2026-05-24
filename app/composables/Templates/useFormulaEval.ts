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

const MONTH_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]

const NUMERIC_FORMULA_HANDLERS: Record<string, (nums: number[]) => number> = {
  sum: nums => nums.reduce((a, b) => a + b, 0),
  avg: nums => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0),
}

const STRING_FORMULA_NAMES = ['decline', 'money-text', 'today', 'count-row', 'if', 'month-gen']

const FORMULA_ALIASES: Record<string, string> = {
  сумм: 'sum',
  срзнач: 'avg',
  склонить: 'decline',
  'сумма-прописью': 'money-text',
  сегодня: 'today',
  'сумма-строк': 'count-row',
  если: 'if',
  'месяц-род': 'month-gen',
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

function parseConditionOp(cond: string): { left: string; op: string; right: string } | null {
  const ops = ['<=', '>=', '<>', '!=', '<', '>', '=']
  let depth = 0

  for (let i = 0; i < cond.length; i++) {
    if (cond[i] === '(') depth++
    else if (cond[i] === ')') depth--

    else if (depth === 0) {
      for (const op of ops) {
        if (cond.slice(i, i + op.length) === op)
          return { left: cond.slice(0, i).trim(), op, right: cond.slice(i + op.length).trim() }
      }
    }
  }
  return null
}

export function useFormulaEval(
  loopValues: Ref<Record<string, Record<string, string | ImageValue>[]>>,
  values: Ref<Record<string, string | ImageValue>>
) {
  const resolvingFields = new Set<string>()

  function isFormula(val: string | ImageValue | undefined): val is string {
    return typeof val === 'string' && FORMULA_RE.test(val.trim())
  }

  function resolveFieldRef(ref: string): string | null {
    const inner = ref.match(/^\{([^}]+)\}$/)
    if (!inner) return null
    const path = inner[1]!.trim()

    const direct = values.value[path]
    
    const raw = typeof direct === 'string'
      ? direct
      : (typeof values.value[`Разное.${path}`] === 'string' ? values.value[`Разное.${path}`] as string : null)

    if (raw === null) return null

    if (FORMULA_RE.test(raw.trim())) {
      if (resolvingFields.has(path)) return null
      resolvingFields.add(path)
      const result = evalFormula(raw)
      resolvingFields.delete(path)
      if (result.error) return null
      return String(result.value)
    }

    return raw
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
    let result = format.replace(/yyyy/gi, yyyy).replace(/mm/gi, mm).replace(/dd/gi, dd)
    const fieldMatches = result.match(/\{[^}]+\}/g)

    if (fieldMatches) {
      for (const ref of fieldMatches) {
        const val = resolveFieldRef(ref)
        if (val === null) return { value: null, error: `поле «${ref}» не найдено` }
        result = result.replace(ref, val)
      }
    }
    return { value: result, error: null }
  }

  function resolveConditionOperand(token: string): { val: string | number; error: null } | { val: null; error: string } {
    const t = token.trim()

    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")))
      return { val: t.slice(1, -1), error: null }

    if (/^\{[^}]+\}$/.test(t)) {
      const v = resolveFieldRef(t)

      if (v === null) return { val: null, error: `поле «${t}» не найдено` }

      const n = parseFloat(v.replace(',', '.'))
      return { val: isNaN(n) ? v : n, error: null }
    }

    if (isValidNumeric(t)) return { val: parseNumeric(t), error: null }
    if (FORMULA_RE.test(t)) {
      const r = evalFormula(t)

      if (r.error) return { val: null, error: r.error }

      const n = typeof r.value === 'number' ? r.value : parseFloat(String(r.value).replace(',', '.'))

      return { val: isNaN(n) ? String(r.value) : n, error: null }
    }
    return { val: t, error: null }
  }

  function evalCountRow(rawArg: string): FormulaResult {
    const table = rawArg.trim()
    const rows = loopValues.value[table + '[]']

    if (!rows) return { value: null, error: `таблица «${table}» не найдена` }

    return { value: rows.length, error: null }
  }

  function evalIf(rawArg: string): FormulaResult {
    const args = splitArgs(rawArg)
    
    if (args.length !== 3) return { value: null, error: 'если() требует 3 аргумента' }

    const [condRaw, trueRaw, falseRaw] = args as [string, string, string]

    const parsed = parseConditionOp(condRaw)

    if (!parsed) return { value: null, error: 'неверное условие' }

    const { left, op, right } = parsed
    const lRes = resolveConditionOperand(left)
    const rRes = resolveConditionOperand(right)

    if (lRes.error) return { value: null, error: lRes.error }
    if (rRes.error) return { value: null, error: rRes.error }

    const lv = lRes.val
    const rv = rRes.val
    let condition: boolean

    if (typeof lv === 'number' && typeof rv === 'number') {
      if (op === '=') condition = lv === rv
      else if (op === '!=' || op === '<>') condition = lv !== rv
      else if (op === '<') condition = lv < rv
      else if (op === '>') condition = lv > rv
      else if (op === '<=') condition = lv <= rv
      else if (op === '>=') condition = lv >= rv
      else return { value: null, error: `неизвестный оператор «${op}»` }
    } else {
      const ls = String(lv)
      const rs = String(rv)
      if (op === '=') condition = ls === rs
      else if (op === '!=' || op === '<>') condition = ls !== rs
      else return { value: null, error: `оператор «${op}» не применим к строкам` }
    }

    const resOp = resolveConditionOperand(condition ? trueRaw : falseRaw)
    if (resOp.val === null) return { value: null, error: resOp.error }
    return { value: resOp.val, error: null }
  }

  function evalMonthGen(rawArg: string): FormulaResult {
    const resolved = resolveConditionOperand(rawArg.trim())
    if (resolved.val === null) return { value: null, error: resolved.error }
    const n = parseInt(String(resolved.val), 10)
    if (isNaN(n) || n < 1 || n > 12) return { value: null, error: `неверный номер месяца «${rawArg.trim()}»` }
    return { value: MONTH_GENITIVE[n - 1]!, error: null }
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
    if (fn === 'count-row') return evalCountRow(rawArg)
    if (fn === 'if') return evalIf(rawArg)
    if (fn === 'month-gen') return evalMonthGen(rawArg)

    return evalNumericFormula(fn, rawArg)
  }

  function resolveFormula(val: string): string {
    if (!isFormula(val)) return val
    const { value, error } = evalFormula(val)
    return error ? '' : String(value)
  }

  return { isFormula, evalFormula, resolveFormula }
}
