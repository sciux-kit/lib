import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
import { LineType } from '../shared'
import { describeArc } from '../utils/arc-path'
import { resolveDasharray } from '../utils/line'

const T = type({
  type: LineType,
  value: type.string.optional(),
})

export const bounding = defineComponent<'bounding', typeof T.infer, {
  x: number
  y: number
  from: number
  to: number
  startSide?: number
  endSide: number
}>((attrs, context) => {
  return {
    name: 'bounding',
    attrs: T,
    defaults: {
      type: 'solid',
    },
    setup() {
      const pathString = describeArc([context.x, context.y], context.startSide ?? context.endSide, context.from, context.to)
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', pathString)
      path.setAttribute('stroke-width', '1')
      path.setAttribute('stroke', 'black')
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke-dasharray', resolveDasharray(attrs.type.value))
      return path
    },
  }
})
