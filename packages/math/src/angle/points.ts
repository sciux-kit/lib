import { defineComponent } from 'sciux-laplace'
import { InfoPointType } from '../shared'
import { generateTexNode } from '../utils/tex'

export const angleStartPoint = defineComponent<'start-point', typeof InfoPointType.infer, {
  x: number
  y: number
  startSide: number
  from: number
}>((attrs, context) => {
  const position = [
    context.startSide * Math.cos(context.from * Math.PI / 180) + context.x,
    context.startSide * Math.sin(context.from * Math.PI / 180) + context.y,
  ]
  return {
    name: 'start-point',
    attrs: InfoPointType,
    globals: (() => {
      if ('as' in attrs) {
        return {
          [attrs.as.value]: position,
        }
      }
    })(),
    defaults: {
      value: '',
    },
    setup() {
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      container.setAttribute('transform', `translate(${position[0] - context.x}, ${position[1] - context.y})`)
      const texElement = generateTexNode(attrs.value.value)
      container.append(texElement)
      return container
    },
  }
})

export const angleEndPoint = defineComponent<'end-point', typeof InfoPointType.infer, {
  x: number
  y: number
  endSide: number
  to: number
}>((attrs, context) => {
  const position = [
    context.endSide * Math.cos(context.to * Math.PI / 180) + context.x,
    context.endSide * Math.sin(context.to * Math.PI / 180) + context.y,
  ]
  return {
    name: 'end-point',
    attrs: InfoPointType,
    globals: (() => {
      if ('as' in attrs) {
        return {
          [attrs.as.value]: position,
        }
      }
    })(),
    defaults: {
      value: '',
    },
    setup() {
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      container.setAttribute('transform', `translate(${position[0] - context.x}, ${position[1] - context.y})`)
      const texElement = generateTexNode(attrs.value.value)
      container.append(texElement)
      return container
    },
  }
})

export const origin = defineComponent<'origin', typeof InfoPointType.infer, {
  x: number
  y: number
}>((attrs, context) => {
  return {
    name: 'origin',
    attrs: InfoPointType,
    globals: (() => {
      if ('as' in attrs) {
        return {
          [attrs.as.value]: [context.x, context.y],
        }
      }
    })(),
    defaults: {
      value: '',
    },
    setup() {
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      const texElement = generateTexNode(attrs.value.value)
      container.append(texElement)
      return container
    },
  }
})
