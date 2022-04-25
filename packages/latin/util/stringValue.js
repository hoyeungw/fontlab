const v1 = word => (word.charCodeAt(0) & 0x7f) << 21
const v2 = word => (
  ((word.charCodeAt(0) & 0x7f) << 21) +
  ((word.charCodeAt(1) & 0x7f) << 14)
)
const v3 = word => (
  ((word.charCodeAt(0) & 0x7f) << 21) +
  ((word.charCodeAt(1) & 0x7f) << 14) +
  ((word.charCodeAt(2) & 0x7f) << 7)
)
const v4 = word => (
  ((word.charCodeAt(0) & 0x7f) << 21) +
  ((word.charCodeAt(1) & 0x7f) << 14) +
  ((word.charCodeAt(2) & 0x7f) << 7) +
  (word.charCodeAt(3) & 0x7f)
)

export const stringValue = word => {
  const l = word?.length
  if (!l) return NaN
  if (typeof word !== 'string') return NaN
  if (l >= 8) return (v4(word.slice(0, 4)) << 2) + v4(word.slice(-4))
  if (l === 7) return (v4(word.slice(0, 4)) << 2) + v3(word.slice(-3))
  if (l === 6) return (v4(word.slice(0, 4)) << 2) + v2(word.slice(-2))
  if (l === 5) return (v4(word.slice(0, 4)) << 2) + v1(word.slice(-1))
  if (l === 4) return v4(word) << 2
  if (l === 3) return v3(word) << 2
  if (l === 2) return v2(word) << 2
  if (l === 1) return v1(word) << 2
}
