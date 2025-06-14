import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
import { LineType } from '../shared'
import { describeArc } from '../utils/arc-path'
import { resolveDasharray } from '../utils/line'
import { generateTexNode } from '../utils/tex'

const T = type({
  type: LineType,
  value: type.string,
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
    defaults: {
      value: '',
    },
    setup() {
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', describeArc([context.x, context.y], (context.startSide ?? context.endSide) / 3, context.from, context.to))
      path.setAttribute('stroke', 'black')
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke-dasharray', resolveDasharray(attrs.type.value))
      const texElement = generateTexNode(attrs.value?.value)
      const length = (context.startSide ?? context.endSide) / 3
      const angle = context.from + (context.to - context.from) / 2
      const position = [
        length * Math.cos(angle * Math.PI / 180),
        length * Math.sin(angle * Math.PI / 180),
      ]
      const texContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      texContainer.setAttribute('transform', `translate(${position[0]}, ${position[1]})`)
      texContainer.append(texElement)
      container.append(path, texContainer)
      return container
    },
  }
})
