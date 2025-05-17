import { toValue } from '@vue/reactivity'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'
import { size } from './utils/size'

const T = type({
  'width': 'string',
  'height': 'string',
  'fill': 'string',
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
  'border': 'string | number',
  'border-radius': 'string | number',
  'border-width': 'string | number',
  'border-color': 'string',
}).partial()

export default defineComponent<'block', typeof T.infer>((attrs, _context) => {
  return {
    name: 'block',
    attrs: T,
    setup: (children) => {
      const element = document.createElement('div')
      element.style.width = size(toValue(attrs.width ?? 'auto') as string)
      element.style.height = size(toValue(attrs.height ?? 'auto') as string)
      element.style.backgroundColor = toValue(attrs.fill ?? 'transparent') as string
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
      element.style.border = size(toValue(attrs.border ?? '0') as string)
      element.style.borderRadius = size(toValue(attrs['border-radius'] ?? '0') as string)
      element.style.borderWidth = size(toValue(attrs['border-width'] ?? '0') as string)
      element.style.borderColor = toValue(attrs['border-color'] ?? 'transparent') as string
      element.append(...children())
      return element
    },
  }
})
