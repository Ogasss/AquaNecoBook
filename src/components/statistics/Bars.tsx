import { computed, defineComponent, PropType, reactive } from 'vue';
import { getMoney } from '../../shared/Money';
import s from './Bars.module.scss';
export const Bars = defineComponent({
  props: {
    data: {
      type: Array as PropType<{ tag: { id: number; name: string; sign: string }; amount: number; percent: number; }[]>,
      required: true
    }
  },
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
          {props.data.map(({ tag, amount, percent }) => {
            return (
              <div class={s.topItem}>
                <div class={s.sign}>
                  {tag.sign}
                </div>
                <div class={s.bar_wrapper}>
                  <div class={s.bar_text}>
                    <span> {tag.name} - {percent}% </span>
                    <span> ￥{getMoney(amount)} </span>
                  </div>
                  <div class={s.bar}>
                    <div class={s.bar_inner} style={{width: `${percent}%`}}></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
    )
  }
})