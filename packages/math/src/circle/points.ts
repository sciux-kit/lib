import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

const EdgePointType = type({
  value: type.number,
  as: type.string,
})

export const edgePoint = defineComponent<
  'edge-points',
  typeof EdgePointType.infer,
  {
    x: number
    y: number
    radius: number
  }
>((attrs, context) => {
  const { x, y, radius } = context
  const { value } = attrs
  const point = [
    x + radius * Math.cos(value.value),
    y + radius * Math.sin(value.value),
  ]
  return {
    name: 'edge-points',
    attrs: EdgePointType,
    globals: (() => {
      if ('as' in attrs) {
        return {
          [attrs.as.value]: point,
        }
      }
    })(),
  }
})

const OriginType = type({
  as: type.string,
})

export const origin = defineComponent<
  'origin',
  typeof OriginType.infer,
  {
    x: number
    y: number
  }
>((attrs, context) => {
  return {
    name: 'origin',
    attrs: OriginType,
    globals: (() => {
      if ('as' in attrs) {
        return {
          [attrs.as.value]: [context.x, context.y],
        }
      }
    })(),
  }
})
