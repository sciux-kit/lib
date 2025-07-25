import type { ToRefs } from 'sciux-laplace'
import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { defineAnimation, defineComponent } from 'sciux-laplace'
import { LineType } from '../shared'
import { resolveDasharray } from '../utils/line'
import { generateTexNode } from '../utils/tex'
import { lineEndPoint, lineStartPoint } from './points'

const T = type({
  from: [type.number, type.number],
  to: [type.number, type.number],
  value: type.string,
  type: LineType,
})

export const line = defineComponent<'line', typeof T.infer, { division: number | undefined }>((attrs, context) => {
  const space = new Map()
  space.set('start-point', lineStartPoint)
  space.set('end-point', lineEndPoint)
  return {
    name: 'line',
    defaults: {
      type: 'solid',
      value: '',
    },
    provides: {
      from: attrs.from.value,
      to: attrs.to.value,
    },
    attrs: T,
    setup(_children) {
      const division = context.division ?? 1
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      container.id = 'canvas-line'

      const pos_from = { x: attrs.from.value[0] * division, y: attrs.from.value[1] * division }
      const pos_to = { x: attrs.to.value[0] * division, y: attrs.to.value[1] * division }

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', `M ${pos_from.x} ${pos_from.y} L ${pos_to.x} ${pos_to.y}`)
      path.id = 'line-path'
      path.setAttribute('stroke', theme.pallete('primary'))
      path.setAttribute('stroke-dasharray', resolveDasharray(attrs.type.value))
      const texElement = generateTexNode(attrs.value?.value)
      const texPosition = [
        pos_from.x + (pos_to.x - pos_from.x) / 2,
        pos_from.y + (pos_to.y - pos_from.y) / 2,
      ]
      const texContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      texContainer.setAttribute('transform', `translate(${texPosition[0]}, ${texPosition[1]})`)
      texContainer.append(texElement)
      container.append(path, texContainer)
      return container
    },
    space,
  }
})

export const lineCreation = defineAnimation((node: Node, _, { attrs }: { attrs: ToRefs<typeof T.infer> }) => {
  const el = node as HTMLElement
  if (el.id !== 'canvas-line')
    return
  const line = el.querySelector('#line-path') as SVGPathElement
  const from = attrs.from.value
  const to = attrs.to.value
  return (progress) => {
    if (!line)
      return true
    if (progress > 1)
      return true
    line.setAttribute('d', `M ${from[0]} ${from[1]} L ${(from[0] + (to[0] - from[0]) * progress)} ${(from[1] + (to[1] - from[1]) * progress)}`)
    return false
  }
})

export * from './points'
