const MIME: Record<string, string> = {
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
}

export const useSaveBlob = () => {
  async function saveBlob(blob: Blob, filename: string, format: string): Promise<void> {
    const picker = (window as any).showSaveFilePicker

    if (typeof picker === 'function') {
      const handle = await picker({
        suggestedName: filename,
        types: [{ description: filename, accept: { [MIME[format] ?? 'application/octet-stream']: [`.${format}`] } }],
      })
      
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      return
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }

  return { saveBlob }
}
