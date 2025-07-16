import type { ToRefs } from 'sciux-laplace'
import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { defineAnimation, defineComponent } from 'sciux-laplace'
import { LineType } from '../shared'
import { describeArc } from '../utils/arc-path'
import { resolveDasharray } from '../utils/line'
import { edgePoint } from './points'

const T = type({
  x: type.number,
  y: type.number,
  radius: type.number,
  from: type.number,
  to: type.number,
  type: LineType,
})

export const circle = defineComponent<'circle', typeof T.infer, { division: number | undefined }>((attrs, ctx) => {
  const space = new Map()
  space.set('edge-point', edgePoint)
  space.set('origin', origin)
  return {
    name: 'circle',
    attrs: T,
    defaults: {
      from: 0,
      to: 360,
      type: 'solid',
      x: 0,
      y: 0,
    },
    setup() {
      const division = ctx.division ?? 1
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      container.setAttribute('transform', `translate(${attrs.x.value * division}, ${attrs.y.value * division})`)
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.id = 'circle-path'
      container.id = 'canvas-circle'
      path.setAttribute('d', describeArc([0, 0], attrs.radius.value * division, attrs.from.value, attrs.to.value))
      path.setAttribute('stroke', theme.pallete('primary'))
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke-dasharray', resolveDasharray(attrs.type.value))
      container.append(path)
      return container
    },
    space,
  }
})

export const circleCreation = defineAnimation((node: Node, _, { attrs }: { attrs: ToRefs<typeof T.infer> }) => {
  const el = node as HTMLElement
  if (el.id !== 'canvas-circle')
    return
  const path = el.querySelector('#circle-path') as SVGPathElement
  return (progress) => {
    if (progress > 1) {
      return true
    }
    path.setAttribute('d', describeArc([0, 0], attrs.radius.value, attrs.from.value, attrs.from.value + (attrs.to.value - attrs.from.value) * progress))
    return false
  }
})
