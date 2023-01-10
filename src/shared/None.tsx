import { defineComponent, PropType } from 'vue';
import { RouterLink } from 'vue-router';
import { Button } from './Button';
import { Icon } from './Icon';
import s from './None.module.scss';
export const None = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        return () => (
            <div class={s.wrapper}>
                <div class={s.iconWrapper}>
                    <Icon class={s.icon} name="start"></Icon>
                </div>
                <div class={s.buttonWrapper}>
                    <RouterLink to="/items/create">
                        <Button>没有账单啦，前往记账吧！</Button>
                    </RouterLink>
                </div>
            </div>
        )
    }
})