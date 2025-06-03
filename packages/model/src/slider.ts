import type { Ref } from '@vue/reactivity'
import type { Context } from 'sciux-laplace'

import { toValue } from '@vue/reactivity'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

const T = type({
  model: 'string',
  defaultValue: 'number',
  disabled: 'boolean',
})

export default defineComponent<'input', typeof T.infer, Context>((attrs, context) => {
  const input = document.createElement('input')
  input.type = 'range'
  input.min = '0'
  input.max = '1'
  input.step = 'any'
  if (attrs.model) {
    input.addEventListener('input', (e) => {
      (context[attrs.model!.value!] as Ref<number>).value = Number.parseFloat((e.target as HTMLInputElement).value)
    })
  }
  return {
    name: 'input',
    attrs: T,
    setup: () => {
      input.defaultValue = toValue(attrs.defaultValue).toString()
      input.disabled = toValue(attrs.disabled)
      return input
    },
  }
})
