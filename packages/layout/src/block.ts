import { theme } from '@sciux/utils-theme'
import { toValue } from '@vue/reactivity'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
import { AlignType } from './align'

export const BlockType = type({
  margin: 'string | number',
  marginTop: 'string | number',
  marginRight: 'string | number',
  marginBottom: 'string | number',
  marginLeft: 'string | number',
  padding: 'string | number',
  paddingTop: 'string | number',
  paddingRight: 'string | number',
  paddingBottom: 'string | number',
  paddingLeft: 'string | number',
  align: AlignType,
})

export const blockDefaults = {
  margin: '0',
  marginTop: '0',
  marginRight: '0',
  marginBottom: '0',
  marginLeft: '0',
  padding: '0',
  paddingTop: '0',
  paddingRight: '0',
  paddingBottom: '0',
  paddingLeft: '0',
  align: 'start' as const,
}

export default defineComponent<'block', typeof BlockType.infer>((attrs, _context) => {
  return {
    name: 'block',
    attrs: BlockType,
    defaults: blockDefaults,
    setup: (children) => {
      const element = document.createElement('div')
      element.style.margin = theme.size(toValue(attrs.margin))
      element.style.marginTop = theme.size(toValue(attrs.marginTop))
      element.style.marginRight = theme.size(toValue(attrs.marginRight))
      element.style.marginBottom = theme.size(toValue(attrs.marginBottom))
      element.style.marginLeft = theme.size(toValue(attrs.marginLeft))
      element.style.padding = theme.size(toValue(attrs.padding))
      element.style.paddingTop = theme.size(toValue(attrs.paddingTop))
      element.style.paddingRight = theme.size(toValue(attrs.paddingRight))
      element.style.paddingBottom = theme.size(toValue(attrs.paddingBottom))
      element.style.paddingLeft = theme.size(toValue(attrs.paddingLeft))
      element.style.alignItems = toValue(attrs.align)
      element.append(...children())
      return element
    },
  }
})
