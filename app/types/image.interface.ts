export interface ImageValue {
  _type: 'image'
  source: string
  format: string
  width: number
  height: number
}

export function isImageValue(v: unknown): v is ImageValue {
  return typeof v === 'object' && v !== null && (v as any)._type === 'image'
}