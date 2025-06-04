import type { Component } from 'sciux-laplace'
import type { RegisterContext } from './types'
import { align, block, columns, flexbox, grid, rows } from '@sciux/layout'

export default function ({ components }: RegisterContext): void {
  components.set('block', block)
  components.set('flexbox', flexbox as Component<string, any, any>)
  components.set('rows', rows as Component<string, any, any>)
  components.set('columns', columns as Component<string, any, any>)
  components.set('grid', grid)
  components.set('align', align)
}

export * from '@sciux/layout'
