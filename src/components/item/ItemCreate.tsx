import { defineComponent, onMounted, PropType, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { MainLayout } from '../../layouts/MainLayout';
import { Button } from '../../shared/Button';
import { http } from '../../shared/Http';
import { Icon } from '../../shared/Icon';
import { Tabs, Tab } from '../../shared/Tabs';
import { useTags } from '../../shared/useTags';
import { InputPad } from './InputPad';
import s from './ItemCreate.module.scss';
export const ItemCreate = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const refKind = ref('支出')
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
        
    onMounted(async ()=>{
      const response = await http.get<{resources: Tag[]}>('/tags',{
        kind: 'income',
        _mock: 'tagIndex'
      })
      incomeTags.value = response.data.resources
    })
    
    return () => (
      <MainLayout class={s.layout}>{{
        title: () => '记一笔',
        icon: () => <RouterLink to='/start'><Icon name="left" class={s.navIcon} /></RouterLink>,
        default: () => <>
          <div class={s.wrapper}>
            <Tabs v-model:selected={refKind.value} class={s.tabs}>
              <Tab name="支出">
                <div class={s.tags_wrapper}>
                  <div class={s.tag}>
                    <div class={s.sign}>
                      <Icon name="add" class={s.createTag} />
                    </div>
                    <div class={s.name}>
                      新增
                    </div>
                  </div>
                  {expensesTags.value.map(tag =>
                    <div class={[s.tag, s.selected]}>
                      <div class={s.sign}>
                        {tag.sign}
                      </div>
                      <div class={s.name}>
                        {tag.name}
                      </div>
                    </div>
                  )}
                </div>
                
                <div class={s.loadMoreWrapper}>{hasMore.value ? 
                  <Button class={s.loadMore} onClick={fetchTags}>加载更多标签</Button> :
                  <div class={s.noMore}><span>没有更多标签啦</span></div>
                }</div>
              </Tab>
              <Tab name="收入">
                <div class={s.tags_wrapper}>
                  <div class={s.tag}>
                    <div class={s.sign}>
                      <Icon name="add" class={s.createTag} />
                    </div>
                    <div class={s.name}>
                      新增
                    </div>
                  </div>
                  {incomeTags.value.map(tag =>
                    <div class={[s.tag, s.selected]}>
                      <div class={s.sign}>
                        {tag.sign}
                      </div>
                      <div class={s.name}>
                        {tag.name}
                      </div>
                    </div>
                  )}
                </div>
                <div class={s.loadMoreWrapper}>{hasMore2.value ? 
                  <Button class={s.loadMore} onClick={fetchTags2}>加载更多标签</Button> :
                  <div class={s.noMore}><span>没有更多标签啦</span></div>
                }</div>
              </Tab>
            </Tabs>
            <div class={s.inputPad_wrapper}>
              <InputPad />
            </div>
          </div>
        </>
      }}</MainLayout>
    )
  }
})