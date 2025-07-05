import type { ToRefs } from 'sciux-laplace'
import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { defineAnimation, defineComponent } from 'sciux-laplace'
import { generateTexNode } from '../utils/tex'

const T = type({
  x: 'number',
  y: 'number',
  type: '\'horizontal\' | \'vertical\' | \'both\'',
  value: 'string',
})

export const projection = defineComponent<'projection', typeof T.infer, {
  division: number
}>((attrs, context) => {
  return {
    name: 'projection',
    attrs: T,
    defaults: {
      type: 'both',
      value: '',
    },
    setup() {
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      container.id = 'canvas-plane-projection'
      container.setAttribute('transform', `translate(${attrs.x.value * context.division}, ${attrs.y.value * context.division})`)
      if (attrs.type.value === 'horizontal' || attrs.type.value === 'both') {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.id = 'canvas-plane-projection-horizontal-line'
        line.setAttribute('x1', '0')
        line.setAttribute('y1', '0')
        line.setAttribute('x2', '0')
        line.setAttribute('y2', (-context.division * attrs.y.value).toString())
        line.setAttribute('stroke', theme.pallete('info'))
        line.setAttribute('stroke-dasharray', theme.dasharray('dashed'))
        container.append(line)
      }
      if (attrs.type.value === 'vertical' || attrs.type.value === 'both') {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.id = 'canvas-plane-projection-vertical-line'
        line.setAttribute('x1', '0')
        line.setAttribute('y1', '0')
        line.setAttribute('x2', (-context.division * attrs.x.value).toString())
        line.setAttribute('y2', '0')
        line.setAttribute('stroke', theme.pallete('info'))
        line.setAttribute('stroke-dasharray', theme.dasharray('dashed'))
        container.append(line)
      }
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      dot.id = 'canvas-plane-projection-dot'
      dot.setAttribute('r', '3')
      dot.setAttribute('fill', theme.pallete('info'))
      container.append(dot)
      const texContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      texContainer.style.color = theme.pallete('info')
      const tex = generateTexNode(attrs.value.value)
      texContainer.append(tex)
      container.append(texContainer)
      return container
    },
  }
})

export const projectionCreation = defineAnimation((node: Node, _, { attrs, context }: { attrs: ToRefs<typeof T.infer>, context: { division: number } }) => {
  const el = node as HTMLElement
  if (el.id !== 'canvas-plane-projection')
    return
  const horizontalLine = el.querySelector('#canvas-plane-projection-horizontal-line') as SVGLineElement
  const verticalLine = el.querySelector('#canvas-plane-projection-vertical-line') as SVGLineElement
  return (progress) => {
    if (progress > 1)
      return true
    horizontalLine.setAttribute('y2', `${-context.division * attrs.y.value * progress}`)
    verticalLine.setAttribute('x2', `${-context.division * attrs.x.value * progress}`)
    return false
  }
})
