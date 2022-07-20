//   /** -1 是新卡片， anki的选项是  生疏/错误、 犹豫/想起、 顺利/正确  */

export interface ICard {
  "id": string
  /** 过期时间  默认在review时间基础 +48小时 */
  "due": Date
  /** 0 */
  "interval": number
  /** 5 */
  "difficulty": number
  /** 2 */
  "stability": number
  /** 1 */
  "retrievability": number
  /**
   * 0 表示遗忘（复习失败）
   * 1 表示记住（复习成功）
   * 2 表示容易（复习成功）
   */
  "grade": number
  /** 上次复习时间 */
  "review": Date
  /** 1 */
  "reps": number
  /** 0 */
  "lapses": number
  "history": any[]
}
