import { defineComponent, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { MainLayout } from '../../layouts/MainLayout';
import { Button } from '../../shared/Button';
import { http } from '../../shared/Http';
import { Icon } from '../../shared/Icon';
import { Tabs, Tab } from '../../shared/Tabs';
import { useTags } from '../../shared/useTags';
import { InputPad } from './InputPad';
import s from './ItemCreate.module.scss';
import { Tags } from './Tags';
export const ItemCreate = defineComponent({
  setup: (props, context) => {
    const refKind = ref('支出')
    const refTagId = ref<number>()
    const refHappenAt = ref<string>(new Date().toISOString())
    const refAmount = ref<number>()
    const { page, tags: expensesTags, hasMore, fetchTags } = useTags(()=>{
      return http.get<Resources<Tag>>('/tags',{
        kind: 'expenses',
        page: page.value + 1,
        _mock: 'tagIndex'
      })
    })

    const { page:page2, tags: incomeTags, hasMore: hasMore2, fetchTags:fetchTags2 } = useTags(()=>{
      return http.get<Resources<Tag>>('/tags',{
        kind: 'income',
        page: page2.value + 1,
        _mock: 'tagIndex'
      })
    })
    
    return () => (
      <MainLayout class={s.layout}>{{
        title: () => '记一笔',
        icon: () => <RouterLink to='/start'><Icon name="left" class={s.navIcon} /></RouterLink>,
        default: () => <>
          <div class={s.wrapper}>
            <div>{refAmount.value}</div>
            <Tabs v-model:selected={refKind.value} class={s.tabs}>
              <Tab name="支出">
                <Tags kind="expenses" v-model:selected={refTagId.value}/>
              </Tab>
              <Tab name="收入">
                <Tags kind="income" v-model:selected={refTagId.value}/>
              </Tab>
            </Tabs> 
            <div class={s.inputPad_wrapper}>
              
              <InputPad 
                v-model:happenAt={refHappenAt.value}
                v-model:amount={refAmount.value}
              />
            </div>
          </div>
        </>
      }}</MainLayout>
    )
  }
})