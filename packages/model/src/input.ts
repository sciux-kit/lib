import { type Context, defineComponent } from 'sciux-laplace'

import { toValue } from '@vue/reactivity'
import { type } from 'arktype'

const T = type({
  model: 'string',
  placeholder: 'string',
  disabled: 'boolean',
}).partial()

export default defineComponent<'input', typeof T.infer, Context>((attrs, context) => {
  const input = document.createElement('input')
  if (attrs.model) {
    input.addEventListener('input', (e) => {
      context[attrs.model!.value!] = (e.target as HTMLInputElement).value
    })
  }
  return {
    name: 'input',
    attrs: T,
    setup: () => {
      input.placeholder = toValue(attrs.placeholder ?? '') as string
      input.disabled = toValue(attrs.disabled ?? false) as boolean
      return input
    },
  }
})
