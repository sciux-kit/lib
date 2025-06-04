import type { animations, components, flows, textModes } from 'sciux-laplace'

export type Components = typeof components
export type Flows = typeof flows
export type Animations = typeof animations
export type TextModes = typeof textModes
export interface RegisterContext {
  components: Components
  flows: Flows
  animations: Animations
  textModes: TextModes
}
