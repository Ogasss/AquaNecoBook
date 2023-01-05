import { Dialog, Notify } from 'vant';
import { defineComponent, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MainLayout } from '../../layouts/MainLayout';
import { Button } from '../../shared/Button';
import { http } from '../../shared/Http';
import { Icon } from '../../shared/Icon';
import s from './Tag.module.scss';
import { TagForm } from './TagForm';
export const TagEdit = defineComponent({
  setup: (props, context) => {
    const router = useRouter()
    const route = useRoute()
    const onError = ()=>{
      Notify({ type: 'warning', message: '删除失败，请重试！', position: 'bottom' });
    }
    const numberId = parseInt(route.params.id!.toString())
    if(Number.isNaN(numberId)){
      return () => <div>不存在</div>
    }
    const onDelete = async (options? :{withItems?: boolean})=>{
      Dialog.confirm({
        message:
          '确定要删除标签吗？',
      })
      await http.delete(`/tags/${numberId}`,{
        withItems: options?.withItems ? 'true' : 'false'
      })
      router.back()
      Notify({ type: 'success', message: '成功删除标签！', position: 'bottom' });
    }
    return () => (
      <MainLayout>{{
        title: () => '编辑标签',
        icon: () => <Icon name="left"/>,
        default: () => <>
          <TagForm id={numberId} />
          <div class={s.actions}>
            <Button level='danger' class={s.removeTags} onClick={() =>  onDelete() }>删除标签</Button>
            <Button level='danger' class={s.removeTagsAndItems} onClick={() =>  onDelete({withItems: true}) }>删除标签及账单</Button>
          </div>
        </>
      }}</MainLayout>
    )
  }
})