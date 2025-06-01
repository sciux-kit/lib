import type { Ref } from '@vue/reactivity'
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
  const input = document.createElement('input')
  if (attrs.model) {
    input.addEventListener('input', (e) => {
      (context[attrs.model!.value!] as Ref<string>).value = (e.target as HTMLInputElement).value
    })
  }
  return {
    name: 'input',
    attrs: T,
    setup: () => {
      input.placeholder = toValue(attrs.placeholder)
      input.disabled = toValue(attrs.disabled)
      return input
    },
  }
})
