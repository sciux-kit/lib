/* eslint-disable antfu/no-top-level-await */
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
import { createHighlighter } from 'shiki'

const highlighter = await createHighlighter({
  themes: ['github-dark'],
  langs: ['js', 'javascript', 'ts', 'typescript', 'python', 'java', 'c', 'cpp', 'c++', 'rust', 'html', 'css', 'sql'],
})

const T = type({
  language: 'string',
})

export default defineComponent<'code', typeof T.infer>((attrs) => {
  return {
    name: 'code',
    attrs: T,
    setup(children) {
      const container = document.createElement('div')
      const kids = children()
      // Filter out text nodes
      const content = kids[0].textContent ?? ''
      const html = highlighter.codeToHtml(content, {
        lang: attrs.language.value,
        theme: 'github-dark',
      })

      container.innerHTML = html;

      (container.childNodes[0] as HTMLElement).style.paddingLeft = '1rem';
      (container.childNodes[0] as HTMLElement).style.paddingRight = '1rem'

      return container
    },
  }
})
