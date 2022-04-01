export function saveAs (blob: Blob, filename: string) {

  var link = document.createElement('a')
  var body = document.querySelector('body')!

  link.href = window.URL.createObjectURL(blob)
  link.download = filename

  // fix Firefox
  link.style.display = 'none'
  body.appendChild(link)

  link.click()
  body.removeChild(link)

  window.URL.revokeObjectURL(link.href)
}