import { Component, Prop, Vue } from 'vue-property-decorator'

export interface IView {
  cardData: any
  click (id: string, grade: 0 | 1 | 2): void
}

@Component
export default class Home extends Vue {
  declare $props: {
    service: IView
  }
  @Prop() service !: IView


  render () {
    return <div>
      <div>
        memory

        <button onclick={() => this.service.click('id', 0)}>0</button>
        <button onclick={() => this.service.click('id', 1)}>1</button>
        <button onclick={() => this.service.click('id', 2)}>2</button>
        <pre>
          {
            JSON.stringify(this.service.cardData, null, 2)
          }
        </pre>

      </div>
    </div>
  }
}
