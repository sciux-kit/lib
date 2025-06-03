/**
 * `<table>` component examples
 * ```
 * <table `caption="The table description" align="horizon" :columns="3">
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

const TableAlignType = type.or(HorizonTableType, VerticalTableType)
const TableType = type.and(BaseTableType, TableAlignType).partial()

export default defineComponent<'table', typeof TableType.infer>((attrs, _context) => {
  return {
    name: 'table',
    attrs: TableType,
    setup(children) {
      const container = document.createElement('div')
      container.style.width = '100%'

      const table = document.createElement('table')
      table.style.width = '100%'
      table.style.tableLayout = 'fixed'
      table.style.borderCollapse = 'collapse'

      // 应用 inset 参数到表格的内边距
      const insetValue = toValue(attrs.inset)
      if (insetValue !== undefined) {
        table.style.padding = size(insetValue)
      }

      const caption = toValue(attrs.caption)
      if (caption) {
        const captionElement = document.createElement('h3')
        captionElement.textContent = caption
        captionElement.style.textAlign = 'center'
        captionElement.style.margin = '0 0 1em 0' // 添加底部间距
        container.append(captionElement)
      }

      const align = toValue(attrs.align)
      const childArray = children().filter(child => child.nodeType !== 3)

      if (align === 'horizon' && 'columns' in attrs) {
        const columns = toValue(attrs.columns) ?? 1
        const rows = Math.ceil(childArray.length / columns)

        const tbody = document.createElement('tbody')
        Array.from({ length: rows }).forEach((_, rowIndex) => {
          const tr = document.createElement('tr')
          Array.from({ length: columns }).forEach((_, colIndex) => {
            const td = document.createElement('td')
            td.style.textAlign = 'center'
            td.style.padding = size('sm')
            const childIndex = rowIndex * columns + colIndex
            if (childIndex < childArray.length) {
              td.append(childArray[childIndex])
            }
            tr.append(td)
          })
          tbody.append(tr)
        })
        table.append(tbody)
      }
      else if (align === 'vertical' && 'rows' in attrs) {
        const rows = toValue(attrs.rows) ?? 1
        const columns = Math.ceil(childArray.length / rows)

        const tbody = document.createElement('tbody')
        Array.from({ length: rows }).forEach((_, rowIndex) => {
          const tr = document.createElement('tr')
          Array.from({ length: columns }).forEach((_, colIndex) => {
            const td = document.createElement('td')
            td.style.textAlign = 'center'
            td.style.padding = size('sm')
            const childIndex = rowIndex * columns + colIndex
            if (childIndex < childArray.length) {
              td.append(childArray[childIndex])
            }
            tr.append(td)
          })
          tbody.append(tr)
        })
        table.append(tbody)
      }

      container.append(table)
      return container
    },
  }
})
