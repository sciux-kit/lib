import { angle, line } from '@sciux/math'
import { canvasSpace } from './widget'

export default function (): void {
  canvasSpace.set('angle', angle)
  canvasSpace.set('line', line)
}

export * from '@sciux/math'
