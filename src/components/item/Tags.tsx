import { defineComponent, onUpdated, PropType, ref, watch } from 'vue';
import { routerKey, RouterLink, useRouter } from 'vue-router';
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
        },
        selected: Number
    },
    emits: ['update:selected'],
    setup: (props, context) => {
        const router = useRouter()
        const loading = ref(false)
        const { page, tags, hasMore, fetchTags } = useTags(()=>{
            loading.value = true
            return http.get<Resources<Tag>>('/tags',{
              kind: props.kind,
              page: page.value + 1,
            
            },
            {   
                // _mock: 'tagIndex',
                _autoLoading: true,
            }
            )
        })
        const onSelect = (tag:Tag) => {
            context.emit('update:selected', tag.id)
        }
        watch(page,()=>{
            loading.value = false
        })
        const  timer = ref<number>()
        const currentTag = ref<HTMLDivElement>()
        const onTouchStart = (e: TouchEvent, tag: Tag) => {
            currentTag.value = e.currentTarget as HTMLDivElement
            timer.value = setTimeout(()=>{
                onLongPress(tag.id)
            }, 400)
        }
        const onTouchEnd = (e: TouchEvent) => {
            clearTimeout(timer.value)
        }
        const onTouchMove = (e: TouchEvent) => {
            const pointedElement = document.elementFromPoint(e.touches[0].clientX,e.touches[0].clientY)
            !(currentTag.value?.contains(pointedElement) || currentTag.value === pointedElement)&&clearTimeout(timer.value)
        }
        const onLongPress = (id:number)=>{
            router.push(`/tags/${id}/edit?kind=${props.kind}?return_to=${router.currentRoute.value.fullPath}`)
        }
        return () => <>
        <div class={s.tags_wrapper} onTouchmove={onTouchMove}>
            <RouterLink to={`/tags/create?kind=${props.kind}`}>
                <div class={s.tag}>
                    <div class={s.sign}>
                        <Icon name="add" class={s.createTag} />
                    </div>
                    <div class={s.name}>
                        新增
                    </div>
                </div> 
            </RouterLink>
            
            {tags.value.map(tag =>
            <div 
                onClick = {() =>onSelect(tag)}
                class={[s.tag, props.selected === tag.id ? s.selected : null]}
                onTouchstart = {(e)=>{onTouchStart(e, tag)}}
                onTouchend = {onTouchEnd}
            >
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
            <Button autoSelfDisabled={true} v-show={hasMore.value&&!loading.value&&tags.value.length>=25} class={s.loadMore} onClick={fetchTags}>加载更多标签</Button> 
            <div v-show={!hasMore.value&&!loading.value&&tags.value.length>=25} class={s.noMore}>
                <span>没有更多标签啦</span>
            </div>
            <div v-show={loading.value} class={s.loading}>
                <Icon name="loading"></Icon>
            </div>
        </div>
        </>
    }
})