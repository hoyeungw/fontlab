import { appendCell, indexed } from '@vect/nested'

export const regroupNested = (nested, xToG, yToG) => {
  const GG = {}, GU = {}, UG = {}, UU = {}
  for (let [ x, y, v ] of indexed(nested)) {
    if (x in xToG) {
      if (y in yToG) {
        const xg = xToG[x], yg = yToG[y]
        delete GG[xg][yg]
        appendCell.call(GG, xToG[x], yToG[y], v)
      } else {

      }
    } else {
      if (y in yToG) {

      } else {
        appendCell.call(UU, x, y, v)
      }
    }

    const nextX = xToG[x] ?? x
    const nextY = yToG[y] ?? y

    if ((x in xToG) && (y in yToG)) {
      delete nested[x][y]
    } else {
    }
  }
}