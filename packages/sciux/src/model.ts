import type { RegisterContext } from './types'
import { button, checkbox, input, radio, select, selectOption, slider } from '@sciux/model'

export default function ({ root }: RegisterContext): void {
  root.set('button', button)
  root.set('input', input)
  root.set('slider', slider)
  root.set('checkbox', checkbox)
  root.set('select', select)
  root.set('option', selectOption)
  root.set('radio', radio)
}

export * from '@sciux/model'
