import type { ImageValue } from '~/types/image.interface'
import type { Ref } from 'vue'

const NUMERIC_RE = /^-?\d+([.,]\d+)?$/

const FORMULA_HANDLERS: Record<string, (nums: number[]) => number> = {
  sum: nums => nums.reduce((a, b) => a + b, 0),
  avg: nums => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0),
}

const FORMULA_RE = new RegExp(
  `^(${Object.keys(FORMULA_HANDLERS).join('|')})\\(([^)]+)\\)$`,
  'i'
)

export type FormulaResult =
  | { value: number; error: null }
  | { value: null; error: string }

function parseNumeric(raw: string): number {
  return parseFloat(raw.trim().replace(',', '.'))
}

function isValidNumeric(raw: string): boolean {
  return NUMERIC_RE.test(raw.trim())
}

export function useFormulaEval(
  loopValues: Ref<Record<string, Record<string, string | ImageValue>[]>>
) {
  function isFormula(val: string | ImageValue | undefined): val is string {
    return typeof val === 'string' && FORMULA_RE.test(val.trim())
  }

  function evalFormula(val: string): FormulaResult {
    const match = val.trim().match(FORMULA_RE)
    if (!match) return { value: null, error: 'неверный синтаксис' }
    const fn = match[1]!.toLowerCase()
    const arg = match[2]!.trim()

    const dotIdx = arg.indexOf('.')
    if (dotIdx === -1) return { value: null, error: 'неверный синтаксис' }
    const table = arg.slice(0, dotIdx)
    const field = arg.slice(dotIdx + 1)

    const rows = loopValues.value[table + '[]']
    if (!rows) return { value: null, error: `таблица «${table}» не найдена` }
    if (rows.length === 0 || !(field in rows[0]!))
      return { value: null, error: `поле «${field}» не найдено в таблице «${table}»` }

    for (const row of rows) {
      const raw = row[field] as string
      if (raw && !isValidNumeric(raw))
        return { value: null, error: `значение «${raw}» не является числом` }
    }

    const nums = rows
      .map(r => r[field] as string)
      .filter(raw => raw && isValidNumeric(raw))
      .map(raw => parseNumeric(raw))

    return { value: FORMULA_HANDLERS[fn]!(nums), error: null }
  }

  function resolveFormula(val: string): string {
    if (!isFormula(val)) return val
    const { value, error } = evalFormula(val)
    return error ? '' : String(value)
  }

  return { isFormula, evalFormula, resolveFormula }
}
