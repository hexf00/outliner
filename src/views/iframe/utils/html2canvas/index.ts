import _html2canvas, { Options } from "html2canvas"

interface IRect {
  width: number
  height: number
  x: number
  y: number
}

interface IDomRect {
  dom: HTMLIFrameElement
  /** dom的rect */
  rect: IRect
  /** 相对坐标 */
  relativeRect: IRect
}
interface IFrameRect extends IDomRect {
  dom: HTMLIFrameElement
}

/** 计算相对位置 */
const getRect = (rect: DOMRect, baseRect?: DOMRect) => {
  return {
    width: rect.width,
    height: rect.height,
    x: baseRect ? rect.x - baseRect.x : 0,
    y: baseRect ? rect.y - baseRect.y : 0
  }
}

/** 记录位置信息 */
export const cacheIframeRect = function (element: HTMLElement): IFrameRect[] {
  const originRect = element.getBoundingClientRect();
  return Array.from(element.querySelectorAll('iframe')).map(it => {
    const rect = it.getBoundingClientRect();
    return {
      dom: it,
      rect,
      relativeRect: getRect(rect, originRect)
    }
  })
}

/** 兼容iframe */
export const html2canvas = async (element: HTMLElement, options?: Partial<Options>): Promise<HTMLCanvasElement> => {
  let iframeList: IFrameRect[] = cacheIframeRect(element);
  const canvas = await _html2canvas(element, {
    ...options,
    onclone: (document: Document, element: HTMLElement) => {
      const cloneIframeList = cacheIframeRect(element);
      iframeList.forEach((it, index) => {

        // 说明：ignoreElements 
        // 会导致iframe位置发生变化，需要对x,y做一个偏移，左上角对齐
        // 且可能导致iframe可能变得更大了，不可做等比缩放，会导致字体大小不统一，可以做裁剪
        const rawRect = it.rect;
        const relativeRect = it.relativeRect;

        const realRect = cloneIframeList[index].rect;
        const realRelativeRect = cloneIframeList[index].relativeRect;

        it.rect = {
          x: realRect.x,
          y: realRect.y,
          width: realRect.width > rawRect.width ? rawRect.width : realRect.width,
          height: realRect.height > rawRect.height ? rawRect.height : realRect.height
        }

        it.relativeRect = {
          x: realRelativeRect.x,
          y: realRelativeRect.y,
          width: realRelativeRect.width > relativeRect.width ? relativeRect.width : realRelativeRect.width,
          height: realRelativeRect.height > relativeRect.height ? relativeRect.height : realRelativeRect.height
        }
      })
    }
  });

  // iframe额外处理
  for (let i = 0; i < iframeList.length; i++) {
    const iframe = iframeList[i];

    const contentWindow = iframe.dom.contentWindow as (Window & { html2canvas?: typeof _html2canvas }) | null
    const contentDocument = iframe.dom.contentDocument

    if (!contentWindow || !contentDocument) {
      console.warn('无权限iframe')
      continue
    }

    // 说明：html2canvas在clone元素时不会装载字体，导致字体乱码，这里通过iframe内注入html2canvas来解决
    const html2canvas = contentWindow.html2canvas || _html2canvas

    const iframeCanvas = await html2canvas(contentDocument.body, {
      ...options,
      // 需要清除容器的高度
      height: undefined
    });

    //将iframe的canvas绘制到原始的canvas上
    const ctx = canvas.getContext('2d')!;

    // 说明: html2canvas 输出的 canvas 方法被代理过了，需要传递绝对坐标
    const { x, y, width, height } = iframe.rect;
    ctx.drawImage(iframeCanvas, x, y, width, height);
  }

  return canvas
}

export default html2canvas;