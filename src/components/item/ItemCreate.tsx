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
    const router = useRouter()
    const loading = ref(false)
    const formData = reactive({
      kind: '支出',
      tags_id:[0],
      amount: 0,
      happen_at: new Date().toISOString(),
    })
    const onSubmit = async () => {
      loading.value = true
      await http.post<Resource<Item>>('/items',formData,
      {params: {_mock: 'itemCreate'}}
      )
      .catch(error=>{
        if(error.response.status === 422){
          Dialog.alert({
            title: '出错',
            message: Object.values(error.response.data.errors).join('\n'),
          })
        }
        throw error
      })
      Notify({ type: 'success', message: '记好完成一笔账单！' });
      loading.value = false
    }

    return () => (
      <MainLayout class={s.layout}>{{
        title: () => '记一笔',
        icon: () => <Icon name="left" class={s.navIcon} onClick={() => { router.go(-1) }}/>,
        default: () => <>
          <div class={s.wrapper}>
            {/* 测试代码 */}
                {/* <div>{formData.kind}</div>
                <div>{formData.tags_id[0]}</div>
                <div>{formData.amount}</div>
                <div>{formData.happen_at}</div> */}
            <Tabs v-model:selected={formData.kind} class={s.tabs}>
              <Tab name="支出">
                <Tags kind="expenses" v-model:selected={formData.tags_id[0]}/>
              </Tab>
              <Tab name="收入">
                <Tags kind="income" v-model:selected={formData.tags_id[0]}/>
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