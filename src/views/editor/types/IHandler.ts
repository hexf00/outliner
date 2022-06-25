export interface IHandler {
  onBeforeInput (e: InputEvent): void
  onCompositionStart (e: CompositionEvent): void
  onCompositionEnd (e: CompositionEvent): void
}