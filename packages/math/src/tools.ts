export type Position = [number, number]

export function middle(from: Position, to: Position): Position {
  return [
    from[0] + (to[0] - from[0]) / 2,
    from[1] + (to[1] - from[1]) / 2,
  ]
}

export function normal(from: Position, to1: Position, to2: Position): Position {
  const v1 = [to1[0] - from[0], to1[1] - from[1]]
  const v2 = [to2[0] - from[0], to2[1] - from[1]]
  const cross = v1[0] * v2[1] - v1[1] * v2[0]
  return [
    v2[1] * cross,
    -v1[0] * cross,
  ]
}

export function parallel(from: Position, to1: Position, to2: Position): Position {
  const v = [to1[0] - to2[0], to1[1] - to2[1]]
  return [
    from[0] + v[0],
    from[1] + v[1],
  ]
}
