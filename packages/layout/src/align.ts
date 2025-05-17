import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

const T = type({
  type: `'left' | 'center' | 'right' | 'top' | 'bottom' | 'horizontal' | 'start' | 'end'`,
})

export default defineComponent<'align', typeof T.infer>(
  (context, attrs) => {
    return {
      name: 'align',
      attrs: T,
      setup: () => {
        const element = document.createElement('div')
        element.style.display = 'flex'
        element.style.alignItems = attrs.type.value
        return element
      },
      provides: {},
      globals: {},
    }
  },
)
