import { type } from 'arktype'

export const LineType = type(`'solid' | 'dashed' | 'dotted'`)
export const InfoPointType = type({
  as: type.string,
  value: type.string,
})
