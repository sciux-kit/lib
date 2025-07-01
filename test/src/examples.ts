import test from './example.sciux?raw'
import angle from './template/math/angle.sciux?raw'
import circle from './template/math/circle.sciux?raw'
import figure from './template/math/figure.sciux?raw'
import plane from './template/math/plane.sciux?raw'
import model from './template/model.sciux?raw'
import widget from './template/widget.sciux?raw'

export default {
  test,
  widget,
  model,
  '@sciux/math': {
    angle,
    figure,
    circle,
    plane,
  },
}
