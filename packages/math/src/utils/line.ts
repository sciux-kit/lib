import type { LineType } from '../shared'

export const resolveDasharray = (type: typeof LineType.infer): string => type === 'dashed' ? '10 5' : type === 'dotted' ? '2 2' : '0'
