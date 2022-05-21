import html2canvas from "html2canvas"

interface IRect {
  width: number
  height: number
  x: number
  y: number
}

interface IDomRect {
  dom: HTMLIFrameElement
  /** dom的rect */
  rect: DOMRect
  /** 相对坐标 */
  relativeRect: IRect
}
interface IFrameRect extends IDomRect {
  dom: HTMLIFrameElement
}

export default class ImageConverter {

  getRect (rect: DOMRect, baseRect?: DOMRect) {
    return {
      width: rect.width,
      height: rect.height,
      x: baseRect ? rect.x - baseRect.x : 0,
      y: baseRect ? rect.y - baseRect.y : 0
    }
  }

  async toImage (rect: HTMLElement): Promise<HTMLCanvasElement> {

    // 记录位置信息
    const originRect = rect.getBoundingClientRect();
    const iframeList: IFrameRect[] = Array.from(rect.querySelectorAll('iframe')).map(it => {
      const rect = it.getBoundingClientRect();
      return {
        dom: it,
        rect,
        relativeRect: this.getRect(rect, originRect)
      }
    })
    const canvas = await html2canvas(rect);

    // iframe额外处理
    for (let i = 0; i < iframeList.length; i++) {
      const iframe = iframeList[i];
      const iframeCanvas = await html2canvas(iframe.dom.contentDocument!.body);

      //将iframe的canvas绘制到原始的canvas上
      const ctx = canvas.getContext('2d')!;

      // 说明: html2canvas 输出的 canvas 方法被代理过了，需要传递绝对坐标
      const { x, y, width, height } = iframe.rect;
      ctx.drawImage(iframeCanvas, x, y, width, height);
    }

    return canvas
  }
}