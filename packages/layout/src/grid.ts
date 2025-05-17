import { toValue } from '@vue/reactivity'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
import { AlignType } from './align'
import { size } from './utils/size'

const T = type({
  'columns': `string | number | Array`,
  'rows': `string | number | Array`,
  'gutter': `string | number`,
  'column-gutter': `string | number`,
  'row-gutter': `string | number`,
  'align': AlignType,
  'inset': `string | number`,
}).partial()

export default defineComponent<'grid', typeof T.infer>((attrs, _context) => {
  return {
    name: 'grid',
    attrs: T,
    setup: (children) => {
      const element = document.createElement('div')
      element.style.display = 'grid'
      element.style.gridTemplateColumns = toValue(attrs.columns ?? '') as string
      element.style.gridTemplateRows = toValue(attrs.rows ?? '') as string
      element.style.gap = size(toValue(attrs.gutter ?? '0') as string)
      element.style.columnGap = size(toValue(attrs['column-gutter'] ?? '0') as string)
      element.style.rowGap = size(toValue(attrs['row-gutter'] ?? '0') as string)
      element.style.justifyContent = toValue(attrs.align ?? 'start') as string
      element.style.inset = size(toValue(attrs.inset ?? '0') as string)
      element.append(...children())
      return element
    },
  }
})
