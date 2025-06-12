import { toValue } from '@vue/reactivity'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
import { AlignType } from './align'
import { size } from './utils/size'

const T = type({
  columns: `string | number | Array`,
  rows: `string | number | Array`,
  gutter: `string | number`,
  columnGutter: `string | number`,
  rowGutter: `string | number`,
  align: AlignType,
  inset: `string | number`,
})

export default defineComponent<'grid', typeof T.infer>((attrs, _context) => {
  return {
    name: 'grid',
    attrs: T,
    defaults: {
      columns: '1fr',
      rows: '1fr',
      gutter: '0',
      columnGutter: '0',
      rowGutter: '0',
      align: 'start',
      inset: '0',
    },
    setup: (children) => {
      const element = document.createElement('div')
      element.style.display = 'grid'
      element.style.gridTemplateColumns = toValue(attrs.columns) as string
      element.style.gridTemplateRows = toValue(attrs.rows) as string
      element.style.gap = size(toValue(attrs.gutter))
      element.style.columnGap = size(toValue(attrs.columnGutter))
      element.style.rowGap = size(toValue(attrs.rowGutter))
      element.style.justifyContent = toValue(attrs.align) as string
      element.style.inset = size(toValue(attrs.inset))
      element.append(...children())
      return element
    },
  }
})
