import { insertAt } from "../string/insertAt";

export function insertAtNode (node: Node, offset: number, text: string) {
  node.textContent = insertAt(node.textContent!, offset, text)
}