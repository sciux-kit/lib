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

export const bounding = defineComponent<'bounding', typeof T.infer, {
  x: number
  y: number
  from: number
  to: number
  startSide?: number
  endSide: number
  division: number | undefined
}>((attrs, context) => {
  return {
    name: 'bounding',
    attrs: T,
    defaults: {
      type: 'solid',
      value: '',
    },
    setup() {
      const division = context.division ?? 1
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      container.id = 'canvas-bounding'
      const pathString = describeArc([0, 0], (context.startSide ?? context.endSide) * division, context.from, context.to)
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', pathString)
      path.setAttribute('stroke-width', '1')
      path.setAttribute('stroke', theme.pallete('primary'))
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke-dasharray', resolveDasharray(attrs.type.value))
      const texElement = generateTexNode(attrs.value?.value)
      const length = (context.startSide ?? context.endSide) * division
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

export const boundingCreation = defineAnimation((node: Node, _, { context }: { context: {
  x: number
  y: number
  from: number
  to: number
  startSide?: number
  endSide: number
} }) => {
  const el = node as HTMLElement
  if (el.id !== 'canvas-bounding')
    return
  const path = el.querySelector('#canvas-bounding-path') as SVGPathElement
  return (progress) => {
    if (progress > 1)
      return true
    path.setAttribute('d', describeArc([0, 0], Math.min(context.startSide ?? 0, context.endSide ?? 0), context.from, context.from - (context.from - context.to) * progress))
    return false
  }
})
