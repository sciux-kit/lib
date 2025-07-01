import type { Context } from 'sciux-laplace'

import { toValue } from '@vue/reactivity'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

const T = type({
  model: 'string',
  group: 'string',
  value: 'string',
})

export default defineComponent<'radio', typeof T.infer, Context>((attrs, context) => {
  return {
    name: 'radio',
    attrs: T,
    setup: () => {
      const input = document.createElement('input')
      input.type = 'radio'
      input.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement
        context[attrs.model!.value!] = target.checked
      })
      input.name = toValue(attrs.group)
      input.value = toValue(attrs.value)
      return input
    },
  }
})
