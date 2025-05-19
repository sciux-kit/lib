import { align, block, flexbox, grid } from '@sciux/layout'
// import { model } from "@sciux/model";
import { button } from '@sciux/model'
import { components, render } from 'sciux-laplace'
import source from './example.sciux?raw'

components.set('block', block)
components.set('flexbox', flexbox)
components.set('grid', grid)
components.set('align', align)
components.set('button', button)

render(source, document.getElementById('app')!)
