import type { RegisterContext } from './types'
import { align, block, columns, flexbox, grid, rows } from '@sciux/layout'

export default function ({ root }: RegisterContext): void {
  root.set('align', align)
  root.set('block', block)
  root.set('flexbox', flexbox)
  root.set('rows', rows)
  root.set('columns', columns)
  root.set('grid', grid)
}

export * from '@sciux/layout'
