export class Scope {
  static None = 0b0000
  static Upper = 0b0010
  static Lower = 0b0100
  static Other = 0b1000
  static get Letter() { return Scope.Lower | Scope.Upper }
}

export const SCOPES = [ Scope.Upper, Scope.Lower, Scope.Other ]

export const scopeName = scope => {
  for (const k in Scope) {
    if (Scope[k] === scope) return k
  }
}