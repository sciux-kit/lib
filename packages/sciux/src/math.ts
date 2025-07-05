import type { Animation, Component } from 'sciux-laplace'
import type { RegisterContext } from './types'
import { angle, angleArcCreation, angleCreation, axis, axisCreation, circle, circleCreation, figure, func, funcCreation, line, lineCreation, parametric, parametricCreation, plane, planeCreation, projectionCreation, tools } from '@sciux/math'
import { withSpace } from 'sciux-laplace'
import { canvasSpace } from './widget'

export default function ({ animations, context }: RegisterContext): void {
  canvasSpace.set('angle', angle)
  canvasSpace.set('line', line)
  canvasSpace.set('figure', figure)
  canvasSpace.set('circle', circle)
  canvasSpace.set('function', func)
  canvasSpace.set('axis', axis)
  canvasSpace.set('plane', withSpace(plane as Component<'plane', any, any>, canvasSpace))
  canvasSpace.set('parametric', parametric)
  const creation = <Animation<[], any, any>[]> animations.get('creation')
  creation.push(angleCreation, angleArcCreation, circleCreation, lineCreation, funcCreation, parametricCreation, axisCreation, planeCreation, projectionCreation)
  Object.assign(context, tools)
}

export * from '@sciux/math'
