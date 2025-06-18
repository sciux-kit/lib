import { theme } from '@sciux/utils-theme'
import { type } from 'arktype'
import { renderToString } from 'katex'
import { defineComponent } from 'sciux-laplace'

const T = type({
  size: type.string,
})

export default defineComponent<'tex', typeof T.infer, {
  underCanvas: boolean
}>((_attrs, context) => {
  return {
    name: 'tex',
    attrs: T,
    setup(children) {
      const content = children()[0].textContent ?? ''
      const html = renderToString(content, {
        throwOnError: false,
        displayMode: false,
        output: 'mathml',
      })
      let container: HTMLDivElement | SVGForeignObjectElement
      if (context.underCanvas) {
        container = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
        container.setAttribute('width', '100%')
        container.setAttribute('height', '100%')
        const subContainer = document.createElement('div')
        subContainer.style.color = theme.pallete('note')
        subContainer.innerHTML = html
        container.append(subContainer)
      }
      else {
        container = document.createElement('div')
        container.style.color = theme.pallete('primary')
        container.innerHTML = html
      }
      return container
    },
  }
})
