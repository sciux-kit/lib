import { angle, axis, circle, figure, func, line, plane } from '@sciux/math'
import { withSpace } from 'sciux-laplace'
import { canvasSpace } from './widget'

export default function (): void {
  canvasSpace.set('angle', angle)
  canvasSpace.set('line', line)
  canvasSpace.set('figure', figure)
  canvasSpace.set('circle', circle)
  canvasSpace.set('function', func)
  canvasSpace.set('axis', axis)
  canvasSpace.set('plane', withSpace(plane, canvasSpace))
}

export * from '@sciux/math'
