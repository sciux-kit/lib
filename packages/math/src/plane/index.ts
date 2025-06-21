import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { defineComponent, ref } from 'sciux-laplace'
import { axis } from '../axis'

const T = type({
  x: type.number,
  y: type.number,
  division: type.number,
  domain: type('number[]'),
  range: type('number[]'),
  xLabel: type.unknown,
  yLabel: type.unknown,
  xDirection: type.enumerated('left', 'right'),
  yDirection: type.enumerated('top', 'bottom'),
})
interface withLabelT {
  xLabel: (count: number) => string
  yLabel: (count: number) => string
}

export const plane = defineComponent<'plane', typeof T.infer & withLabelT>((attrs) => {
  return {
    name: 'plane',
    provides: {
      division: attrs.division,
    },
    defaults: {
      division: 20,
      xLabel: (count: number) => count.toString(),
      yLabel: (count: number) => count.toString(),
      xDirection: 'right',
      yDirection: 'top',
    },
    setup(children) {
      const root = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      root.setAttribute('transform', `translate(${attrs.x.value}, ${attrs.y.value})`)
      // x-axis
      const xAxis = axis({
        x: attrs.x,
        y: attrs.y,
        division: attrs.division,
        range: attrs.domain,
        label: ref((count: number) => count === 0 ? '' : attrs.xLabel.value(count)),
        direction: attrs.xDirection,
      }, {})
      root.append(<Node> xAxis.setup?.(() => []))
      // y-axis
      const yAxis = axis({
        x: attrs.x,
        y: attrs.y,
        division: attrs.division,
        range: attrs.range,
        label: ref((count: number) => count === 0 ? '' : attrs.yLabel.value(count)),
        direction: attrs.yDirection,
      }, {})
      const originLabel = attrs.xLabel ? attrs.xLabel.value(0) : attrs.yLabel ? attrs.yLabel.value(0) : ''
      const origin = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      origin.setAttribute('x', (attrs.x.value + 10).toString())
      origin.setAttribute('y', (attrs.y.value + 10).toString())
      origin.style.fill = theme.pallete('primary')
      origin.style.fontFamily = theme.font('math')
      origin.style.fontSize = theme.size('3xs')
      origin.style.textAnchor = 'middle'
      origin.style.dominantBaseline = 'middle'
      origin.textContent = originLabel

      // Grid
      const grid = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      grid.setAttribute('stroke', theme.pallete('primary'))
      grid.setAttribute('stroke-width', '0.5')
      grid.setAttribute('fill', 'none')
      for (let i = attrs.domain.value[0]; i < attrs.domain.value[1]; i += 1) {
        if (i === attrs.domain.value[0])
          continue
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', (i * attrs.division.value).toString())
        line.setAttribute('y1', (attrs.range.value[0] * attrs.division.value).toString())
        line.setAttribute('x2', (i * attrs.division.value).toString())
        line.setAttribute('y2', (attrs.range.value[1] * attrs.division.value).toString())
        grid.append(line)
      }
      for (let i = attrs.range.value[0]; i < attrs.range.value[1]; i += 1) {
        if (i === attrs.range.value[0])
          continue
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', (attrs.domain.value[0] * attrs.division.value).toString())
        line.setAttribute('y1', (i * attrs.division.value).toString())
        line.setAttribute('x2', (attrs.domain.value[1] * attrs.division.value).toString())
        line.setAttribute('y2', (i * attrs.division.value).toString())
        grid.append(line)
      }

      // Root
      root.append(origin, grid)
      root.append(<Node> yAxis.setup?.(() => []))
      root.append(...children())

      return root
    },
  }
})
