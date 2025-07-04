import { defineComponent } from 'sciux-laplace'
import { InfoPointType } from '../shared'

export const angleStartPoint = defineComponent<'start-point', typeof InfoPointType.infer, {
  x: number
  y: number
  startSide: number
  from: number
}>((attrs, context) => {
  return {
    name: 'start-point',
    attrs: InfoPointType,
    globals: {
      [attrs.as.value]: [
        context.startSide * Math.cos(context.from * Math.PI / 180) + context.x,
        context.startSide * Math.sin(context.from * Math.PI / 180) + context.y,
      ],
    },
  }
})

export const angleEndPoint = defineComponent<'end-point', typeof InfoPointType.infer, {
  x: number
  y: number
  endSide: number
  to: number
}>((attrs, context) => {
  return {
    name: 'end-point',
    attrs: InfoPointType,
    globals: {
      [attrs.as.value]: [
        context.endSide * Math.cos(context.to * Math.PI / 180) + context.x,
        context.endSide * Math.sin(context.to * Math.PI / 180) + context.y,
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
    globals: {
      [attrs.as.value]: [context.x, context.y],
    },
  }
})
