import { align, block, columns, flexbox, grid, rows } from '@sciux/layout'
// import { model } from "@sciux/model";
import { button, input } from '@sciux/model'
import { components, render } from 'sciux-laplace'
import source from './example.sciux?raw'

components.set('block', block)
components.set('flexbox', flexbox)
components.set('columns', columns)
components.set('rows', rows)
components.set('grid', grid)
components.set('align', align)
components.set('button', button)
components.set('input', input)

render(source, document.getElementById('app')!)
