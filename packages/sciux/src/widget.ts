import type { ComponentSpace } from 'sciux-laplace'
import type { RegisterContext } from './types'
import { canvas, code, link, mermaid, table, tex } from '@sciux/widget'
import { root, TextMode, withSpace } from 'sciux-laplace'

export const canvasSpace: ComponentSpace = new Map()
canvasSpace.set('let', root.get('let')!)

export default function ({ root, textModes }: RegisterContext): void {
  root.set('table', table)
  root.set('canvas', withSpace(canvas, canvasSpace))
  root.set('link', link)
  root.set('code', code)
  root.set('tex', tex)
  root.set('mermaid', mermaid)
  textModes.set('code', TextMode.RCDATA)
  textModes.set('tex', TextMode.RCDATA)
}

export * from '@sciux/widget'
