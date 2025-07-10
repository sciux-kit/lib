import type { ToRefs } from 'sciux-laplace'
import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { defineAnimation, defineComponent, ref } from 'sciux-laplace'
import { axis } from '../axis'
import { projection } from './projection'

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

export const plane = defineComponent<'plane', typeof T.infer>((attrs) => {
  const space = new Map()
  space.set('projection', projection)
  return {
    space,
    name: 'plane',
    provides: {
      division: attrs.division.value,
    },
    defaults: {
      // division: 20,
      xLabel: (count: number) => count.toString(),
      yLabel: (count: number) => count.toString(),
      xDirection: 'right',
      yDirection: 'top',
      x: 0,
      y: 0,
      domain: [-5, 5],
      range: [-5, 5],
    },
    setup(children) {
      const root = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      root.id = 'canvas-plane'
      root.setAttribute('transform', `translate(${attrs.x.value}, ${attrs.y.value})`)
      // x-axis
      const xAxis = axis({
        x: attrs.x,
        y: attrs.y,
        division: attrs.division,
        range: attrs.domain,
        label: ref((count: number) => count === 0 ? '' : (attrs.xLabel.value as (count: number) => string)(count)),
        direction: attrs.xDirection,
      }, {})
      const xAxisNode = <SVGGElement> xAxis.setup?.(() => [])
      xAxisNode.id = 'canvas-plane-x-axis'
      root.append(xAxisNode)
      // y-axis
      const yAxis = axis({
        x: attrs.x,
        y: attrs.y,
        division: attrs.division,
        range: attrs.range,
        label: ref((count: number) => count === 0 ? '' : (attrs.yLabel.value as (count: number) => string)(count)),
        direction: attrs.yDirection,
      }, {})
      const originLabel = attrs.xLabel ? (attrs.xLabel.value as (count: number) => string)(0) : attrs.yLabel ? (attrs.yLabel.value as (count: number) => string)(0) : ''
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
      grid.id = 'canvas-plane-grid'
      grid.setAttribute('stroke', theme.pallete('primary'))
      grid.setAttribute('stroke-width', '0.5')
      grid.setAttribute('fill', 'none')

      const xGrid = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      xGrid.id = 'canvas-plane-x-grid'
      const yGrid = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      yGrid.id = 'canvas-plane-y-grid'
      for (let i = attrs.domain.value[0]; i < attrs.domain.value[1]; i += 1) {
        if (i === attrs.domain.value[0])
          continue
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', (i * attrs.division.value).toString())
        line.setAttribute('y1', (attrs.range.value[0] * attrs.division.value).toString())
        line.setAttribute('x2', (i * attrs.division.value).toString())
        line.setAttribute('y2', (attrs.range.value[1] * attrs.division.value).toString())
        xGrid.append(line)
      }
      for (let i = attrs.range.value[0]; i < attrs.range.value[1]; i += 1) {
        if (i === attrs.range.value[0])
          continue
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', (attrs.domain.value[0] * attrs.division.value).toString())
        line.setAttribute('y1', (i * attrs.division.value).toString())
        line.setAttribute('x2', (attrs.domain.value[1] * attrs.division.value).toString())
        line.setAttribute('y2', (i * attrs.division.value).toString())
        yGrid.append(line)
      }
      grid.append(xGrid, yGrid)

      // Root
      root.append(origin, grid)
      const yAxisNode = <SVGGElement> yAxis.setup?.(() => [])
      yAxisNode.id = 'canvas-plane-y-axis'
      root.append(yAxisNode)
      root.append(...children())

      return root
    },
  }
})

export const planeCreation = defineAnimation((node: Node, _, { attrs, context }: { attrs: ToRefs<typeof T.infer>, context: { division: number } }) => {
  const el = node as HTMLElement
  if (el.id !== 'canvas-plane')
    return
  const xAxis = el.querySelector('#canvas-plane-x-axis') as SVGGElement
  const yAxis = el.querySelector('#canvas-plane-y-axis') as SVGGElement
  const xAxisLine = xAxis.querySelector('#canvas-axis-line') as SVGLineElement
  const yAxisLine = yAxis.querySelector('#canvas-axis-line') as SVGLineElement
  const xAxisArrow = xAxis.querySelector('#canvas-axis-arrow') as SVGPolygonElement
  const yAxisArrow = yAxis.querySelector('#canvas-axis-arrow') as SVGPolygonElement
  xAxisArrow.setAttribute('fill-opacity', '0')
  yAxisArrow.setAttribute('fill-opacity', '0')
  const xAxisTicks = xAxis.querySelector('#canvas-axis-ticks') as SVGGElement
  const yAxisTicks = yAxis.querySelector('#canvas-axis-ticks') as SVGGElement
  const xGrid = el.querySelector('#canvas-plane-x-grid') as SVGGElement
  const yGrid = el.querySelector('#canvas-plane-y-grid') as SVGGElement
  const xAxisLength = (attrs.domain.value[1] - attrs.domain.value[0]) * (context.division ?? attrs.division.value)
  const yAxisLength = (attrs.range.value[1] - attrs.range.value[0]) * (context.division ?? attrs.division.value)
  const axisArrowRound = 2 * (Math.sqrt(5 * 5 + 7 * 7) + Math.sqrt(5 * 5 + 17 * 17))

  return (progress) => {
    if (progress > 1)
      return true
    xAxisLine.setAttribute('stroke-dasharray', `${xAxisLength * progress},${xAxisLength * (1 - progress)}`)
    yAxisLine.setAttribute('stroke-dasharray', `${yAxisLength * progress},${yAxisLength * (1 - progress)}`)
    if (progress < 0.5) {
      xAxisArrow.setAttribute('stroke-dasharray', `${axisArrowRound * progress * 2},${axisArrowRound * (1 - progress * 2)}`)
      yAxisArrow.setAttribute('stroke-dasharray', `${axisArrowRound * progress * 2},${axisArrowRound * (1 - progress * 2)}`)
    }
    else {
      xAxisArrow.setAttribute('fill-opacity', `${(progress - 0.5) * 2}`)
      yAxisArrow.setAttribute('fill-opacity', `${(progress - 0.5) * 2}`)
    }
    xAxisTicks.setAttribute('stroke-dasharray', `${xAxisLength * progress},${xAxisLength * (1 - progress)}`)
    yAxisTicks.setAttribute('stroke-dasharray', `${yAxisLength * progress},${yAxisLength * (1 - progress)}`)
    xGrid.setAttribute('stroke-dasharray', `${xAxisLength * progress},${xAxisLength * (1 - progress)}`)
    yGrid.setAttribute('stroke-dasharray', `${yAxisLength * progress},${yAxisLength * (1 - progress)}`)
    return false
  }
})

export { projectionCreation } from './projection'
