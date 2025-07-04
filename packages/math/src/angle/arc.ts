import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { defineAnimation, defineComponent } from 'sciux-laplace'
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
      type: 'solid',
    },
    setup() {
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.id = 'angle-arc'
      path.setAttribute('d', describeArc([0, 0], Math.min(context.startSide ?? 0, context.endSide ?? 0) / 3, context.from, context.to))
      path.setAttribute('stroke', theme.pallete('primary'))
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke-dasharray', resolveDasharray(attrs.type.value))
      const texElement = generateTexNode(attrs.value?.value)
      const length = Math.min(context.startSide ?? 0, context.endSide ?? 0) / 3
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

export const angleArcCreation = defineAnimation((node: Node, _, { context }: {
  context: {
    from: number
    to: number
    startSide: number
    endSide: number
  }
}) => {
  const el = node as HTMLElement
  const path = el.querySelector('#angle-arc') as SVGPathElement
  return {
    validator: name => name === 'arc',
    setup(progress) {
      if (progress > 1) {
        return true
      }
      path.setAttribute('d', describeArc([0, 0], (context.startSide ?? context.endSide) / 3, context.from, context.from - (context.from - context.to) * progress))
      return false
    },
  }
})
