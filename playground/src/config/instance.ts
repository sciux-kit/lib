import ins01 from '../instances/instance/ins01.sciux?raw'
import ins02 from '../instances/instance/ins02.sciux?raw'
import angle from '../instances/math/angle.sciux?raw'
import axis from '../instances/math/axis.sciux?raw'
import circle from '../instances/math/circle.sciux?raw'
import dot from '../instances/math/dot.sciux?raw'
import figure from '../instances/math/figure.sciux?raw'

import parametric from '../instances/math/parametric.sciux?raw'
import plane from '../instances/math/plane.sciux?raw'
import mermaid from '../instances/mermaid.sciux?raw'

import model from '../instances/model.sciux?raw'
import widget from '../instances/widget.sciux?raw'

export interface InstanceItem {
  name: string
  id: string
  description: string
  content: string
}

export interface InstanceGroup {
  name: string
  children: InstanceItem[]
}

export interface Config {
  items: (InstanceGroup | InstanceItem)[]
}

export default {
  items: [
    {
      name: '@sciux/math',
      description: 'Math components',
      children: [
        {
          name: 'Angle',
          id: 'angle',
          description: 'Angle components',
          content: angle,
        },
        {
          name: 'Axis',
          id: 'axis',
          description: 'Axis components',
          content: axis,
        },
        {
          name: 'Circle',
          id: 'circle',
          description: 'Circle components',
          content: circle,
        },
        {
          name: 'Dot',
          id: 'dot',
          description: 'Dot components',
          content: dot,
        },
        {
          name: 'Figure',
          id: 'figure',
          description: 'Figure components',
          content: figure,
        },
        {
          name: 'Parametric',
          id: 'parametric',
          description: 'Parametric components',
          content: parametric,
        },
        {
          name: 'Plane',
          id: 'plane',
          description: 'Plane components',
          content: plane,
        },
      ],
    },
    {
      name: '@sciux/widget',
      description: 'Widget components',
      children: [
        {
          name: 'Widget',
          id: 'widget',
          description: 'Widget components',
          content: widget,
        },
        {
          name: 'Mermaid',
          id: 'mermaid',
          description: 'Mermaid components',
          content: mermaid,
        },
      ],
    },
    {
      name: '@sciux/model',
      description: 'Model components',
      children: [
        {
          name: 'Model',
          id: 'model',
          description: 'Model components',
          content: model,
        },
      ],
    },
    {
      name: 'Instances',
      description: 'Instances',
      children: [
        {
          name: 'Ins01',
          id: 'ins01',
          description: 'Ins01 components',
          content: ins01,
        },
        {
          name: 'Ins02',
          id: 'ins02',
          description: 'Ins02 components',
          content: ins02,
        },
      ],
    },
  ],
} satisfies Config
