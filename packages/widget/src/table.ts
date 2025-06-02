/**
 * `<table>` component examples
 * ```
 * <table caption="The table description" align="horizon" :columns="3">
 *  <link>a link could be a part of item</link>
 *  <canvas></canvas> // A canvas also could
 *  Hello world! // A pure-text node also
 *  // Auto enter to next table line because the max columns is `3`
 *  <each-node-can-be/>
 * </table>
 * ```
 */

import { size } from '@sciux/layout'
import { type } from 'arktype'
import { defineComponent, toValue } from 'sciux-laplace'

const BaseTableType = type({
  caption: 'string',
  inset: 'number',
})
const HorizonTableType = type({
  align: `'horizon'`,
  columns: 'number',
})
const VerticalTableType = type({
  align: `'vertical'`,
  rows: 'number',
})

const TableType = type.merge(BaseTableType, HorizonTableType, VerticalTableType).partial()

export default defineComponent<'table', typeof TableType.infer>((attrs, _context) => {
  return {
    name: 'table',
    attrs: TableType,
    setup(_childrenResolver) {
      const table = document.createElement('table')
      table.style.inset = size(toValue(attrs.inset) ?? 'md')
      // const children = childrenResolver()
      return table
    },
  }
})
