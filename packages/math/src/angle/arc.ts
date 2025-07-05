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
      container.id = 'canvas-angle-arc'
      const angleValue = Math.abs((context.to - context.from + 360) % 360)
      const isRightAngle = Math.abs(angleValue - 90) < 1e-2
      if (isRightAngle) {
        const length = Math.min(context.startSide ?? 0, context.endSide ?? 0) / 3
        const radFrom = context.from * Math.PI / 180
        const radTo = context.to * Math.PI / 180
        const p1 = [length * Math.cos(radFrom), length * Math.sin(radFrom)]
        const p2 = [length * Math.cos(radTo), length * Math.sin(radTo)]
        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line1.setAttribute('x1', '0')
        line1.setAttribute('y1', '0')
        line1.setAttribute('x2', p1[0].toString())
        line1.setAttribute('y2', p1[1].toString())
        line1.setAttribute('stroke', theme.pallete('primary'))
        line1.setAttribute('stroke-width', '1')
        line1.setAttribute('stroke-dasharray', resolveDasharray(attrs.type.value))
        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line2.setAttribute('x1', '0')
        line2.setAttribute('y1', '0')
        line2.setAttribute('x2', p2[0].toString())
        line2.setAttribute('y2', p2[1].toString())
        line2.setAttribute('stroke', theme.pallete('primary'))
        line2.setAttribute('stroke-width', '1')
        line2.setAttribute('stroke-dasharray', resolveDasharray(attrs.type.value))
        const l1 = [length * 0.6 * Math.cos(radFrom), length * 0.6 * Math.sin(radFrom)]
        const l2 = [length * 0.6 * Math.cos(radTo), length * 0.6 * Math.sin(radTo)]
        const l3 = [l1[0] + (l2[0]), l1[1] + (l2[1])]
        const lPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        lPath.setAttribute('d', `M ${l1[0]} ${l1[1]} L ${l3[0]} ${l3[1]} L ${l2[0]} ${l2[1]}`)
        lPath.setAttribute('stroke', theme.pallete('primary'))
        lPath.setAttribute('fill', 'none')
        lPath.setAttribute('stroke-width', '1')
        lPath.setAttribute('stroke-dasharray', resolveDasharray(attrs.type.value))
        const texElement = generateTexNode(attrs.value?.value)
        const labelPos = [
          (l1[0] + l2[0] + l3[0]) / 3,
          (l1[1] + l2[1] + l3[1]) / 3,
        ]
        const texContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        texContainer.setAttribute('transform', `translate(${labelPos[0]}, ${labelPos[1]})`)
        texContainer.append(texElement)
        container.append(line1)
        container.append(line2)
        container.append(lPath)
        container.append(texContainer)
        return container
      }
      else {
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
      }
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
  if (el.id !== 'canvas-angle-arc')
    return
  const path = el.querySelector('#angle-arc') as SVGPathElement
  return (progress) => {
    if (progress > 1) {
      return true
    }
    path.setAttribute('d', describeArc([0, 0], Math.min(context.startSide ?? 0, context.endSide ?? 0) / 3, context.from, context.from - (context.from - context.to) * progress))
    return false
  }
})
