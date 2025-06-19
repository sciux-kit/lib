// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
  },
  {
    rules: {
      'unused-imports/no-unused-vars': 'warn',

    },
  },
)
