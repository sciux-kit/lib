import type { Component } from 'sciux-laplace'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

export const ControlPointType = type(`'m' | 'l' | 'h' | 'v' | 'c' | 'z' | 's' | 'q' | 't' | 'a'`)
const T = type({
  x: type.number.optional(),
  y: type.number.optional(),
})

export function generateControlPoint(name: typeof ControlPointType.infer): Component<typeof ControlPointType.infer, typeof T.infer, any> | null {
  if (ControlPointType(name) instanceof type.errors) {
    return null
  }
  return defineComponent<typeof ControlPointType.infer, typeof T.infer, {
    path: [string, number, number?][]
  }>((attrs, context) => {
    context.path.push([name, attrs.x?.value ?? attrs.y?.value ?? 0, attrs.y?.value])
    return {
      name,
      attrs: T,
    }
  })
}

const pointSet = ['m', 'l', 'h', 'v', 'c', 'z', 's', 'q', 't', 'a']
export const points = Object.fromEntries(pointSet.map(name => [name, generateControlPoint(name as typeof ControlPointType.infer)]))
