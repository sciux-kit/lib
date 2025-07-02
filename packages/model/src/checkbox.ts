import type { Context } from 'sciux-laplace'

import { toValue } from '@vue/reactivity'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

const T = type({
  model: 'string',
  disabled: 'boolean',
})

export default defineComponent<'checkbox', typeof T.infer, Context>((attrs, context) => {
  return {
    name: 'checkbox',
    attrs: T,
    setup: () => {
      const input = document.createElement('input')
      input.type = 'checkbox'
      if (attrs.model) {
        input.addEventListener('input', (e) => {
          context[attrs.model!.value!] = (e.target as HTMLInputElement).checked
        })
      }
      input.disabled = toValue(attrs.disabled)
      return input
    },
  }
})
