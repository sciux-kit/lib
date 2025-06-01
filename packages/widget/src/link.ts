import { type } from 'arktype'
import { defineComponent, toValue } from 'sciux-laplace'

const T = type({
  target: 'string',
})

export default defineComponent<'link', typeof T.infer>((attrs, _context) => {
  return {
    name: 'link',
    attrs: T,
    defaults: {
      target: '_blank',
    },
    setup(children) {
      const element = document.createElement('a')
      element.href = toValue(attrs.target)
      element.append(...children())
      return element
    },
  }
})
