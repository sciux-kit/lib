import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

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

export const axis = defineComponent<'axis', typeof T.infer & withLabelT>((attrs) => {
  return {
    name: 'axis',
    provides: {
      division: attrs.division,
    },
    defaults: {
      division: 20,
      label: (count: number) => count.toString(),
      direction: 'right',
    },
    setup(children) {
      const resolve = (value: string): 1 | -1 => ['left', 'top'].includes(value) ? -1 : 1
      const root = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      root.setAttribute('transform', `translate(${attrs.x.value}, ${attrs.y.value})`)
      const axes = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      // axis line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute(['left', 'right'].includes(attrs.direction.value) ? 'x1' : 'y1', (attrs.range.value[0] * attrs.division.value * resolve(attrs.direction.value)).toString())
      line.setAttribute(['left', 'right'].includes(attrs.direction.value) ? 'x2' : 'y2', (attrs.range.value[1] * attrs.division.value * resolve(attrs.direction.value)).toString())
      axes.append(line)
      // axis arrow
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      arrow.setAttribute('points', '0,0 -7,5 10,0 -7,-5 0,0')
      arrow.setAttribute('transform', `translate(${['left', 'right'].includes(attrs.direction.value) ? '' : '0,'} ${attrs.range.value[1] * attrs.division.value * resolve(attrs.direction.value)}${['top', 'bottom'].includes(attrs.direction.value) ? '' : ' ,0'})
        rotate(${attrs.direction.value === 'left' ? '180' : attrs.direction.value === 'top' ? '270' : attrs.direction.value === 'bottom' ? '90' : '0'})`)
      axes.append(arrow)
      // axis ticks
      const ticks = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      for (let i = attrs.range.value[0]; i < attrs.range.value[1]; i += 1) {
        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        tick.setAttribute(['left', 'right'].includes(attrs.direction.value) ? 'x1' : 'y1', (i * attrs.division.value * resolve(attrs.direction.value)).toString())
        tick.setAttribute(['left', 'right'].includes(attrs.direction.value) ? 'x2' : 'y2', (i * attrs.division.value * resolve(attrs.direction.value)).toString())
        tick.setAttribute(['left', 'right'].includes(attrs.direction.value) ? 'y1' : 'x1', '-2')
        tick.setAttribute(['left', 'right'].includes(attrs.direction.value) ? 'y2' : 'x2', '2')
        ticks.append(tick)
      }
      axes.append(ticks)
      // axis labels
      const labels = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      labels.setAttribute('stroke', 'none')
      labels.setAttribute('text-anchor', 'middle')
      labels.setAttribute('font-size', '12px')
      labels.style.fontFamily = theme.font('math')
      for (let i = attrs.range.value[0]; i < attrs.range.value[1]; i += 1) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        label.setAttribute(['left', 'right'].includes(attrs.direction.value) ? 'x' : 'y', (i * attrs.division.value * resolve(attrs.direction.value)).toString())
        label.setAttribute(['left', 'right'].includes(attrs.direction.value) ? 'y' : 'x', '16')
        label.textContent = attrs.label.value(i)
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
