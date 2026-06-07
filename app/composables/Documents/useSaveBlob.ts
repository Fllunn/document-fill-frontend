const MIME: Record<string, string> = {
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
}

const DESCRIPTIONS: Record<string, string> = {
  docx: 'Документ Word',
  pdf: 'PDF документ',
}

export const useSaveBlob = () => {
  async function saveBlob(blob: Blob, filename: string, format: string): Promise<boolean> {
    const picker = (window as any).showSaveFilePicker

    if (typeof picker === 'function') {
      try {
        const handle = await picker({
          suggestedName: filename,
          types: [{ description: DESCRIPTIONS[format] ?? 'Файл', accept: { [MIME[format] ?? 'application/octet-stream']: [`.${format}`] } }],
        })
        const writable = await handle.createWritable()
        await writable.write(blob)
        await writable.close()
      } catch (e: any) {
        if (e?.name === 'AbortError') return false
        throw e
      }
      return true
    }

    const url = URL.createObjectURL(blob)

    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.open(url)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      return true
    }

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 100)
    return true
  }

  return { saveBlob }
}
