import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
import { pointOn } from './point-on'

const T = type({
  domain: type('number[]'),
  division: type.number,
  expr: type.unknown,
})
interface withExprT {
  expr: (x: number) => number
}

export function describeImage(expr: (x: number) => number, domain: number[], division: number): string {
  const points = []
  for (let x = domain[0]; x <= domain[1]; x += 1 / division) {
    points.push([x * division, expr(x) * division])
  }
  return `M ${points.map(([x, y]) => `${x},${y}`).join(' ')}`
}

export const func = defineComponent<'function', withExprT & typeof T.infer, {
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
      path.setAttribute('d', describeImage(expr.value, domain.value, context.division ?? division.value))
      container.append(path, ...children())
      return container
    },
    space,
  }
})
