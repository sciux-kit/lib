import type { RegisterContext } from './types'
import { theme } from '@sciux/utils-theme'
import { animations, flows, root, textModes } from 'sciux-laplace'
import layout from './layout'
import math from './math'
import model from './model'
import widget from './widget'

const defaultContext: RegisterContext = {
  root,
  flows,
  animations,
  textModes,
}
const registers = [widget, model, layout, math]
animations.set('creation', [])

export default function (context: RegisterContext = defaultContext): void {
  for (const register of registers) {
    register(context)
  }
}

export function applyTheme(selector: string): void {
  const containers = <HTMLElement[]> Array.from(document.querySelectorAll(selector))
  for (const container of containers) {
    container.style.backgroundColor = theme.pallete('background')
    container.style.color = theme.pallete('primary')
    container.style.fontFamily = theme.font('primary')
  }
}

export * from './layout'
export * from './math'
export * from './model'
export * from './widget'
export * from '@sciux/utils-theme'
export * from 'sciux-laplace'
