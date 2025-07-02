import type { Context } from 'sciux-laplace'
import { toValue } from '@vue/reactivity'
import { type } from 'arktype'
import { defineComponent } from 'sciux-laplace'

export const SelectType = type({
  model: 'string',
  disabled: 'boolean',
})

export const SelectOptionType = type({
  value: 'string',
  selected: 'boolean',
  disabled: 'boolean',
})

export const select = defineComponent<'select', typeof SelectType.infer, Context>((attrs, context) => {
  return {
    name: 'select',
    attrs: SelectType,
    setup: (children) => {
      const select = document.createElement('select')
      if (attrs.model) {
        select.addEventListener('select', (e) => {
          const target = e.target as HTMLSelectElement
          context[attrs.model!.value!] = target.value
        })
      }
      select.disabled = toValue(attrs.disabled)
      for (const child of children()) {
        select.appendChild(child)
      }
      return select
    },
  }
})

export const selectOption = defineComponent<'option', typeof SelectOptionType.infer, Context>((attrs, _context) => {
  const option = document.createElement('option')
  return {
    name: 'option',
    attrs: SelectOptionType,
    setup: (children) => {
      option.value = toValue(attrs.value)
      option.selected = toValue(attrs.selected)
      option.disabled = toValue(attrs.disabled)
      option.append(...children())
      return option
    },
  }
})
