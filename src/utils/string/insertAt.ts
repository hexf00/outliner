import { splitOffset } from "./splitOffset"

export function insertAt (baseText: string, offset: number, text: string) {
  const [before, after] = splitOffset(baseText, offset)
  return before + text + after
}