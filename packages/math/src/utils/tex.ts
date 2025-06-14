import type { ComponentSetup } from 'sciux-laplace'
import { tex } from '@sciux/widget'
import { ref } from 'sciux-laplace'

export function generateTexNode(value: string): Node {
  const texElement = (tex({ size: ref('10px') }, { underCanvas: true }).setup as ComponentSetup)(
    () => [document.createTextNode(value)],
  )
  return texElement
}
