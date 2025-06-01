import type { Ref } from '@vue/reactivity'
import { ref, toValue } from '@vue/reactivity'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
import block, { BlockType } from './block'
import { size } from './utils/size'

const Position = type(`'start' | 'end' | 'center'`)
export const FlexboxType = type({
  direction: `'row' | 'column'`,
  justify: Position.optional(),
  align: Position.optional(),
  gap: type(`string | number`).optional(),
  wrap: `'nowrap' | 'wrap' | 'wrap-reverse'`,
  grow: `number`,
  shrink: `number`,
  basis: type(`string | number`).optional(),
}).and(BlockType)

export default defineComponent<'flexbox', typeof FlexboxType.infer, { direction: Ref<'row' | 'column'> }>((attrs, context) => {
  const extend = block(attrs, context)
  const direction = ref(toValue(attrs.direction ?? 'row') as string)
  const selfDirection = context.direction.value

  return {
    name: 'flexbox',
    attrs: FlexboxType,
    defaults: {
      direction: 'row',
      wrap: 'nowrap',
      grow: 1,
      shrink: 0,
    },
    setup: (children) => {
      const element = extend.setup!(children) as HTMLDivElement

      element.style.display = 'flex'

      if (selfDirection === 'row')
        element.style.width = '100%'
      if (selfDirection === 'column')
        element.style.height = '100%'
      element.style.flexDirection = toValue(attrs.direction)
      direction.value = toValue(attrs.direction)
      element.style.justifyContent = toValue(attrs.justify ?? 'auto')!
      element.style.alignItems = toValue(attrs.align ?? 'auto')!
      element.style.gap = size(toValue(attrs.gap) ?? 'auto')
      element.style.flexWrap = toValue(attrs.wrap)
      element.style.flexGrow = (toValue(attrs.grow) ?? 1).toString()
      element.style.flexShrink = (toValue(attrs.shrink) ?? 0).toString()
      element.style.flexBasis = size(toValue(attrs.basis) ?? 'auto')
      return element
    },
    provides: {
      direction,
    },
  }
})
