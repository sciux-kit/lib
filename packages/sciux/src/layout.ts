import type { RegisterContext } from './types'
import { align, block, columns, flexbox, grid, rows } from '@sciux/layout'

export default function ({ components }: RegisterContext): void {
  components.set('block', block)
  components.set('flexbox', flexbox)
  components.set('rows', rows)
  components.set('columns', columns)
  components.set('grid', grid)
  components.set('align', align)
}

export * from '@sciux/layout'
