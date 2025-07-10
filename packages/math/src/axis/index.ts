import type { ToRefs } from 'sciux-laplace'
import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { defineAnimation, defineComponent } from 'sciux-laplace'

const T = type({
  x: type.number,
  y: type.number,
  division: type.number,
  range: type('number[]'),
  label: type.unknown,
  direction: type.enumerated('top', 'bottom', 'left', 'right'),
})
interface withLabelT {
  label: (count: number) => string
}

export const resolveDirection = (value: string): 1 | -1 => ['left', 'top'].includes(value) ? -1 : 1

export const axis = defineComponent<'axis', typeof T.infer>((attrs) => {
  return {
    name: 'axis',
    provides: {
      division: attrs.division,
    },
    defaults: {
      // division: 20,
      label: (count: number) => count.toString(),
      direction: 'right',
      x: 0,
      y: 0,
      range: [-5, 5],
    },
    setup(children) {
      const root = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      root.id = 'canvas-axis'
      root.setAttribute('transform', `translate(${attrs.x.value}, ${attrs.y.value})`)
      const axes = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      // axis line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.id = 'canvas-axis-line'
      line.setAttribute(['left', 'right'].includes(attrs.direction.value) ? 'x1' : 'y1', (attrs.range.value[0] * attrs.division.value * resolveDirection(attrs.direction.value)).toString())
      line.setAttribute(['left', 'right'].includes(attrs.direction.value) ? 'x2' : 'y2', (attrs.range.value[1] * attrs.division.value * resolveDirection(attrs.direction.value)).toString())
      axes.append(line)
      // axis arrow
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      arrow.id = 'canvas-axis-arrow'
      arrow.setAttribute('points', '-7,5 10,0 -7,-5 0,0')
      arrow.setAttribute('transform', `translate(${['left', 'right'].includes(attrs.direction.value) ? '' : '0,'} ${attrs.range.value[1] * attrs.division.value * resolveDirection(attrs.direction.value)}${['top', 'bottom'].includes(attrs.direction.value) ? '' : ' ,0'})
        rotate(${attrs.direction.value === 'left' ? '180' : attrs.direction.value === 'top' ? '270' : attrs.direction.value === 'bottom' ? '90' : '0'})`)
      arrow.setAttribute('stroke', theme.pallete('primary'))
      arrow.setAttribute('fill', theme.pallete('primary'))
      axes.append(arrow)
      // axis ticks
      const ticks = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      ticks.id = 'canvas-axis-ticks'
      for (let i = attrs.range.value[0]; i < attrs.range.value[1]; i += 1) {
        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        tick.setAttribute(['left', 'right'].includes(attrs.direction.value) ? 'x1' : 'y1', (i * attrs.division.value * resolveDirection(attrs.direction.value)).toString())
        tick.setAttribute(['left', 'right'].includes(attrs.direction.value) ? 'x2' : 'y2', (i * attrs.division.value * resolveDirection(attrs.direction.value)).toString())
        tick.setAttribute(['left', 'right'].includes(attrs.direction.value) ? 'y1' : 'x1', '-2')
        tick.setAttribute(['left', 'right'].includes(attrs.direction.value) ? 'y2' : 'x2', '2')
        ticks.append(tick)
      }
      axes.append(ticks)
      // axis labels
      const labels = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      labels.setAttribute('stroke', 'none')
      labels.setAttribute('text-anchor', 'middle')
      labels.setAttribute('dominant-baseline', 'middle')
      labels.setAttribute('font-size', theme.size('3xs'))
      labels.style.fontFamily = theme.font('math')
      for (let i = attrs.range.value[0]; i < attrs.range.value[1]; i += 1) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        label.setAttribute(['left', 'right'].includes(attrs.direction.value) ? 'x' : 'y', (i * attrs.division.value * resolveDirection(attrs.direction.value)).toString())
        label.setAttribute(['left', 'right'].includes(attrs.direction.value) ? 'y' : 'x', '16')
        label.textContent = (attrs.label.value as (count: number) => string)(i)
        labels.append(label)
      }
      axes.append(labels)

      axes.setAttribute('fill', theme.pallete('primary'))
      axes.setAttribute('stroke', theme.pallete('primary'))
      root.append(axes, ...children())

      return root
    },
  }
})

export const axisCreation = defineAnimation((node: Node, _, { attrs, context }: { attrs: ToRefs<typeof T.infer>, context: { division: number } }) => {
  const el = node as HTMLElement
  if (el.id !== 'canvas-axis')
    return
  const line = el.querySelector('#canvas-axis-line') as SVGLineElement
  const arrow = el.querySelector('#canvas-axis-arrow') as SVGPolygonElement
  const ticks = el.querySelector('#canvas-axis-ticks') as SVGGElement
  const length = (attrs.range.value[1] - attrs.range.value[0]) * (context.division ?? attrs.division.value)
  const height = 4
  const arrowRound = 2 * (Math.sqrt(5 * 5 + 7 * 7) + Math.sqrt(5 * 5 + 17 * 17))
  arrow.setAttribute('fill-opacity', '0')

  return (progress) => {
    if (progress > 1)
      return true
    line.setAttribute('stroke-dasharray', `${length * progress},${length * (1 - progress)}`)
    ticks.setAttribute('stroke-dasharray', `${height * progress},${height * (1 - progress)}`)
    if (progress < 0.5) {
      arrow.setAttribute('stroke-dasharray', `${arrowRound * (progress * 2)},${arrowRound * (1 - progress * 2)}`)
    }
    else {
      arrow.setAttribute('fill-opacity', `${(progress - 0.5) * 2}`)
    }
    return false
  }
})
