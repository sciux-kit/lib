import { type } from 'arktype'
import mermaid from 'mermaid'
import { defineComponent } from 'sciux-laplace'

const T = type({
  theme: '\'default\' | \'base\' | \'dark\' | \'forest\' | \'neutral\' | \'null\'',
})

export default defineComponent<'mermaid', typeof T.infer>((attrs) => {
  return {
    name: 'mermaid',
    attrs: T,
    defaults: {
      theme: 'dark',
    },
    setup(children) {
      const kids = children()
      const content = kids[0].textContent ?? ''

      const container = document.createElement('div')
      const id = `mermaid-svg-${Math.random().toString(36).slice(2)}`

      mermaid.initialize({
        theme: attrs.theme.value,
      })

      mermaid.render(id, content).then((result) => {
        container.innerHTML = result.svg
      }).catch((e) => {
        container.innerHTML = `<pre style='color:red'>Mermaid render failed\n${e}</pre>`
      })

      return container
    },
  }
})
