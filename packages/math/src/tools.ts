export type Position = [number, number]

export function middle(from: Position, to: Position): Position {
  return [
    from[0] + (to[0] - from[0]) / 2,
    from[1] + (to[1] - from[1]) / 2,
  ]
}
