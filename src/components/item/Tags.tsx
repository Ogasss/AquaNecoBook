import { defineComponent, onUpdated, PropType, ref, watch } from 'vue';
import { Button } from '../../shared/Button';
import { http } from '../../shared/Http';
import { Icon } from '../../shared/Icon';
import { useTags } from '../../shared/useTags';
import s from './Tags.module.scss';
export const Tags = defineComponent({
    props: {
        kind:{
            type: String as PropType<string>,
            required: true
        }
    },
    setup: (props, context) => {
        const loading = ref(false)
        const { page, tags, hasMore, fetchTags } = useTags(()=>{
            loading.value = true
            return http.get<Resources<Tag>>('/tags',{
              kind: props.kind,
              page: page.value + 1,
              _mock: 'tagIndex',
            })
        })
        watch(page,()=>{
            loading.value = false
        })
        return () => <>
        <div class={s.tags_wrapper}>
            <div class={s.tag}>
            <div class={s.sign}>
                <Icon name="add" class={s.createTag} />
            </div>
            <div class={s.name}>
                新增
            </div>
            </div>
            {tags.value.map(tag =>
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
        <div class={s.loadMoreWrapper}>
            <Button autoSelfDisabled={true} v-show={hasMore.value&&!loading.value} class={s.loadMore} onClick={fetchTags}>加载更多标签</Button> 
            <div v-show={!hasMore.value&&!loading.value} class={s.noMore}>
                <span>没有更多标签啦</span>
            </div>
            <div v-show={loading.value} class={s.loading}>
                <Icon name="loading"></Icon>
            </div>
        </div>
        </>
    }
})