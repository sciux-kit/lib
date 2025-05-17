import { toValue } from '@vue/reactivity'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
import { size } from './utils/size'

const Position = type(`'start' | 'end' | 'center'`)
const T = type({
  direction: `'row' | 'column'`,
  justify: Position,
  align: Position,
  gap: `string | number`,
  wrap: `'nowrap' | 'wrap' | 'wrap-reverse'`,
  grow: `number`,
  shrink: `number`,
  basis: `string | number`,
}).partial()

export default defineComponent<'flexbox', typeof T.infer>((attrs, _context) => {
  return {
    name: 'flexbox',
    attrs: T,
    setup: (children) => {
      const element = document.createElement('div')
      element.style.display = 'flex'
      element.style.flexDirection = toValue(attrs.direction ?? 'row') as string
      element.style.justifyContent = toValue(attrs.justify ?? 'start') as string
      element.style.alignItems = toValue(attrs.align ?? 'start') as string
      element.style.gap = size(toValue(attrs.gap ?? '0') as string)
      element.style.flexWrap = toValue(attrs.wrap ?? 'nowrap') as string
      element.style.flexGrow = toValue(attrs.grow ?? '0') as string
      element.style.flexShrink = toValue(attrs.shrink ?? '0') as string
      element.style.flexBasis = size(toValue(attrs.basis ?? 'auto') as string)
      element.append(...children())
      return element
    },
  }
})
