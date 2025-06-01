import type { Context } from 'sciux-laplace'
import { toValue } from '@vue/reactivity'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

const T = type({
  disabled: 'boolean',
})

export default defineComponent<'button', typeof T.infer, Context>((attrs, _context) => {
  return {
    name: 'button',
    attrs: T,
    defaults: {
      disabled: false,
    },
    setup: (children) => {
      const element = document.createElement('button')
      element.disabled = toValue(attrs.disabled)
      element.append(...children())
      return element
    },
  }
})
