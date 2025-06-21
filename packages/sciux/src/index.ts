import type { RegisterContext } from './types'
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

export * from './layout'
export * from './math'
export * from './model'
export * from './widget'
export * from 'sciux-laplace'
