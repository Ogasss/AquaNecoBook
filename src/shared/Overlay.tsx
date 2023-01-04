import { Dialog } from 'vant';
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { signInStatus } from '../main';
import { Icon } from './Icon';
import s from './Overlay.module.scss';
export const Overlay = defineComponent({
  props: {
    onClose: {
      type: Function as PropType<() => void>
    }
  },
  setup: (props, context) => {
    const router = useRouter();
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
          location.reload()
        })
        .catch(() => {
          return null
        });
      
    }
    return () => <>
      <div class={s.mask} onClick={close}></div>
      <div class={s.overlay}>
          {!signInStatus 
          ? 
            <RouterLink to="/sign_in">
              <section class={s.currentUser}>
                <h2>未登录用户</h2>
                <p>点击这里登录</p>
              </section>
            </RouterLink>
          : <section class={s.currentUser} onClick={ exit }>
            <div class={s.wrapper}>
              <Icon class={s.icon} name="signInIcon"></Icon>
              <div>
                <h2>要坚持记账哦~</h2>
                <p>123123123@qq.com</p>
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
            <li>
              <RouterLink to="/tags/create" class={s.action}>
                <Icon name="tagsCreate" class={s.icon} />
                <span>标签创建</span>
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
