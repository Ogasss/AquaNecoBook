import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue';
import { FormItem } from '../../shared/Form';
import s from './Charts.module.scss';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';
import { Bars } from './Bars';
import { http } from '../../shared/Http';
import { Time } from '../../shared/time';
import { Icon } from '../../shared/Icon';
import { Button } from '../../shared/Button'
import { RouterLink } from 'vue-router';
import { Notify } from 'vant';
import { None } from '../../shared/None';

const DAY = 24 * 60 * 60 * 1000

type Data1Item = {happen_at:string, amount: number}
type Data2Item = {tag_id:number, tag:{id: number, name: string}, amount: number}
type Data1 = Data1Item[]
type Data2 = Data2Item[]

export const Charts = defineComponent({
  props: {
    startDate: {
      type: String as PropType<string>,
      required: false
    },
    endDate: {
      type: String as PropType<string>,
      required: false
    }
  },
  setup: (props, context) => {
    const kind = ref('expenses')
    const data1 = ref<Data1>([])
    const hide = ref(false) 
    const betterData1 = computed<[string,number][]>(()=> {
      if(!props.startDate || !props.endDate){
        return []
      }
      const diff = new Date(props.endDate).getTime() - new Date(props.startDate).getTime()
      const n = diff / DAY + 1

      return Array.from({length: n}).map((_,i)=>{
        const time = new Time(props.startDate).add(i, 'day').getTimestamp()
        const item = data1.value[0]
        const amount = 
        (item && new Date(item.happen_at).getTime() === time) 
        ?
          (data1.value.shift()!.amount) 
        : 
          0
        return [new Date(time).toISOString(), amount]
      })
    })



    /*data2 */
    const data2 = ref<Data2>([])
    const betterData2 = computed<{name: string, value: number}[]>(()=>
      data2.value.map(item => ({
        name: item.tag.name,
        value: item.amount
      }))
    )

    /*data3 */
    const betterData3 = computed<{ tag: { id: number; name: string; sign: string }; amount: number; percent: number; }[]>(()=>{
      const total = data2.value.reduce((sum, item) => sum + item.amount, 0)
      return data2.value.map(item => ({
        tag: item.tag,
        amount: item.amount,
        percent: Math.round(item.amount / total * 100)
      })) as { tag: { id: number; name: string; sign: string }; amount: number; percent: number; }[]
    })


    const fetchData1 = async () => {
      const response = await http.get<{groups: Data1, summary: number}>('/items/summary',{
        happen_after: props.startDate,
        happen_before: props.endDate,
        kind: kind.value,
        group_by: 'happen_at',
      },
      // {_mock: 'itemSummary'}
      )
      if(response.data.groups.length === 0){
        hide.value = true
      }else{
        hide.value = false
        data1.value = response.data.groups
      }
    }
    onMounted(fetchData1)


    
    const fetchData2 = async () => {
      const response = await http.get<{groups: Data2, summary: number}>('/items/summary',{
        happen_after: props.startDate,
        happen_before: props.endDate,
        kind: kind.value,
        group_by: 'tag_id',
      },{
        // _mock: 'itemSummary',
        _autoLoading: true,
      })
      if(response.data.groups.length === 0){
        hide.value = true
      }else{
        hide.value = false
        data2.value = response.data.groups
      }
    }
    onMounted(fetchData2)

    watch(()=> kind.value,()=>{
      fetchData1()
      fetchData2()
    })

    watch(()=> hide,()=>{
      console.log(hide.value)
    })

    return () => <>
    {
      !hide.value
      ?
      <div class={s.wrapper}>
        <FormItem label='类型' type="select" options={[
          { value: 'expenses', text: '支出' },
          { value: 'income', text: '收入' }
        ]} v-model={kind.value} />
        <LineChart data={betterData1.value}/>
        <PieChart data={betterData2.value}/>
        <Bars data={betterData3.value}/>
      </div>
      :
      <div>
        <None/>
      </div>
    }
      
    </>
  }
})