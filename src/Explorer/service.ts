interface IFile {
  path: string,
  file: File
}
export default class ExplorerService {

  files: IFile[] = [];

  currentFileIndex: number = -1
  currentFile: null | IFile = null

  async dir (dirHandle: FileSystemDirectoryHandle, rootHandle: FileSystemDirectoryHandle) {
    for await (const item of dirHandle.values()) {
      if (item.kind === 'directory') {
        this.dir(item, rootHandle)
      } else if (item.kind === 'file') {
        this.files.push({
          path: (await rootHandle.resolve(item))!.join("/"),
          file: await item.getFile()
        })
      }
    }
  }


  async onClick () {
    // fs.directoryOpen('')
    alert(window.showDirectoryPicker)
    const dirHandle = await window.showDirectoryPicker();
    this.files = []
    this.dir(dirHandle, dirHandle);


    this.setIndex(0)
    console.log(this.files)
  }


  setIndex (index: number) {
    if (index < 0 || index >= this.files.length) {
      this.currentFileIndex = index
      this.currentFile = null
      return
    }

    this.currentFileIndex = index
    this.currentFile = this.files[index]
  }

  prev () {
    this.setIndex(this.currentFileIndex - 1)
  }
  next () {
    this.setIndex(this.currentFileIndex + 1)
  }

}