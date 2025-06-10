import type { Ref } from '@vue/reactivity'
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
  const input = document.createElement('input')
  input.type = 'radio'
  if (attrs.model) {
    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement
      if (target.checked) {
        (context[attrs.model!.value!] as Ref<string>).value = target.value
      }
    })
  }
  return {
    name: 'radio',
    attrs: T,
    setup: () => {
      input.name = toValue(attrs.group)
      input.value = toValue(attrs.value)
      return input
    },
  }
})
