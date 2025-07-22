import { Side } from '@fontlab/enum-checkSide'

// 1, 2, 4, 8, 16


const test = () => {
  const { Left, Right } = Side
  let none = 0, combo = 0
  combo |= Left
  combo |= Right;

  `[None] (${none}) [ None & 0b1 ] (${none & 1}) [ None & 0b10 ] (${none & 2})`  |> console.log;
  `[Left] (${Left}) [ Left & 0b1 ] (${Left & 1}) [ Left & 0b10 ] (${Left & 2})`  |> console.log;
  `[Right] (${Right}) [ Right & 0b1 ] (${Right & 1}) [ Right & 0b10 ] (${Right & 2})`  |> console.log;
  `[Combo] (${combo}) [ Combo & 0b1 ] (${combo & 1}) [ Combo & 0b10 ] (${combo & 2})`  |> console.log
}

test()