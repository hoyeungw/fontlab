import { calc } from '../src/calc'

const dict = {
  A: 4, C: 30, E: 36, F: 30, H: 54, I: 86, L: 24, O: 24, P: 36, R: 36, S: 36, T: 24,
  U: 50, V: 8, X: 12,
}


calc.call(dict, 'H') |> console.log
calc.call(dict, 'A') |> console.log
calc.call(dict, 'C') |> console.log