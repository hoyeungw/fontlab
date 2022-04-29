export const isEmpty = (ob) => {
  for (let k in ob) return false
  return true
}