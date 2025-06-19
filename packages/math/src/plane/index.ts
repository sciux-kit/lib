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
        label: attrs.xLabel,
        direction: ref('right'),
      }, {})
      root.append(<Node> xAxis.setup?.(() => []))
      // y-axis
      const yAxis = axis({
        x: attrs.x,
        y: attrs.y,
        division: attrs.division,
        range: attrs.range,
        label: attrs.yLabel,
        direction: ref('top'),
      }, {})
      root.append(<Node> yAxis.setup?.(() => []))
      root.append(...children())

      return root
    },
  }
})
