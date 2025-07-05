import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

const T = type({
  x: type.number,
  as: type.string,
})

export const pointOn = defineComponent<'point-on', typeof T.infer, {
  expr: (x: number) => number
  division?: number
}>((attrs, context) => {
      return {
        name: 'point-on',
        attrs: T,
        globals: {
          [attrs.as.value]: [
            attrs.x.value * (context.division ?? 1),
            context.expr(attrs.x.value) * (context.division ?? 1),
          ],
        },
      }
    })
