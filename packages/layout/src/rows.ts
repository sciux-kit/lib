import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
import flexbox, { FlexboxType } from './flexbox'

const T = type({

}).partial().and(FlexboxType)

export default defineComponent<'rows', typeof T.infer>((attrs, _context) => {
  return {
    name: 'rows',
    attrs: T,
    setup: (children) => {
      const extend = flexbox(attrs, _context)
      const element = extend.setup!(children) as HTMLDivElement

      element.style.flexDirection = 'row'
      element.style.flexWrap = 'wrap'
      return element
    },
  }
})
