export function splitOffset (text: string, offset: number): [string, string] {
  const before = text.substring(0, offset)
  const after = text.substring(offset)
  return [before, after]
}