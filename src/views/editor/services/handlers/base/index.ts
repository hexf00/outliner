import { IHandler } from "@/views/editor/types/IHandler";
import { Inject, Service } from "ioc-di";
import El from "../../El";
import DomRange from "../../range/dom";
import RangeManager from "../../range/manager";

@Service()
export default abstract class BaseHandler implements IHandler {
  @Inject(DomRange) protected domRange!: DomRange
  /** 当前选区 */
  @Inject(RangeManager) protected ranger!: RangeManager
  @Inject(El) elManager!: El
  abstract onBeforeInput (e: InputEvent): void
  abstract onCompositionStart (e: CompositionEvent): void
  abstract onCompositionEnd (e: CompositionEvent): void
}