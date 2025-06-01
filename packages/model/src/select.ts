import { type } from 'arktype'

export const SelectType = type({
  model: 'string',
})

export const SelectOptionType = type({
  value: 'string',
  selected: 'boolean',
  disabled: 'boolean',
})
