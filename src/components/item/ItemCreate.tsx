import { Dialog, Notify } from 'vant';
import { defineComponent, reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { MainLayout } from '../../layouts/MainLayout';
import { Button } from '../../shared/Button';
import { http } from '../../shared/Http';
import { Icon } from '../../shared/Icon';
import { Tabs, Tab } from '../../shared/Tabs';
import { InputPad } from './InputPad';
import s from './ItemCreate.module.scss';
import { Tags } from './Tags';
export const ItemCreate = defineComponent({
  setup: (props, context) => {
    const loading = ref(false)
    const formData = reactive({
      kind: "支出",
      tag_ids:[0],
      amount: 0,
      happen_at: new Date().toISOString(),
    })
    const switchKind = () => {
      if(formData.kind === '支出'){
        formData.kind = 'expenses'
        return
      }
      if(formData.kind === '收入'){
        formData.kind = 'income'
        return
      }
      if(formData.kind === 'expenses'){
        formData.kind = '支出'
        return
      }
      if(formData.kind === 'income'){
        formData.kind = '收入'
        return
      }
    }
    const onSubmit = async () => {
      loading.value = true
      switchKind()
      
      
      const res = await http.post<Resource<Item>>('/items',formData, {_autoLoading: true})
      console.log(res)
      if(res.response!==undefined && res.response.status === 422){
        if(res.response.data.errors.tag_ids !== undefined && res.response.data.errors.tag_ids[0] === '不属于当前用户'){
          res.response.data.errors.tag_ids[0] = '请选择备注标签'
        }
        const str = Object.values(res.response.data.errors).join('\n')
        Dialog.alert({
          title:'记账错误！',
          message: str
        })
      }
      if(res.status !== undefined && res.status === 200){
        Notify({ type: 'success', message: '记好完成一笔账单！', position: 'bottom' })
      }
      switchKind()
      loading.value = false
    }

    return () => (
      <MainLayout class={s.layout}>{{
        title: () => '记一笔',
        icon: () => <Icon name="left" class={s.navIcon}/>,
        default: () => <>
          <div class={s.wrapper}>
            {/* 测试代码 */}
                {/* <div>{formData.kind}</div>
                <div>{formData.tags_ids[0]}</div>
                <div>{formData.amount}</div>
                <div>{formData.happen_at}</div> */}
            <Tabs v-model:selected={formData.kind} class={s.tabs}>
              <Tab name="支出">
                <Tags kind="expenses" v-model:selected={formData.tag_ids[0]}/>
              </Tab>
              <Tab name="收入">
                <Tags kind="income" v-model:selected={formData.tag_ids[0]}/>
              </Tab>
            </Tabs> 
            <div class={s.inputPad_wrapper}>
              
              <InputPad 
                v-model:happenAt={formData.happen_at}
                v-model:amount={formData.amount}
                loading={loading.value}
                onSubmit={onSubmit}
              />
            </div>
          </div>
        </>
      }}</MainLayout>
    )
  }
})