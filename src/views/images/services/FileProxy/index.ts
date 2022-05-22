
export interface IFileProxy {
  name: string
  getContents (): any
  setContents (data: any): any
}

export default class FileProxy implements IFileProxy {
  name: string
  handler: FileSystemFileHandle
  file: File

  constructor ({ handler, file }: { handler: FileSystemFileHandle, file: File }) {
    this.name = handler.name
    this.handler = handler
    this.file = file
  }
  getContents () {
    throw new Error("Method not implemented.")
  }
  setContents (data: any) {
    throw new Error("Method not implemented.")
  }
}