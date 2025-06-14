import { defineComponent } from 'sciux-laplace'
import { InfoPointType } from '../shared'

export const startPoint = defineComponent<'start-point', typeof InfoPointType.infer, {
  x: number
  y: number
  startSide: number
  from: number
}>((attrs, context) => {
  return {
    name: 'start-point',
    attrs: InfoPointType,
    provides: {
      [attrs.as.value]: [
        context.startSide * Math.cos(context.from * Math.PI / 180),
        context.startSide * Math.sin(context.from * Math.PI / 180),
      ],
    },
  }
})

export const endPoint = defineComponent<'end-point', typeof InfoPointType.infer, {
  x: number
  y: number
  endSide: number
  to: number
}>((attrs, context) => {
  return {
    name: 'end-point',
    attrs: InfoPointType,
    provides: {
      [attrs.as.value]: [
        context.endSide * Math.cos(context.to * Math.PI / 180),
        context.endSide * Math.sin(context.to * Math.PI / 180),
      ],
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
    provides: {
      [attrs.as.value]: [context.x, context.y],
    },
  }
})
