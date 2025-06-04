import type { RegisterContext } from './types'
import { animations, components, flows, textModes } from 'sciux-laplace'
import layout from './layout'
import model from './model'
import widget from './widget'

const defaultContext: RegisterContext = {
  components,
  flows,
  animations,
  textModes,
}
const registers = [widget, model, layout]

export default function (context: RegisterContext = defaultContext): void {
  for (const register of registers) {
    register(context)
  }
}

export * from './layout'
export * from './model'
export * from './widget'
export * from 'sciux-laplace'
