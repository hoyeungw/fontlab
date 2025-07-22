export class Side {
  static Left = 0b01
  static Right = 0b10
}

export function hasLeft(group) { return group['1st'] ?? Boolean(group.side & 1) }

export function hasRight(group) { return group['2nd'] ?? Boolean(group.side & 2) }

export function checkSide(group) {
  let v = 0
  if (hasLeft(group)) v |= Side.Left
  if (hasRight(group)) v |= Side.Right
  return v
}

export function createSideCheck(side) {
  if (side === Side.Left) return hasLeft
  if (side === Side.Right) return hasRight
  return () => true
}

export function sideName(side) {
  let vec = []
  if (side & 1) vec.push('left')
  if (side & 2) vec.push('right')
  return vec.join(' ')
}

export class SideUtil {
  static factory(side) {
    if (side === Side.Left) return hasLeft
    if (side === Side.Right) return hasRight
    return () => true
  }
}