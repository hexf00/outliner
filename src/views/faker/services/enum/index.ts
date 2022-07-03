import { IBlock } from './../../../../components/Outliner/types';
import { Service } from "ioc-di";


export type IPath = number[]

export type ITask = {
  path: IPath
  data: IBlock
  isEnd: boolean
}

/** 层次枚举操作 */
@Service()
export default class EnumHelper {
  getAllPath (block: IBlock): IPath[] {
    const queue: ITask[] = [{
      path: [],
      data: block,
      isEnd: false,
    }]
    const paths: IPath[] = []
    while (queue.length) {
      const task = queue.shift()!
      if (task.isEnd) paths.push(task.path)
      task.data.children.forEach((child, index) => {
        const childTask: ITask = {
          path: [...task.path, index],
          data: child,
          isEnd: child.children.length === 0
        }
        queue.push(childTask)
      })
    }
    return paths
  }
}