import { toValue } from '@vue/reactivity'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

export const AlignType = type(`'left' | 'center' | 'right' | 'top' | 'bottom' | 'horizontal' | 'start' | 'end'`)
const T = type({
  type: AlignType,
}).partial()

export default defineComponent<'align', typeof T.infer>(
  (attrs, _context) => {
    return {
      name: 'align',
      attrs: T,
      setup: (children) => {
        const element = document.createElement('div')
        element.style.display = 'flex'
        element.style.alignItems = toValue(attrs.type ?? 'start') as string
        element.append(...children())
        return element
      },
    }
  },
)
