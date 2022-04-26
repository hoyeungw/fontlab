export function groupToJson(group) {
  const o = {}
  if (group._1st) o['1st'] = group._1st
  if (group._2nd) o['2nd'] = group._2nd
  o.name = group.name
  o.names = group.names
  return o
}