
export interface IFileProxy {
  name: string
  type: string
  lastModified: number
  size: number
  getContents (): any
  setContents (data: any): any
}

export default class FileProxy implements IFileProxy {

  handler: FileSystemFileHandle
  file: File

  get size (): number {
    return this.file.size
  }

  get name (): string {
    return this.handler.name
  }

  get type (): string {
    return this.file.type
  }

  get lastModified (): number {
    return this.file.lastModified
  }

  constructor ({ handler, file }: { handler: FileSystemFileHandle, file: File }) {
    this.handler = handler
    this.file = file
  }
  getContents () {


    if (this.file.type.includes('image')) {
      return this.getImage()
    } else {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event: FileReaderEventMap['load']) => {
          resolve(event.target!.result)
        }
        reader.readAsText(this.file)
      })
    }
  }

  getImage () {
    // 读取文件内容  
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event: FileReaderEventMap['load']) => {
        const img = new Image();
        img.src = event.target!.result as string;
        resolve(img)
      }
      
      reader.readAsDataURL(this.file)
    })
  }
  setContents (data: any) {
    throw new Error("Method not implemented.")
  }
}