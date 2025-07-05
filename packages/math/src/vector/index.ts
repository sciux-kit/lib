import type { ToRefs } from 'sciux-laplace'
import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { defineAnimation, defineComponent } from 'sciux-laplace'

const T = type({
  from: 'number[]',
  to: 'number[]',
})

export const vector = defineComponent<'vector', typeof T.infer, {
  division: number
}>((attrs, context) => {
  return {
    name: 'vector',
    attrs: T,
    setup() {
      const division = context.division ?? 1
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      container.id = 'canvas-vector'
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.id = 'canvas-vector-line'
      line.setAttribute('x1', (attrs.from.value[0] * division).toString())
      line.setAttribute('y1', (attrs.from.value[1] * division).toString())
      line.setAttribute('x2', (attrs.to.value[0] * division).toString())
      line.setAttribute('y2', (attrs.to.value[1] * division).toString())
      line.setAttribute('stroke', theme.pallete('primary'))
      line.setAttribute('stroke-dasharray', theme.dasharray('dashed'))
      container.append(line)

      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      arrow.id = 'canvas-vector-arrow'
      arrow.setAttribute('points', '-7,5 10,0 -7,-5 0,0')
      arrow.setAttribute('fill', theme.pallete('primary'))
      arrow.setAttribute('stroke', theme.pallete('primary'))
      arrow.setAttribute('transform', `translate(${attrs.to.value[0] * division - Math.cos(Math.atan2(attrs.to.value[1] - attrs.from.value[1], attrs.to.value[0] - attrs.from.value[0])) * 10}, ${attrs.to.value[1] * division - Math.sin(Math.atan2(attrs.to.value[1] - attrs.from.value[1], attrs.to.value[0] - attrs.from.value[0])) * 10})
        rotate(${Math.atan2(attrs.to.value[1] - attrs.from.value[1], attrs.to.value[0] - attrs.from.value[0]) * 180 / Math.PI})`)
      container.append(arrow)

      return container
    },
  }
})

export const vectorCreation = defineAnimation((node: Node, _, { attrs, context }: { attrs: ToRefs<typeof T.infer>, context: { division: number } }) => {
  const el = node as HTMLElement
  if (el.id !== 'canvas-vector')
    return
  const line = el.querySelector('#canvas-vector-line') as SVGLineElement
  const arrow = el.querySelector('#canvas-vector-arrow') as SVGPolygonElement
  arrow.setAttribute('fill-opacity', '0')
  const arrowRound = 2 * (Math.sqrt(5 * 5 + 7 * 7) + Math.sqrt(5 * 5 + 17 * 17))
  return (progress) => {
    if (progress > 1)
      return true
    line.setAttribute('x2', (attrs.to.value[0] * context.division * progress).toString())
    line.setAttribute('y2', (attrs.to.value[1] * context.division * progress).toString())
    arrow.setAttribute('transform', `translate(${attrs.to.value[0] * context.division * progress - Math.cos(Math.atan2(attrs.to.value[1] - attrs.from.value[1], attrs.to.value[0] - attrs.from.value[0])) * 10}, ${attrs.to.value[1] * context.division * progress - Math.sin(Math.atan2(attrs.to.value[1] - attrs.from.value[1], attrs.to.value[0] - attrs.from.value[0])) * 10})
      rotate(${Math.atan2(attrs.to.value[1] - attrs.from.value[1], attrs.to.value[0] - attrs.from.value[0]) * 180 / Math.PI})`)
    if (progress < 0.5) {
      arrow.setAttribute('stroke-dasharray', `${arrowRound * (progress * 2)},${arrowRound * (1 - progress * 2)}`)
    }
    else {
      arrow.setAttribute('fill-opacity', `${(progress - 0.5) * 2}`)
    }
    return false
  }
})
