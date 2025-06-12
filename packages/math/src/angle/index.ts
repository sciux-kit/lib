import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
import { LineType } from '../shared'

const T = type({
  x: 'number',
  y: 'number',
  from: 'number',
  to: 'number',
  startSide: 'number',
  endSide: 'number',
  startSideType: LineType,
  endSideType: LineType,
  startSideValue: type.string.optional(),
  endSideValue: type.string.optional(),
})

export const angle = defineComponent<'angle', typeof T.infer>((attrs) => {
  return {
    name: 'angle',
    attrs: T,
    defaults: {
      startSide: 10,
      endSide: 10,
      startSideType: 'solid',
      endSideType: 'solid',
    },
    setup(_children) {
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      container.setAttribute('transform', `translate(${attrs.x}, ${attrs.y})`)
      const resolve = (value: number, length: number): { x1: number, y1: number, x2: number, y2: number } => {
        const radian = value * Math.PI / 180
        return {
          x1: 0,
          y1: 0,
          x2: length * Math.cos(radian),
          y2: length * Math.sin(radian),
        }
      }
      const resolveDasharray = (type: typeof LineType.infer): string => type === 'dashed' ? '10 5' : type === 'dotted' ? '2 2' : '0'
      const startSide = resolve(attrs.from.value, attrs.startSide.value)
      const endSide = resolve(attrs.to.value, attrs.endSide.value)
      const startSideLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      startSideLine.setAttribute('x1', startSide.x1.toString())
      startSideLine.setAttribute('y1', startSide.y1.toString())
      startSideLine.setAttribute('x2', startSide.x2.toString())
      startSideLine.setAttribute('y2', startSide.y2.toString())
      startSideLine.setAttribute('stroke', 'black')
      startSideLine.setAttribute('stroke-width', '1')
      startSideLine.setAttribute('stroke-dasharray', resolveDasharray(attrs.startSideType.value))
      container.append(startSideLine)
      const endSideLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      endSideLine.setAttribute('x1', endSide.x1.toString())
      endSideLine.setAttribute('y1', endSide.y1.toString())
      endSideLine.setAttribute('x2', endSide.x2.toString())
      endSideLine.setAttribute('y2', endSide.y2.toString())
      endSideLine.setAttribute('stroke', 'black')
      endSideLine.setAttribute('stroke-width', '1')
      endSideLine.setAttribute('stroke-dasharray', resolveDasharray(attrs.endSideType.value))
      return container
    },
    provides: {
      x: attrs.x,
      y: attrs.y,
    },
  }
})
