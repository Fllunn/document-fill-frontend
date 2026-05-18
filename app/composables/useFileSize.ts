export const useFileSize = (file: Ref<File | null>) => {
  const fileSize = computed(() => {
    if (!file.value) return ''

    const kb = file.value.size / 1024

    if (kb < 1024) return `${kb.toFixed(1)} КБ`
    
    return `${(kb / 1024).toFixed(1)} МБ`
  })

  return { fileSize }
}
