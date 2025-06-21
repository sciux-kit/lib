import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

const CanvasType = type({
  width: 'number',
  height: 'number',
  origin: type('number[]'),
  division: type('number | number[]'),
})

export default defineComponent<'canvas', typeof CanvasType.infer>((attrs) => {
  return {
    name: 'canvas',
    attrs: CanvasType,
    defaults: {
      origin: [0, 0],
      division: 1,
    },
    setup(children) {
      const division = Array.isArray(attrs.division.value) ? attrs.division.value : [attrs.division.value, attrs.division.value]
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('viewBox', `0 0 ${attrs.width.value * division[0]} ${attrs.height.value * division[1]}`)
      svg.setAttribute('width', '100%')
      svg.setAttribute('height', '100%')
      const caculateRatio = (width: number, height: number): number =>
        (width < height ? width / height : height / width) * 100
      if (attrs.width.value > attrs.height.value)
        svg.setAttribute('height', `${caculateRatio(attrs.width.value, attrs.height.value)}%`)
      else svg.setAttribute('width', `${caculateRatio(attrs.width.value, attrs.height.value)}%`)
      const root = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      root.setAttribute('transform', `translate(${attrs.origin.value.join(',')})`)
      root.append(...children())
      svg.append(root)
      return svg
    },
  }
})
