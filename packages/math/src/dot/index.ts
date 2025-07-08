import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
import { generateTexNode } from '../utils/tex'

const T = type({
  x: type.number,
  y: type.number,
  label: 'string | undefined',
})

export const dot = defineComponent<'dot', typeof T.infer, { division: number | undefined }>((attrs, context) => {
  return {
    name: 'dot',
    attrs: T,
    defaults: {
      x: 0,
      y: 0,
    },
    setup() {
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      container.setAttribute('transform', `translate(${attrs.x.value * (context.division ?? 1)}, ${attrs.y.value * (context.division ?? 1)})`)

      const dotSvg = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      dotSvg.id = 'dot-circle'
      container.id = 'canvas-dot'
      dotSvg.setAttribute('stroke', 'none')
      dotSvg.setAttribute('fill', theme.pallete('primary'))
      dotSvg.setAttribute('r', '2')

      if (attrs.label.value) {
        const label = generateTexNode(attrs.label.value)
        container.append(label)
      }

      container.appendChild(dotSvg)
      return container
    },
  }
})
