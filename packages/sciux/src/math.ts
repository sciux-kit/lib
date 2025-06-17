import { angle, circle, figure, line } from '@sciux/math'
import { canvasSpace } from './widget'

export default function (): void {
  canvasSpace.set('angle', angle)
  canvasSpace.set('line', line)
  canvasSpace.set('figure', figure)
  canvasSpace.set('circle', circle)
}

export * from '@sciux/math'
