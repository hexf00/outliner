export async function loadStyle (url: string | string[]) {
  const styleUrls = Array.isArray(url) ? url : [url];
  for (let index = 0; index < styleUrls.length; index++) {
    const style = document.createElement('link');
    style.href = styleUrls[index];
    style.rel = 'stylesheet';
    document.head.insertAdjacentElement('afterbegin', style);
    await new Promise<void>((resolve) => resolve());
  }
}
