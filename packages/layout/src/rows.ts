import type { Ref } from 'sciux-laplace'
import { type } from 'arktype'
import { defineComponent, ref, toValue } from 'sciux-laplace'
import flexbox, { FlexboxType } from './flexbox'

const T = type({

}).partial().and(FlexboxType)

export default defineComponent<'rows', typeof T.infer, { direction: Ref<'row' | 'column'> }>((attrs, context) => {
  const direction = ref(toValue(attrs.direction ?? 'row') as string)
  return {
    name: 'rows',
    attrs: T,
    setup: (children) => {
      const extend = flexbox(attrs, context)
      const element = extend.setup!(children) as HTMLDivElement

      element.style.flexDirection = 'row'
      element.style.flexWrap = 'wrap'
      return element
    },
    provides: {
      direction,
    },
  }
})
