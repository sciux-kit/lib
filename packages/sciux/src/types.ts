import type { animations, ComponentSpace, Context, flows, textModes } from 'sciux-laplace'

export type Flows = typeof flows
export type Animations = typeof animations
export type TextModes = typeof textModes
export interface RegisterContext {
  root: ComponentSpace
  flows: Flows
  animations: Animations
  textModes: TextModes
  context: Context
}
