import test from './example.sciux?raw'
import ins01 from './template/instance/ins01.sciux?raw'
import ins02 from './template/instance/ins02.sciux?raw'
import angle from './template/math/angle.sciux?raw'
import axis from './template/math/axis.sciux?raw'
import circle from './template/math/circle.sciux?raw'
import figure from './template/math/figure.sciux?raw'
import parametric from './template/math/parametric.sciux?raw'
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
    parametric,
    axis,
  },
  'INSTANCE': {
    ins01,
    ins02,
  },
}
