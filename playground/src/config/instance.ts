import angle from '../instances/math/angle.sciux?raw'

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
      ],
    },
  ],
} satisfies Config
