import { align, block, columns, flexbox, grid, rows } from '@sciux/layout'
import { button, checkbox, input, slider } from '@sciux/model'
import { canvas, code, link, table } from '@sciux/widget'
import { components, render, TextMode, textModes } from 'sciux-laplace'
import source from './example.sciux?raw'

components.set('block', block)
components.set('flexbox', flexbox)
components.set('columns', columns)
components.set('rows', rows)
components.set('grid', grid)
components.set('align', align)
components.set('button', button)
components.set('input', input)
components.set('table', table)
components.set('code', code)
components.set('canvas', canvas)
components.set('link', link)
components.set('checkbox', checkbox)
components.set('slider', slider)

textModes.set('code', TextMode.RCDATA)

render(source, document.getElementById('app')!)
