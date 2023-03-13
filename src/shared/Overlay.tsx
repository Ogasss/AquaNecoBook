import { Dialog } from 'vant';
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue';
import { routerKey, RouterLink, useRouter } from 'vue-router';
import { Icon } from './Icon';
import { mePromise } from './me';
import s from './Overlay.module.scss';

export const Overlay = defineComponent({
  props: {
    onClose: {
      type: Function as PropType<() => void>
    }
  },
  setup: (props, context) => {
    const router = useRouter()
    const close = () => {
      props.onClose?.()
    }
    const exit = () => { 
      Dialog.confirm({
        message:
          '确定要退出登录吗？',
      })
        .then(() => {
          localStorage.removeItem('jwt')
          exit()
          setTimeout(() => {
            location.reload()
          }, 200);
        })
    }
    const me = ref<User>()
    onMounted(async ()=>{
      const response = await mePromise
      me.value = response?.data.resource
    })
    return () => <>
      <div class={s.mask} onClick={close}></div>
      <div class={s.overlay}>
          {!me.value 
          ? 
            <RouterLink to="/sign_in">
              <section class={s.currentUser}>
                <h2>未登录用户</h2>
                <p>点击邮箱登录</p>
              </section>
            </RouterLink>
          : <section class={s.currentUser} onClick={ exit }>
            <div class={s.wrapper}>
              <Icon class={s.icon} name="signInIcon"></Icon>
              <div>
                <h2>点击退出登录</h2>
                <p>{me.value.email}</p>
              </div>
            </div>
            </section>
          }
        <nav>
          <ul class={s.action_list}>
            <li>
              <RouterLink to="/items/create" class={s.action}>
                <Icon name="itemsCreate" class={s.icon} />
                <span>我要记账</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/items" class={s.action}>
                <Icon name="itemslist" class={s.icon} />
                <span>账单列表</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/statistics" class={s.action}>
                <Icon name="statistics" class={s.icon} />
                <span>统计图表</span>
              </RouterLink>
            </li>
            
          </ul>
        </nav>
      </div>
    </>
  }
})


export const OverlayIcon = defineComponent({
  setup: (props, context) => {
    const refOverlayVisible = ref(false)
    const onClickMenu = () => {
      refOverlayVisible.value = !refOverlayVisible.value
    }
    return () => <>
      <Icon name="menu" class={s.icon} onClick={onClickMenu} />
      {refOverlayVisible.value &&
        <Overlay onClose={() => refOverlayVisible.value = false} />
      }
    </>

  }
})
