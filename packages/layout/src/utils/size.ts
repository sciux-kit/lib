type Size = string | number
export interface SizeTable {
  'full': Size
  'half': Size
  'quarter': Size
  'third': Size
  'sm': Size
  'md': Size
  'lg': Size
  'xl': Size
  '2xl': Size
  '3xl': Size
  '4xl': Size
  '5xl': Size
  '6xl': Size
}

export const sizeTable: SizeTable = {
  'full': '100%',
  'half': '50%',
  'quarter': '25%',
  'third': '33.33%',
  'sm': 15,
  'md': 20,
  'lg': 30,
  'xl': 40,
  '2xl': 50,
  '3xl': 60,
  '4xl': 70,
  '5xl': 80,
  '6xl': 90,
}

export function size(value: string | number, customSizeTable: SizeTable = sizeTable): string {
  if (typeof value === 'number')
    return `${value}px`
  const size = customSizeTable[value as keyof SizeTable]
  if (typeof size === 'number')
    return `${size}px`
  if (typeof size === 'string')
    return size
  return value
}
