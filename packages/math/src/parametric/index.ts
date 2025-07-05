import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { defineAnimation, defineComponent } from 'sciux-laplace'

const T = type({
  domain: type('number[]'),
  range: type('number[]'),
  division: type.number,
  expr: type.unknown,
})

function describeImage(
  expr: (t: number) => [number, number],
  domain: number[],
  range: number[],
  division: number,
): { points: number[][], length: number } {
  const [tMin, tMax] = domain
  const step = (tMax - tMin) / division

  const points: number[][] = []
  let length = 0
  let lastPoint: number[] | null = null

  for (let i = 0; i <= division; i += 1 / division) {
    const t = tMin + i * step
    const [x, y] = expr(t)
    const scaledPoint = [x * division, y * division]

    if (lastPoint !== null) {
      const dx = scaledPoint[0] - lastPoint[0]
      const dy = scaledPoint[1] - lastPoint[1]
      length += Math.sqrt(dx * dx + dy * dy)
    }

    points.push(scaledPoint)
    lastPoint = scaledPoint
  }

  return {
    points,
    length,
  }
}

export const parametric = defineComponent<'parametric', typeof T.infer, {
  division: number
}>((attrs, context) => {
  return {
    name: 'parametric',
    attrs: T,
    defaults: {
      division: 25,
      domain: [-5, 5],
      range: [-5, 5],
    },
    setup(children) {
      const { domain, range, expr, division } = attrs
      const { points } = describeImage(expr.value as (t: number) => [number, number], domain.value, range.value, context.division ?? division.value)
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      container.id = 'canvas-parametric'
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('stroke', theme.pallete('primary'))
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke-width', '2')
      path.id = 'parametric-path'
      path.setAttribute('d', `M ${points.map(([x, y]) => `${x},${y}`).join(' ')}`)
      container.append(path, ...children())
      return container
    },
    provides: {
      expr: attrs.expr,
      division: context.division ?? attrs.division,
    },
  }
})

export const parametricCreation = defineAnimation<[], typeof T.infer>((node, _, { attrs }) => {
  const el = node as HTMLElement
  if (el.id !== 'canvas-parametric')
    return
  const { length } = describeImage(attrs.expr.value as (t: number) => [number, number], attrs.domain.value, attrs.range.value, 25)
  return (progress) => {
    if (progress >= 1) {
      return true
    }
    ; (<SVGGElement>node).style.strokeDasharray = `${length * progress},${length * (1 - progress)}`
    return false
  }
})
