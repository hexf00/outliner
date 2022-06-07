import { Inject, Root, Service } from 'ioc-di'


class Obj {
  data = 'msg'
}

@Root()
@Service()
class Entry {
  @Inject(Obj) obj!: Obj
}


const diRoot = new Entry()

// example: const diRoot = diNew()
//          const obj = Concat(diRoot, new Obj())
//
// function diNew (Class: any = Entry, args?: any) {
//   return new (Root()(Class))(args)
// }

describe('Hello', () => {
  it('test', async () => {
    expect(diRoot.obj.data).toBe('msg')
  })
})
