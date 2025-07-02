import type { Animation, Component } from 'sciux-laplace'
import type { RegisterContext } from './types'
import { angle, axis, circle, figure, func, funcCreation, line, parametric, parametricCreation, plane } from '@sciux/math'
import { withSpace } from 'sciux-laplace'
import { canvasSpace } from './widget'

export default function ({ animations }: RegisterContext): void {
  canvasSpace.set('angle', angle)
  canvasSpace.set('line', line)
  canvasSpace.set('figure', figure)
  canvasSpace.set('circle', circle)
  canvasSpace.set('function', func)
  canvasSpace.set('axis', axis)
  canvasSpace.set('plane', withSpace(plane as Component<'plane', any, any>, canvasSpace))
  canvasSpace.set('parametric', parametric)
  const creation = <Animation<[], any, any>[]> animations.get('creation')
  creation.push(funcCreation, parametricCreation)
}

export * from '@sciux/math'
