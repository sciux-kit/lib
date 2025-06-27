import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { defineAnimation, defineComponent } from 'sciux-laplace'
import { pointOn } from './point-on'

const T = type({
  domain: type('number[]'),
  division: type.number,
  expr: type.unknown,
})
interface withExprT {
  expr: (x: number) => number
}

export function describeImage(expr: (x: number) => number, domain: number[], division: number): { points: number[][], length: number } {
  let length = 0
  const points = []
  let latestX = domain[0]
  let latestY = expr(latestX)
  for (let x = domain[0]; x <= domain[1]; x += 1 / division) {
    const point = [x * division, expr(x) * division]
    length += Math.sqrt((point[0] - latestX) ** 2 + (point[1] - latestY) ** 2)
    latestX = point[0]
    latestY = point[1]
    points.push(point)
  }
  return {
    points,
    length,
  }
}

export const func = defineComponent<'function', typeof T.infer, {
  division?: number
}>((attrs, context) => {
  const space = new Map()
  space.set('point-on', pointOn)
  return {
    name: 'function',
    // attrs: T,
    defaults: {
      division: 1,
    },
    provides: {
      expr: attrs.expr,
    },
    setup: (children) => {
      const { domain, division, expr } = attrs
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('stroke', theme.pallete('info'))
      path.setAttribute('fill', 'none')
      path.id = 'function-path'
      const { points } = describeImage(expr.value as (x: number) => number, domain.value, context.division ?? division.value)
      path.setAttribute('d', `M ${points.map(([x, y]) => `${x},${y}`).join(' ')}`)
      // console.log(describeImage(expr.value, domain.value, context.division ?? division.value))
      container.append(path, ...children())
      return container
    },
    space,
  }
})

export const funcCreation = defineAnimation<[], typeof T.infer>((node, _, { attrs }) => {
  const { length } = describeImage(attrs.expr.value as (x: number) => number, attrs.domain.value, 25)
  return {
    validator: name => name === 'function',
    setup(progress) {
      if (progress >= 1) {
        return true
      }
      ;(<SVGGElement>node).style.strokeDasharray = `${length * progress},${length * (1 - progress)}`
      return false
    },
  }
})
