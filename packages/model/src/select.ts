import { type } from "arktype"

const SelectType = type({
  model: 'string',
}).partial()

const SelectOptionType = type({
  value: 'string',
  selected: 'boolean',
  disabled: 'boolean',
}).partial()
