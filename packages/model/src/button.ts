import type { Context } from 'sciux-laplace'
import { toValue } from '@vue/reactivity'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

const T = type({
  disabled: 'boolean',
}).partial()

export default defineComponent<'button', typeof T.infer, Context>((attrs, _context) => {
  return {
    name: 'button',
    attrs: T,
    setup: (children) => {
      const element = document.createElement('button')
      element.disabled = toValue(attrs.disabled ?? false) as boolean
      element.append(...children())
      return element
    },
  }
})
