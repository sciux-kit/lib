import type { Context } from 'sciux-laplace'

import { toValue } from '@vue/reactivity'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

const T = type({
  model: 'string',
  placeholder: 'string',
  disabled: 'boolean',
})

export default defineComponent<'input', typeof T.infer, Context>((attrs, context) => {
  return {
    name: 'input',
    attrs: T,
    defaults: {
      placeholder: '',
      disabled: false,
    },
    setup: () => {
      const input = document.createElement('input')
      if (attrs.model) {
        input.addEventListener('input', (e) => {
          context[attrs.model!.value!] = (e.target as HTMLInputElement).value
        })
      }
      input.placeholder = toValue(attrs.placeholder)
      input.disabled = toValue(attrs.disabled)
      return input
    },
  }
})
