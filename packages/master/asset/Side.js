export const _1ST = '1st'
export const _2ND = '2nd'

export class Side {
  static Verso = 0b1
  static Recto = 0b10
}

export function is1st(group) { return group[_1ST] ?? Boolean(group.side & 1) }
export function is2nd(group) { return group[_2ND] ?? Boolean(group.side & 2) }
export function side(group) {
  let v = 0
  if (is1st(group)) v |= Side.Verso
  if (is2nd(group)) v |= Side.Recto
  return v
}

export class SideUtil {
  static filterFactory(side) {
    if (side === Side.Verso) return SideUtil.is1st
    if (side === Side.Recto) return SideUtil.is2nd
    return () => true
  }
  static is1st = is1st
  static is2nd = is2nd
  static side = side
}


