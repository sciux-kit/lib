import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
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

export const circle = defineComponent<'circle', typeof T.infer>((attrs) => {
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
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      container.setAttribute('transform', `translate(${attrs.x.value}, ${attrs.y.value})`)
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', describeArc([attrs.x.value, attrs.y.value], attrs.radius.value, attrs.from.value, attrs.to.value))
      path.setAttribute('stroke', theme.pallete('primary'))
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke-dasharray', resolveDasharray(attrs.type.value))
      container.append(path)
      return container
    },
    space,
  }
})
