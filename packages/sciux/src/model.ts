import type { RegisterContext } from './types'
import { button, checkbox, input, slider } from '@sciux/model'

export default function ({ root }: RegisterContext): void {
  root.set('button', button)
  root.set('input', input)
  root.set('slider', slider)
  root.set('checkbox', checkbox)
}

export * from '@sciux/model'
