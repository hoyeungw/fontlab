export class Scope {
  static None = 0b0
  static Upper = 0b10
  static Lower = 0b100
  static Other = 0b1000
  static get Letter() { return Scope.Lower | Scope.Upper }
}