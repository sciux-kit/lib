import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
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

export const line = defineComponent<'line', typeof T.infer>((attrs, context) => {
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
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', `M ${attrs.from.value[0]} ${attrs.from.value[1]} L ${attrs.to.value[0]} ${attrs.to.value[1]}`)
      path.setAttribute('stroke', theme.pallete('primary'))
      path.setAttribute('stroke-dasharray', resolveDasharray(attrs.type.value))
      const texElement = generateTexNode(attrs.value?.value)
      const texPosition = [
        attrs.from.value[0] + (attrs.to.value[0] - attrs.from.value[0]) / 2,
        attrs.from.value[1] + (attrs.to.value[1] - attrs.from.value[1]) / 2,
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

export * from './points'
