import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

const CanvasType = type({
  width: 'number',
  height: 'number',
  origin: 'number[]',
})

export default defineComponent<'canvas', typeof CanvasType.infer>((attrs) => {
  return {
    name: 'canvas',
    attrs: CanvasType,
    defaults: {
      origin: [0, 0],
    },
    setup(children) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('viewBox', `0 0 ${attrs.width.value} ${attrs.height.value}`)
      svg.setAttribute('width', '100%')
      svg.style.aspectRatio = (attrs.width.value / attrs.height.value).toString()
      const root = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      root.setAttribute('transform', `translate(${attrs.origin.value.join(',')})`)
      root.append(...children())
      svg.append(root)
      return svg
    },
  }
})
