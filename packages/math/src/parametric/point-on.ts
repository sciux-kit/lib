import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
import { generateTexNode } from '../utils/tex'

const T = type({
  x: type.number,
  y: type.number,
  as: type.string,
  asMax: type.string,
  asMin: type.string,
  value: type.string,
})

export const pointOn = defineComponent<'point-on', typeof T.infer, {
  expr: (t: number) => [number, number]
}>((attrs, context) => {
      const positions: [number, number][] = []
      if (attrs.x && attrs.y) {
        console.warn('<point-on>: x and y cannot be used together')
      }
      return {
        name: 'point-on',
        attrs: T,
        setup() {
          const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
          container.setAttribute('transform', `translate(${attrs.x.value}, ${attrs.y.value})`)
          const texElement = generateTexNode(attrs.value.value)
          container.append(texElement)
          return container
        },
      }
    })
