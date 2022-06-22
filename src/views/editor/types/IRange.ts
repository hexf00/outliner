/** 精简版的Range对象 */

export type IRange = {
  endContainer: Node;
  endOffset: number;
  startContainer: Node;
  startOffset: number;
  collapsed?: boolean
};
