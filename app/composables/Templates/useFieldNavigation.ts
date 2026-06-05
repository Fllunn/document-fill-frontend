import type { ComputedRef, Ref } from 'vue'

type FieldRef = { focus: () => void; focusEnd: () => void; getInput: () => HTMLElement | null }

export function useFieldNavigation(
  simpleCategories: ComputedRef<Record<string, string[]>>,
  loopCategories: ComputedRef<Record<string, string[]>>,
  loopValues: Ref<Record<string, Record<string, unknown>[]>>,
  addRow: (category: string) => void
) {
  const simpleFieldRefs = new Map<string, FieldRef>()
  const loopFieldRefs = new Map<string, FieldRef>()

  const simpleFieldsList = computed(() =>
    Object.entries(simpleCategories.value).flatMap(([cat, vars]) =>
      vars.map(v => `${cat}.${v}`)
    )
  )

  const allFieldsList = computed(() => {
    const result: string[] = []

    for (const [cat, vars] of Object.entries(simpleCategories.value)) {
      for (const v of vars) {
        result.push(`${cat}.${v}`)
      }
    }

    for (const [cat, vars] of Object.entries(loopCategories.value)) {
      const rows = loopValues.value[cat] ?? []

      for (let r = 0; r < rows.length; r++) {
        for (const v of vars) {
          result.push(`${cat}.${r}.${v}`)
        }
      }
    }

    return result
  })

  function getAllFieldRef(key: string): FieldRef | undefined {
    return simpleFieldRefs.get(key) ?? loopFieldRefs.get(key)
  }

  function getLoopFieldsList(): string[] {
    const result: string[] = []

    for (const [cat, vars] of Object.entries(loopCategories.value)) {
      const rows = loopValues.value[cat] ?? []

      for (let r = 0; r < rows.length; r++) {
        for (const v of vars) {
          result.push(`${cat}.${r}.${v}`)
        }
      }
    }

    return result
  }

  function getVisualRows(keys: string[], refMap: Map<string, FieldRef>): string[][] {
    const THRESHOLD = 10
    const rowMap = new Map<number, Array<{ key: string; left: number }>>()

    for (const key of keys) {
      const input = refMap.get(key)?.getInput()

      if (!input) {
        continue
      }

      const rect = input.getBoundingClientRect()
      let matched = false

      for (const [rowTop, items] of rowMap) {
        if (Math.abs(rowTop - rect.top) < THRESHOLD) {
          items.push({ key, left: rect.left })
          matched = true
          break
        }
      }

      if (!matched) {
        rowMap.set(rect.top, [{ key, left: rect.left }])
      }
    }

    return [...rowMap.entries()]
      .sort(([a], [b]) => a - b)
      .map(([, items]) => items.sort((a, b) => a.left - b.left).map(i => i.key))
  }

  function findInRows(rows: string[][], key: string): [number, number] {
    for (let r = 0; r < rows.length; r++) {
      const c = rows[r]!.indexOf(key)

      if (c !== -1) {
        return [r, c]
      }
    }

    return [-1, -1]
  }

  function focusInRow(rows: string[][], rowIdx: number, colIdx: number, refMap: Map<string, FieldRef>) {
    const row = rows[rowIdx]

    if (!row) {
      return
    }

    refMap.get(row[Math.min(colIdx, row.length - 1)]!)?.focusEnd()
  }

  function onSimpleEnter(category: string, variable: string) {
    const list = simpleFieldsList.value
    const idx = list.indexOf(`${category}.${variable}`)

    if (idx === -1) {
      return
    }

    if (idx < list.length - 1) {
      simpleFieldRefs.get(list[idx + 1]!)?.focus()
      return
    }

    const firstLoopCat = Object.keys(loopCategories.value)[0]

    if (!firstLoopCat) {
      return
    }

    const firstVar = (loopCategories.value[firstLoopCat] ?? [])[0]

    if (firstVar) {
      loopFieldRefs.get(`${firstLoopCat}.0.${firstVar}`)?.focus()
    }
  }

  async function onLoopEnter(category: string, rowIndex: number, variable: string) {
    const vars = loopCategories.value[category] ?? []
    const varIdx = vars.indexOf(variable)

    if (varIdx < vars.length - 1) {
      loopFieldRefs.get(`${category}.${rowIndex}.${vars[varIdx + 1]!}`)?.focus()
      return
    }

    const rows = loopValues.value[category]

    if (!rows) {
      return
    }

    if (rowIndex >= rows.length - 1) {
      addRow(category)
      await nextTick()
    }

    loopFieldRefs.get(`${category}.${rowIndex + 1}.${vars[0]}`)?.focus()
  }

  function onArrowLeft(key: string) {
    const list = allFieldsList.value
    const idx = list.indexOf(key)

    if (idx <= 0) {
      return
    }

    getAllFieldRef(list[idx - 1]!)?.focusEnd()
  }

  function onArrowRight(key: string) {
    const list = allFieldsList.value
    const idx = list.indexOf(key)

    if (idx === -1 || idx >= list.length - 1) {
      return
    }

    getAllFieldRef(list[idx + 1]!)?.focusEnd()
  }

  function onSimpleArrowUp(category: string, variable: string) {
    const key = `${category}.${variable}`
    const rows = getVisualRows(simpleFieldsList.value, simpleFieldRefs)
    const [rowIdx, colIdx] = findInRows(rows, key)

    if (rowIdx <= 0) {
      return
    }

    focusInRow(rows, rowIdx - 1, colIdx, simpleFieldRefs)
  }

  function onSimpleArrowDown(category: string, variable: string) {
    const key = `${category}.${variable}`
    const rows = getVisualRows(simpleFieldsList.value, simpleFieldRefs)
    const [rowIdx, colIdx] = findInRows(rows, key)

    if (rowIdx === -1) {
      return
    }

    if (rowIdx < rows.length - 1) {
      focusInRow(rows, rowIdx + 1, colIdx, simpleFieldRefs)
      return
    }

    const firstLoopCat = Object.keys(loopCategories.value)[0]

    if (!firstLoopCat) {
      return
    }

    const firstVar = (loopCategories.value[firstLoopCat] ?? [])[0]

    if (firstVar) {
      loopFieldRefs.get(`${firstLoopCat}.0.${firstVar}`)?.focusEnd()
    }
  }

  function onLoopArrowUp(category: string, rowIndex: number, variable: string) {
    const key = `${category}.${rowIndex}.${variable}`
    const loopKeys = getLoopFieldsList()
    const rows = getVisualRows(loopKeys, loopFieldRefs)
    const [rowIdx, colIdx] = findInRows(rows, key)

    if (rowIdx === -1) {
      return
    }

    if (rowIdx > 0) {
      focusInRow(rows, rowIdx - 1, colIdx, loopFieldRefs)
      return
    }

    const simpleKeys = simpleFieldsList.value

    if (!simpleKeys.length) {
      return
    }

    const simpleRows = getVisualRows(simpleKeys, simpleFieldRefs)

    if (!simpleRows.length) {
      return
    }

    const lastSimpleRow = simpleRows[simpleRows.length - 1]!
    const currentInput = loopFieldRefs.get(key)?.getInput()

    if (!currentInput) {
      simpleFieldRefs.get(lastSimpleRow[lastSimpleRow.length - 1]!)?.focusEnd()
      return
    }

    const currentLeft = currentInput.getBoundingClientRect().left
    let bestKey = lastSimpleRow[0]!
    let bestDist = Infinity

    for (const sKey of lastSimpleRow) {
      const sInput = simpleFieldRefs.get(sKey)?.getInput()

      if (!sInput) {
        continue
      }

      const dist = Math.abs(sInput.getBoundingClientRect().left - currentLeft)

      if (dist < bestDist) {
        bestDist = dist
        bestKey = sKey
      }
    }

    simpleFieldRefs.get(bestKey)?.focusEnd()
  }

  function onLoopArrowDown(category: string, rowIndex: number, variable: string) {
    const key = `${category}.${rowIndex}.${variable}`
    const loopKeys = getLoopFieldsList()
    const rows = getVisualRows(loopKeys, loopFieldRefs)
    const [rowIdx, colIdx] = findInRows(rows, key)

    if (rowIdx === -1 || rowIdx >= rows.length - 1) {
      return
    }

    focusInRow(rows, rowIdx + 1, colIdx, loopFieldRefs)
  }

  return {
    simpleFieldRefs,
    loopFieldRefs,
    onSimpleEnter,
    onLoopEnter,
    onArrowLeft,
    onArrowRight,
    onSimpleArrowUp,
    onSimpleArrowDown,
    onLoopArrowUp,
    onLoopArrowDown,
  }
}
