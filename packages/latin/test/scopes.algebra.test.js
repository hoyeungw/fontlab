import { logger, ros } from '@spare/logger'

class Scope {
  static None = 0b0
  static Upper = 0b10
  static Lower = 0b100
  static Other = 0b1000
  static get Letter() { return Scope.Lower | Scope.Upper }
}

const test = () => {
  `${ros('None')} = ${Scope.None}`  |> logger;
  `${ros('Upper')} = ${Scope.Upper}`  |> logger;
  `${ros('Lower')} = ${Scope.Lower}`  |> logger;
  `${ros('Other')} = ${Scope.Other}`  |> logger;
  `${ros('Upper')} | ${ros('Lower')} = ${Scope.Upper | Scope.Lower}`  |> logger;
  `${ros('Upper')} | ${ros('Other')} = ${Scope.Upper | Scope.Other}`  |> logger;
  `${ros('Lower')} | ${ros('Other')} = ${Scope.Lower | Scope.Other}`  |> logger;
  `${ros('Upper')} | ${ros('Lower')} | ${ros('Other')} = ${Scope.Upper | Scope.Lower | Scope.Other}`  |> logger;
  `${ros('None')} | ${ros('Upper')} | ${ros('Lower')} | ${ros('Other')} = ${Scope.Upper | Scope.Upper | Scope.Lower | Scope.Other}`  |> logger
}

test()