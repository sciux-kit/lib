import { angle, figure, line } from '@sciux/math'
import { canvasSpace } from './widget'

export default function (): void {
  canvasSpace.set('angle', angle)
  canvasSpace.set('line', line)
  canvasSpace.set('figure', figure)
}

export * from '@sciux/math'
