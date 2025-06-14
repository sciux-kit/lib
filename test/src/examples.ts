import test from './example.sciux?raw'
import angle from './template/math/angle.sciux?raw'
import widget from './template/widget.sciux?raw'

export default {
  test,
  widget,
  '@sciux/math': {
    angle,
  },
}
