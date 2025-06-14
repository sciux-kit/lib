import type { RegisterContext } from './types'
import { canvas, code, link, table, tex } from '@sciux/widget'
import { TextMode } from 'sciux-laplace'

export default function ({ components, textModes }: RegisterContext): void {
  components.set('table', table)
  components.set('canvas', canvas)
  components.set('link', link)
  components.set('code', code)
  components.set('tex', tex)
  textModes.set('code', TextMode.RCDATA)
  textModes.set('tex', TextMode.RCDATA)
}

export * from '@sciux/widget'
