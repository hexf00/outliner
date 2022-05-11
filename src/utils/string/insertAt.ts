export function insertAt (baseText: string, offset: number, text: string) {
  const before = baseText.substring(0, offset)
  const after = baseText.substring(offset)
  return before + text + after
}