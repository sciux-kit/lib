import { toValue } from '@vue/reactivity'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
import { AlignType } from './align'
import { size } from './utils/size'

export const BlockType = type({
  'margin': 'string | number',
  'margin-top': 'string | number',
  'margin-right': 'string | number',
  'margin-bottom': 'string | number',
  'margin-left': 'string | number',
  'padding': 'string | number',
  'padding-top': 'string | number',
  'padding-right': 'string | number',
  'padding-bottom': 'string | number',
  'padding-left': 'string | number',
  'align': AlignType,
})

export default defineComponent<'block', typeof BlockType.infer>((attrs, _context) => {
  return {
    name: 'block',
    attrs: BlockType,
    defaults: {
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
      align: 'start',
    },
    setup: (children) => {
      const element = document.createElement('div')
      element.style.margin = size(toValue(attrs.margin))
      element.style.marginTop = size(toValue(attrs['margin-top']))
      element.style.marginRight = size(toValue(attrs['margin-right']))
      element.style.marginBottom = size(toValue(attrs['margin-bottom']))
      element.style.marginLeft = size(toValue(attrs['margin-left']))
      element.style.padding = size(toValue(attrs.padding))
      element.style.paddingTop = size(toValue(attrs['padding-top']))
      element.style.paddingRight = size(toValue(attrs['padding-right']))
      element.style.paddingBottom = size(toValue(attrs['padding-bottom']))
      element.style.paddingLeft = size(toValue(attrs['padding-left']))
      element.style.alignItems = toValue(attrs.align)
      element.append(...children())
      return element
    },
  }
})
