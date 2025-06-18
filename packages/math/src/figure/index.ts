import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
import { points } from './points'

const T = type({
  x: type.number,
  y: type.number,
  path: type.string.optional(),
})

export const figure = defineComponent<'figure', typeof T.infer>((attrs) => {
  const path: [string, number, number?][] = []
  const space = new Map()
  Object.entries(points).forEach(([name, component]) => {
    space.set(name, component)
  })
  return {
    name: 'figure',
    attrs: T,
    defaults: {
      x: 0,
      y: 0,
    },
    setup(children) {
      const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      children()
      if (attrs.path?.value) {
        pathElement.setAttribute('d', attrs.path.value)
      }
      else {
        pathElement.setAttribute('d', path.map(([name, x, y]) => `${name}${x} ${y}`).join(' '))
      }
      pathElement.setAttribute('stroke', theme.pallete('primary'))
      pathElement.setAttribute('fill', 'none')
      container.setAttribute('transform', `translate(${attrs.x.value}, ${attrs.y.value})`)
      container.append(pathElement)
      return container
    },
    provides: {
      path,
    },
    space,
  }
})
