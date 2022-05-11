export function insertAtCursor (text: string) {
  const sel = window.getSelection()

  if (sel) {
    const range = sel.getRangeAt(0)
    range.deleteContents()
    range.insertNode(document.createTextNode(text))
  }
}