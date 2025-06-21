import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

const T = type({
  x: type.number,
  as: type.string,
})

export const pointOn = defineComponent<'point-on', typeof T.infer, {
  expr: (x: number) => number
}>((attrs, context) => {
      return {
        name: 'point-on',
        attrs: T,
        globals: {
          [attrs.as.value]: context.expr(attrs.x.value),
        },
      }
    })
