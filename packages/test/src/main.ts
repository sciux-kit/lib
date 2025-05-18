import { components, parse, render } from "sciux-laplace";
// import { model } from "@sciux/model";
import { block, flexbox, grid, align } from '@sciux/layout'
// import source from './example.sciux?raw'

const source = `
<block>
  <flexbox>
    <grid>
      <align>
        <block>Hello</block>
      </align>
    </grid>
  </flexbox>
</block>
`
components.set('block', block)
components.set('flexbox', flexbox)
components.set('grid', grid)
components.set('align', align)
render(source, document.getElementById('app')!)
