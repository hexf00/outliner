/** jsx中通过该函数阻断事件冒泡 */
export const useStop = function <T extends Event> (fn?: (e: T) => void) {
  return function (e: T) {
    e.stopPropagation()
    fn?.(e)
  }
}
