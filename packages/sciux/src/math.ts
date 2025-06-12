import type { RegisterContext } from './types'
import { angle } from '@sciux/math'

export default function ({ components }: RegisterContext): void {
  components.set('angle', angle)
}

export * from '@sciux/math'
