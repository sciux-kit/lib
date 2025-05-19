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
}).partial()

export default defineComponent<'block', typeof BlockType.infer>((attrs, _context) => {
  return {
    name: 'block',
    attrs: BlockType,
    setup: (children) => {
      const element = document.createElement('div')
      element.style.margin = size(toValue(attrs.margin ?? '0') as string)
      element.style.marginTop = size(toValue(attrs.margin ?? '0') as string)
      element.style.marginRight = size(toValue(attrs.margin ?? '0') as string)
      element.style.marginBottom = size(toValue(attrs.margin ?? '0') as string)
      element.style.marginLeft = size(toValue(attrs.margin ?? '0') as string)
      element.style.padding = size(toValue(attrs.padding ?? '0') as string)
      element.style.paddingTop = size(toValue(attrs.padding ?? '0') as string)
      element.style.paddingRight = size(toValue(attrs.padding ?? '0') as string)
      element.style.paddingBottom = size(toValue(attrs.padding ?? '0') as string)
      element.style.paddingLeft = size(toValue(attrs.padding ?? '0') as string)
      element.append(...children())
      return element
    },
  }
})
