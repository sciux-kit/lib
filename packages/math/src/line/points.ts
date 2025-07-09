import { defineComponent } from 'sciux-laplace'
import { InfoPointType } from '../shared'
import { generateTexNode } from '../utils/tex'

export const lineStartPoint = defineComponent<'start-point', typeof InfoPointType.infer, {
  from: [number, number]
}>((attrs, context) => {
  return {
    name: 'start-point',
    attrs: InfoPointType,
    defaults: {
      value: '',
    },
    setup() {
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      const texElement = generateTexNode(attrs.value?.value)
      container.setAttribute('transform', `translate(${context.from[0]}, ${context.from[1]})`)
      container.append(texElement)
      return container
    },
    globals: (() => {
      if ('as' in attrs) {
        return {
          [attrs.as.value]: context.from,
        }
      }
    })(),
  }
})

export const lineEndPoint = defineComponent<'end-point', typeof InfoPointType.infer, {
  to: [number, number]
}>((attrs, context) => {
  return {
    name: 'end-point',
    attrs: InfoPointType,
    defaults: {
      value: '',
    },
    setup() {
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      const texElement = generateTexNode(attrs.value?.value)
      container.setAttribute('transform', `translate(${context.to[0]}, ${context.to[1]})`)
      container.append(texElement)
      return container
    },
    globals: (() => {
      if ('as' in attrs) {
        return {
          [attrs.as.value]: context.to,
        }
      }
    })(),
  }
})
