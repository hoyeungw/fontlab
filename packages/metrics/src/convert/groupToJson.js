import { _1ST, _2ND } from '../../asset/Side'

export function groupToJson(group) {
  const o = {}
  if (group.side & 1) o[_1ST] = true
  if (group.side & 2) o[_2ND] = true
  o.name = group.name
  o.names = group.names
  return o
}