import type { Context } from 'sciux-laplace'

import { toValue } from '@vue/reactivity'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

const T = type({
  model: 'string',
  value: 'number',
  disabled: 'boolean',
})

export default defineComponent<'slider', typeof T.infer, Context>((attrs, context) => {
  return {
    name: 'slider',
    attrs: T,
    setup: () => {
      const input = document.createElement('input')
      input.type = 'range'
      input.min = '0'
      input.max = '1'
      input.step = 'any'
      if (attrs.model) {
        input.addEventListener('input', (e) => {
          context[attrs.model!.value!] = Number.parseFloat((e.target as HTMLInputElement).value)
        })
      }
      input.defaultValue = toValue(attrs.value).toString()
      input.disabled = toValue(attrs.disabled)
      return input
    },
  }
})
