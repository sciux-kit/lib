import type { Ref } from '@vue/reactivity'
import type { Context } from 'sciux-laplace'

import { toValue } from '@vue/reactivity'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

const T = type({
  model: 'string',
  disabled: 'boolean',
})

export default defineComponent<'input', typeof T.infer, Context>((attrs, context) => {
  const input = document.createElement('input')
  input.type = 'checkbox'
  if (attrs.model) {
    input.addEventListener('input', (e) => {
      (context[attrs.model!.value!] as Ref<boolean>).value = (e.target as HTMLInputElement).checked
    })
  }
  return {
    name: 'input',
    attrs: T,
    setup: () => {
      input.disabled = toValue(attrs.disabled)
      return input
    },
  }
})
