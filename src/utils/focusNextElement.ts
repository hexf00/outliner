export function focusNextElement (order: 'next' | 'prev' = 'next') {
  let focusableElements = 'div[contenteditable=true]';

  let focusable = Array.from(document.querySelectorAll(focusableElements));
  let index = -1;

  if (document.activeElement) {
    index = focusable.indexOf(document.activeElement);
  }


  let nextElement
  if (order === 'next') {
    nextElement = focusable[index + 1] || focusable[0];
  } else {
    nextElement = focusable[index - 1] || focusable[focusable.length - 1];
  }

  (nextElement as HTMLElement).focus();
}