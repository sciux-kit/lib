import type { RegisterContext } from './types'
import { button, checkbox, input, slider } from '@sciux/model'

export default function ({ components }: RegisterContext): void {
  components.set('button', button)
  components.set('input', input)
  components.set('slider', slider)
  components.set('checkbox', checkbox)
}

export * from '@sciux/model'
