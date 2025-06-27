import init, { applyTheme, render } from 'sciux'
import examples from './examples'
import '@sciux/theme-default/styles/main.css'

const urlName = window.location.hash.slice(1)
const app = document.getElementById('app')!
const sidebar = document.getElementById('sidebar')!

let currentSelectedItem: string | null = urlName ?? null

function createItem(name: string, level: number, handler: () => void): any {
  const left = 25 * level
  const container = document.createElement('div')
  container.style.marginLeft = `${left}px`
  container.style.position = 'relative'
  container.style.display = 'flex'
  // container.style.width = '100%'
  container.style.height = '25px'
  container.style.cursor = 'pointer'
  container.innerHTML = name
  container.id = name
  container.style.borderBottom = '1px dashed #ccc'
  container.addEventListener('mouseover', () => {
    if (name !== currentSelectedItem) {
      container.style.background = '#00000010'
    }
  })

  container.addEventListener('mouseout', () => {
    if (name !== currentSelectedItem) {
      container.style.background = 'transparent'
    }
  })
  container.addEventListener('click', () => {
    if (currentSelectedItem) {
      const item = document.getElementById(currentSelectedItem)
      if (item) {
        item.style.background = 'transparent'
      }
    }
    currentSelectedItem = name
    container.style.background = '#00000020'
    handler()
  })
  return container
}

function createRenderer(source: string) {
  return () => {
    app.innerHTML = ''
    applyTheme('#app')
    render(source, app)
  }
}

function searchNameInExample(name: string, items: Item): string {
  for (const [key, value] of Object.entries(items)) {
    if (key === name) {
      if (typeof value === 'string') {
        return value
      }
      else {
        return value
      }
    }
    else if (typeof value !== 'string') {
      const result = searchNameInExample(name, value)
      if (result) {
        return result
      }
    }
  }
  return undefined
}

type Item = Record<string, string | Item[]>

init()
let level = 0
function renderItem(items: Item): void {
  for (const [name, maybeSource] of Object.entries(items)) {
    if (typeof maybeSource === 'string') {
      const container = createItem(name, level, createRenderer(maybeSource))
      sidebar.appendChild(container)
    }
    else {
      const container = createItem(name, level, () => { })
      sidebar.appendChild(container)
      level++
      for (const [name, item] of Object.entries(maybeSource)) {
        if (typeof item === 'string') {
          const subContainer = createItem(name, level, createRenderer(item))
          sidebar.appendChild(subContainer)
        }
        else {
          const subContainer = createItem(name, level, () => { })
          sidebar.appendChild(subContainer)
          renderItem(item)
        }
      }
      level--
    }
  }
}
renderItem(examples)

const currentItem = searchNameInExample(currentSelectedItem, examples)
if (typeof currentItem === 'string') {
  const renderer = createRenderer(currentItem)
  renderer()
}
