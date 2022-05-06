export function unionAcquire(vec, list) {
  for (let x of list) if (!vec.includes(x)) vec.push(x)
  return vec
}

export const isEmpty = (ob) => {
  for (let k in ob) return false
  return true
}