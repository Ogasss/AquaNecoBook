import { defineComponent, defineProps, PropType } from 'vue';
import { useRouter } from 'vue-router';
import s from './Icon.module.scss';

export type IconName = string

export const Icon = defineComponent({
  props: {
    name: {
      type: String as PropType<IconName>,
      required: true,
    },
    onClick: {
      type: Function as PropType<(e: MouseEvent) => void>
    }
  },
  setup: (props, context) => {
    const router = useRouter()
    return () => (
      <svg class={s.icon} onClick={ props.name === 'left'&&!props.onClick ? ()=>{router.go(-1)} : props.onClick}>
        <use xlinkHref={'#' + props.name}></use>
      </svg>
    )
  }
})

