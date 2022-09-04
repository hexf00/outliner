import { IAtom } from "@/views/editor/types";




describe('换行测试', () => {

  it('换行测试-0', async () => {


    // 必然会耦合 文本编辑器和树形结构编辑器


    const data: IAtom[] = [{ text: '' }];
    const cursor = { index: 0, offset: 0 };


    const result: IAtom[] = [];

    // 将

    expect(result.length).toBe(2)
    expect(result[0]).toBe(data[0])
    // @ts-expect-error IAtom不应该缩小类型约束
    expect(result[1].content).toBe('')

  })
})