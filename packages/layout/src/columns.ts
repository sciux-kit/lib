import type { Ref } from 'sciux-laplace'
import { type } from 'arktype'
import { defineComponent, ref, toValue } from 'sciux-laplace'
import flexbox, { FlexboxType } from './flexbox'

const T = type({

}).partial().and(FlexboxType)

export default defineComponent<'columns', typeof T.infer, { direction: Ref<'row' | 'column'> }>((attrs, context) => {
  const direction = ref(toValue(attrs.direction ?? 'column') as 'row' | 'column')
  return {
    name: 'columns',
    attrs: T,
    setup: (children) => {
      const extend = flexbox(attrs, {
        ...context,
        direction,
      })
      const element = extend.setup!(children) as HTMLDivElement

      element.style.flexDirection = 'column'
      element.style.flexWrap = 'wrap'
      return element
    },
    provides: {
      direction,
    },
  }
})
