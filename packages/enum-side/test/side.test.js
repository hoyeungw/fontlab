import { Side } from '@fontlab/enum-side'

// 1, 2, 4, 8, 16


const test = () => {
  const { Verso, Recto } = Side
  let none = 0, combo = 0
  combo |= Verso
  combo |= Recto;

  `[None] (${none}) [ None & 0b1 ] (${none & 1}) [ None & 0b10 ] (${none & 2})`  |> console.log;
  `[Verso] (${Verso}) [ Verso & 0b1 ] (${Verso & 1}) [ Verso & 0b10 ] (${Verso & 2})`  |> console.log;
  `[Recto] (${Recto}) [ Recto & 0b1 ] (${Recto & 1}) [ Recto & 0b10 ] (${Recto & 2})`  |> console.log;
  `[Combo] (${combo}) [ Combo & 0b1 ] (${combo & 1}) [ Combo & 0b10 ] (${combo & 2})`  |> console.log
}

test()