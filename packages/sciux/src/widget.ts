import type { RegisterContext } from './types'
import { canvas, code, link, table } from '@sciux/widget'
import { TextMode } from 'sciux-laplace'

export default function ({ components, textModes }: RegisterContext): void {
  components.set('table', table)
  components.set('canvas', canvas)
  components.set('link', link)
  components.set('code', code)

  textModes.set('code', TextMode.RCDATA)
}

export * from '@sciux/widget'
