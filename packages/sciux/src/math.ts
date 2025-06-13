import type { RegisterContext } from './types'
import { angle, arc, bounding } from '@sciux/math'

export default function ({ components }: RegisterContext): void {
  components.set('angle', angle)
  components.set('bounding', bounding)
  components.set('arc', arc)
}

export * from '@sciux/math'
