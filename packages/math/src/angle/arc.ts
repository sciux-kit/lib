import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
import { LineType } from '../shared'
import { describeArc } from '../utils/arc-path'
import { resolveDasharray } from '../utils/line'

const T = type({
  type: LineType,
  value: type.string.optional(),
})

export const arc = defineComponent<'arc', typeof T.infer, {
  x: number
  y: number
  from: number
  to: number
  startSide: number
  endSide: number
}>((attrs, context) => {
  return {
    name: 'arc',
    attrs: T,
    setup() {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', describeArc([context.x, context.y], (context.startSide ?? context.endSide) / 3, context.from, context.to))
      path.setAttribute('stroke', 'black')
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke-dasharray', resolveDasharray(attrs.type.value))
      return path
    },
  }
})
