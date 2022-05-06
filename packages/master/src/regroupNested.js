import { appendCell, indexed, simpleIndexed, updateCell } from '@vect/nested'

export const lookupRegroup = (nested, surjectX, surjectY, indicator) => {
  const GG = {}, GS = {}, SG = {}, SS = {}

  for (let [ x, y, v ] of indexed(nested)) {
    if (x in surjectX) {
      if (y in surjectY) {
        appendCell.call(GG, surjectX[x], surjectY[y], v)
      }
      else {
        appendCell.call(GS, surjectX[x], y, v)
      }
    }
    else {
      if (y in surjectY) {
        appendCell.call(SG, x, surjectY[y], v)
      }
      else {
        // updateCell.call(SS, x, y, v)
      }
    }
  }
  const target = {}
  for (let [ x, y, v ] of simpleIndexed(GG)) updateCell.call(target, x, y, indicator(v))
  // GG |> deco |> says['lookupRegroup'].br('GG')
  for (let [ x, y, v ] of simpleIndexed(GS)) updateCell.call(target, x, y, indicator(v))
  for (let [ x, y, v ] of simpleIndexed(SG)) updateCell.call(target, x, y, indicator(v))
  for (let [ x, y, v ] of simpleIndexed(SS)) updateCell.call(target, x, y, v)
  return target
}

export const mappedRegroup = (nested, assortX, assortY, indicator) => {
  const groupedNested = {}
  for (let [ x, y, v ] of indexed(nested)) {
    appendCell.call(groupedNested, assortX(x), assortY(y), v)
  }
  for (let [ xg, yg, list ] of indexed(groupedNested)) {
    groupedNested[xg][yg] = indicator(list)
  }
  return groupedNested
}

// `[x] (${ros(x)}) [y] (${ros(y)}) [list] (${list}) `  |> logger