import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { defineAnimation, defineComponent } from 'sciux-laplace'
import { LineType } from '../shared'
import { resolveDasharray } from '../utils/line'
import { generateTexNode } from '../utils/tex'
import { arc } from './arc'
import { bounding } from './bouding'
import { angleEndPoint, angleStartPoint, origin } from './points'

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
  const space = new Map()
  space.set('arc', arc)
  space.set('bounding', bounding)
  space.set('start-point', angleStartPoint)
  space.set('end-point', angleEndPoint)
  space.set('origin', origin)
  return {
    name: 'angle',
    attrs: T,
    defaults: {
      startSide: 10,
      endSide: 10,
      startSideType: 'solid',
      endSideType: 'solid',
    },
    setup(children) {
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      container.id = 'canvas-angle'
      container.setAttribute('transform', `translate(${attrs.x.value}, ${attrs.y.value})`)
      const resolve = (value: number, length: number): { x1: number, y1: number, x2: number, y2: number } => {
        const radian = value * Math.PI / 180
        return {
          x1: 0,
          y1: 0,
          x2: length * Math.cos(radian),
          y2: length * Math.sin(radian),
        }
      }
      const startSide = resolve(attrs.from.value, attrs.startSide.value)
      const endSide = resolve(attrs.to.value, attrs.endSide.value)
      const startSideLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      startSideLine.id = 'angle-start-side'
      startSideLine.setAttribute('x1', startSide.x1.toString())
      startSideLine.setAttribute('y1', startSide.y1.toString())
      startSideLine.setAttribute('x2', startSide.x2.toString())
      startSideLine.setAttribute('y2', startSide.y2.toString())
      startSideLine.setAttribute('stroke', theme.pallete('primary'))
      startSideLine.setAttribute('stroke-width', '1')
      startSideLine.setAttribute('stroke-dasharray', resolveDasharray(attrs.startSideType.value))
      container.append(startSideLine)
      const endSideLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      endSideLine.id = 'angle-end-side'
      endSideLine.setAttribute('x1', endSide.x1.toString())
      endSideLine.setAttribute('y1', endSide.y1.toString())
      endSideLine.setAttribute('x2', endSide.x2.toString())
      endSideLine.setAttribute('y2', endSide.y2.toString())
      endSideLine.setAttribute('stroke', theme.pallete('primary'))
      endSideLine.setAttribute('stroke-width', '1')
      endSideLine.setAttribute('stroke-dasharray', resolveDasharray(attrs.endSideType.value))

      const startSideTexPosition = [
        startSide.x1 + (startSide.x2 - startSide.x1) / 2,
        startSide.y1 + (startSide.y2 - startSide.y1) / 2,
      ]
      const startSideTex = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      startSideTex.setAttribute('transform', `translate(${startSideTexPosition[0]}, ${startSideTexPosition[1]})`)
      startSideTex.append(generateTexNode(attrs.startSideValue?.value ?? ''))
      container.append(startSideTex)

      const endSideTexPosition = [
        endSide.x1 + (endSide.x2 - endSide.x1) / 2,
        endSide.y1 + (endSide.y2 - endSide.y1) / 2,
      ]
      const endSideTex = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      endSideTex.setAttribute('transform', `translate(${endSideTexPosition[0]}, ${endSideTexPosition[1]})`)
      endSideTex.append(generateTexNode(attrs.endSideValue?.value ?? ''))
      container.append(endSideTex)

      container.append(endSideLine)
      container.append(...children())
      return container
    },
    provides: {
      x: attrs.x,
      y: attrs.y,
      from: attrs.from,
      to: attrs.to,
      startSide: attrs.startSide,
      endSide: attrs.endSide,
    },
    space,
  }
})

export const angleCreation = defineAnimation((node: HTMLElement) => {
  if (node.id !== 'canvas-angle')
    return
  const el = node as HTMLElement
  const startSide = el.querySelector('#angle-start-side')
  const endSide = el.querySelector('#angle-end-side')
  const start = [Number(startSide?.getAttribute('x2')), Number(startSide?.getAttribute('y2'))]
  const end = [Number(endSide?.getAttribute('x2')), Number(endSide?.getAttribute('y2'))]
  return (progress) => {
    if (progress > 1) {
      return true
    }
    startSide?.setAttribute('x2', (start[0] * progress).toString())
    startSide?.setAttribute('y2', (start[1] * progress).toString())
    endSide?.setAttribute('x2', (end[0] * progress).toString())
    endSide?.setAttribute('y2', (end[1] * progress).toString())
    return false
  }
})

export { angleArcCreation } from './arc'
