import type { Animation } from 'sciux-laplace'
import type { RegisterContext } from './types'
import { angle, axis, circle, figure, func, funcCreation, line, plane } from '@sciux/math'
import { withSpace } from 'sciux-laplace'
import { canvasSpace } from './widget'

export default function ({ animations }: RegisterContext): void {
  canvasSpace.set('angle', angle)
  canvasSpace.set('line', line)
  canvasSpace.set('figure', figure)
  canvasSpace.set('circle', circle)
  canvasSpace.set('function', func)
  canvasSpace.set('axis', axis)
  canvasSpace.set('plane', withSpace(plane, canvasSpace))

  const creation = <Animation<[], any, any>[]> animations.get('creation')
  creation.push(funcCreation)
}

export * from '@sciux/math'
