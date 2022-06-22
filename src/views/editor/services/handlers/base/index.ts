import { IHandler } from "@/views/editor/types/IHandler";
import { Inject, Service } from "ioc-di";
import DomRange from "../../range/dom";
import RangeManager from "../../range/manager";

@Service()
export default abstract class BaseHandler implements IHandler {
  @Inject(DomRange) protected domRange!: DomRange
  @Inject(RangeManager) protected ranger!: RangeManager
  abstract onBeforeInput (e: InputEvent): void
}