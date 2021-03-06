import { deco }  from '@spare/logger'
import { Pairs } from '../src/Pairs'

const pairs = Pairs.build()
pairs.collect([
  [ '@A1', '@A2', -30 ],
  [ '@A1', '@H2', 6 ],
  [ '@A1', '@O2', -48 ],
  [ '@A1', '@T2', -108 ],
  [ '@A1', '@Z2', 24 ],
  [ '@H1', '@A2', 6 ],
  [ '@H1', '@H2', 24 ],
  [ '@H1', '@O2', 6 ],
  [ '@H1', '@T2', -24 ],
  [ '@H1', '@Z2', -12 ],
  [ '@O1', '@A2', -60 ],
  [ '@O1', '@H2', 0 ],
  [ '@O1', '@O2', -2 ],
  [ '@O1', '@T2', -32 ],
  [ '@O1', '@Z2', -36 ],
  [ '@T1', '@A2', -84 ],
  [ '@T1', '@H2', -8 ],
  [ '@T1', '@O2', -36 ],
  [ '@T1', '@T2', -18 ],
  [ '@T1', '@Z2', 12 ],
])
pairs |> deco |> console.log