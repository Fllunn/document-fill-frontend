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

const STRING_FORMULA_NAMES = ['decline', 'money-text', 'today', 'count-row', 'if', 'month-gen', 'calc']

const FORMULA_ALIASES: Record<string, string> = {
  сумм: 'sum',
  срзнач: 'avg',
  склонить: 'decline',
  'сумма-прописью': 'money-text',
  сегодня: 'today',
  'сумма-строк': 'count-row',
  если: 'if',
  'месяц-род': 'month-gen',
  вычислить: 'calc',
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

      const nums: number[] = []
      for (const row of rows) {
        const raw = row[field] as string
        if (!raw) continue
        if (isValidNumeric(raw)) {
          nums.push(parseNumeric(raw))
        } else if (FORMULA_RE.test(raw.trim())) {
          const result = evalFormula(raw)
          if (result.error) return { nums: [], error: result.error }
          const n = typeof result.value === 'number'
            ? result.value
            : parseFloat(String(result.value).replace(',', '.'))
          if (isNaN(n)) return { nums: [], error: `формула «${raw}» не вернула число` }
          nums.push(n)
        } else {
          return { nums: [], error: `значение «${raw}» не является числом` }
        }
      }
      return { nums, error: null }
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

  function evalCalc(rawArg: string): FormulaResult {
    type Token =
      | { type: 'NUM'; value: number }
      | { type: 'OP'; op: '+' | '-' | '*' | '/' }
      | { type: 'LPAREN' }
      | { type: 'RPAREN' }
      | { type: 'FIELD'; raw: string }
      | { type: 'FORMULA'; raw: string }

    type ParseOk = { val: number; pos: number }
    type ParseErr = { error: string }
    type ParseResult = ParseOk | ParseErr

    const expr = rawArg.trim()
    if (!expr) return { value: null, error: 'пустое выражение' }

    function tokenize(s: string): Token[] | string {
      const tokens: Token[] = []
      let i = 0

      while (i < s.length) {
        const ch = s[i]!

        if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') { i++; continue }

        if (ch === '{') {
          const j = s.indexOf('}', i)
          if (j === -1) return 'незакрытая фигурная скобка'
          tokens.push({ type: 'FIELD', raw: s.slice(i, j + 1) })
          i = j + 1
          continue
        }

        const lastTok = tokens[tokens.length - 1]
        const prevIsOperand = lastTok !== undefined && (
          lastTok.type === 'NUM' || lastTok.type === 'RPAREN' ||
          lastTok.type === 'FIELD' || lastTok.type === 'FORMULA'
        )

        if (ch >= '0' && ch <= '9') {
          let j = i
          while (j < s.length && s[j]! >= '0' && s[j]! <= '9') j++
          if (j < s.length && (s[j] === '.' || s[j] === ',')) {
            j++
            while (j < s.length && s[j]! >= '0' && s[j]! <= '9') j++
          }
          tokens.push({ type: 'NUM', value: parseFloat(s.slice(i, j).replace(',', '.')) })
          i = j
          continue
        }

        if (ch === '-' && !prevIsOperand && i + 1 < s.length && s[i + 1]! >= '0' && s[i + 1]! <= '9') {
          let j = i + 1
          while (j < s.length && s[j]! >= '0' && s[j]! <= '9') j++
          if (j < s.length && (s[j] === '.' || s[j] === ',')) {
            j++
            while (j < s.length && s[j]! >= '0' && s[j]! <= '9') j++
          }
          tokens.push({ type: 'NUM', value: parseFloat(s.slice(i, j).replace(',', '.')) })
          i = j
          continue
        }

        if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
          tokens.push({ type: 'OP', op: ch as '+' | '-' | '*' | '/' })
          i++
          continue
        }

        if (ch === '(') { tokens.push({ type: 'LPAREN' }); i++; continue }
        if (ch === ')') { tokens.push({ type: 'RPAREN' }); i++; continue }

        if (/[a-zа-яёA-ZА-ЯЁ]/.test(ch)) {
          const start = i
          while (i < s.length && /[a-zа-яёA-ZА-ЯЁ0-9\-]/.test(s[i]!)) i++
          const name = s.slice(start, i)
          if (i >= s.length || s[i] !== '(')
            return `неизвестный идентификатор «${name}»`
          let depth = 0
          while (i < s.length) {
            if (s[i] === '(') depth++
            else if (s[i] === ')') { depth--; if (depth === 0) { i++; break } }
            i++
          }
          if (depth !== 0) return `незакрытая скобка в формуле «${name}»`
          tokens.push({ type: 'FORMULA', raw: s.slice(start, i) })
          continue
        }

        return `неожиданный символ «${ch}»`
      }

      return tokens
    }

    function parseExpr(tokens: Token[], pos: number): ParseResult {
      const first = parseTerm(tokens, pos)
      if ('error' in first) return first
      let val = first.val
      let cur = first.pos

      while (cur < tokens.length) {
        const tok = tokens[cur]!
        if (tok.type !== 'OP' || (tok.op !== '+' && tok.op !== '-')) break
        const op = tok.op; cur++
        const right = parseTerm(tokens, cur)
        if ('error' in right) return right
        cur = right.pos
        val = op === '+' ? val + right.val : val - right.val
      }

      return { val, pos: cur }
    }

    function parseTerm(tokens: Token[], pos: number): ParseResult {
      const first = parseFactor(tokens, pos)
      if ('error' in first) return first
      let val = first.val
      let cur = first.pos

      while (cur < tokens.length) {
        const tok = tokens[cur]!
        if (tok.type !== 'OP' || (tok.op !== '*' && tok.op !== '/')) break
        const op = tok.op; cur++
        const right = parseFactor(tokens, cur)
        if ('error' in right) return right
        cur = right.pos
        if (op === '/') {
          if (right.val === 0) return { error: 'деление на ноль' }
          val = val / right.val
        }
        else {
          val = val * right.val
        }
      }

      return { val, pos: cur }
    }

    function parseFactor(tokens: Token[], pos: number): ParseResult {
      const tok = pos < tokens.length ? tokens[pos] : undefined
      if (tok?.type === 'OP' && tok.op === '-') {
        const atom = parseAtom(tokens, pos + 1)
        if ('error' in atom) return atom
        return { val: -atom.val, pos: atom.pos }
      }
      return parseAtom(tokens, pos)
    }

    function parseAtom(tokens: Token[], pos: number): ParseResult {
      if (pos >= tokens.length) return { error: 'неожиданный конец выражения' }
      const tok = tokens[pos]!

      if (tok.type === 'NUM') return { val: tok.value, pos: pos + 1 }

      if (tok.type === 'LPAREN') {
        const inner = parseExpr(tokens, pos + 1)
        if ('error' in inner) return inner
        if (inner.pos >= tokens.length || tokens[inner.pos]!.type !== 'RPAREN')
          return { error: 'ожидается закрывающая скобка' }
        return { val: inner.val, pos: inner.pos + 1 }
      }

      if (tok.type === 'FIELD') {
        const resolved = resolveFieldRef(tok.raw)
        if (resolved === null) return { error: `поле «${tok.raw}» не найдено` }
        const n = parseFloat(resolved.replace(',', '.'))
        if (isNaN(n)) return { error: `значение поля «${tok.raw}» не является числом` }
        return { val: n, pos: pos + 1 }
      }

      if (tok.type === 'FORMULA') {
        const r = evalFormula(tok.raw)
        if (r.error) return { error: r.error }
        const n = typeof r.value === 'number' ? r.value : parseFloat(String(r.value).replace(',', '.'))
        if (isNaN(n)) return { error: `формула «${tok.raw}» не вернула число` }
        return { val: n, pos: pos + 1 }
      }

      return { error: 'неожиданный токен' }
    }

    const tokResult = tokenize(expr)
    if (typeof tokResult === 'string') return { value: null, error: tokResult }
    if (tokResult.length === 0) return { value: null, error: 'пустое выражение' }

    const parsed = parseExpr(tokResult, 0)
    if ('error' in parsed) return { value: null, error: parsed.error }
    if (parsed.pos !== tokResult.length) return { value: null, error: 'неожиданный токен в выражении' }

    return { value: parseFloat(parsed.val.toFixed(2)), error: null }
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
    if (fn === 'calc') return evalCalc(rawArg)

    return evalNumericFormula(fn, rawArg)
  }

  function resolveFormula(val: string): string {
    if (!isFormula(val)) return val
    const { value, error } = evalFormula(val)
    return error ? '' : String(value)
  }

  return { isFormula, evalFormula, resolveFormula }
}
