export function polarToCartesian(
  center: [number, number],
  radius: number,
  angleInDegrees: number,
): [number, number] {
  const angleInRadians = (angleInDegrees * Math.PI) / 180
  return [
    center[0] + radius * Math.cos(angleInRadians),
    center[1] + radius * Math.sin(angleInRadians),
  ]
}

export function describeArc(
  center: [number, number],
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  if (Math.abs(startAngle - endAngle) % 360 <= 1e-6) {
    return [
      'M',
      ...center,
      'm',
      -radius,
      0,
      'a',
      radius,
      radius,
      0,
      1,
      0,
      radius * 2,
      0,
      'a',
      radius,
      radius,
      0,
      1,
      0,
      -radius * 2,
      0,
    ].join(' ')
  }
  const start = polarToCartesian(center, radius, endAngle)
  const end = polarToCartesian(center, radius, startAngle)
  const largeArcFlag = Number(endAngle - startAngle > 180)
  return ['M', ...start, 'A', radius, radius, 0, largeArcFlag, 0, ...end].join(
    ' ',
  )
}
