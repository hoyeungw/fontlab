export function distinct(...iter) {
  const dedupe = []
  for (const x of iter) if (!dedupe.includes(x)) dedupe.push(x)
  return dedupe
}