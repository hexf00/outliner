export async function loadScript (url: string | string[]) {
  const scriptUrls = Array.isArray(url) ? url : [url];
  for (let index = 0; index < scriptUrls.length; index++) {
    const script = document.createElement('script');
    script.src = scriptUrls[index];
    document.body.appendChild(script);
    await new Promise<void>((resolve) => script.addEventListener('load', () => resolve()));
  }
}
