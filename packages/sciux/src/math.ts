import type { RegisterContext } from './types'
import { angle, arc, bounding, endPoint, origin, startPoint } from '@sciux/math'

export default function ({ components }: RegisterContext): void {
  components.set('angle', angle)
  components.set('bounding', bounding)
  components.set('arc', arc)
  components.set('end-point', endPoint)
  components.set('origin', origin)
  components.set('start-point', startPoint)
}

export * from '@sciux/math'
