
import { defineComponent, ref, Transition, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import { useSwipe } from '../hooks/useSwipe';
import { Icon } from '../shared/Icon';
import s from './Welcome.module.scss'

export const Welcome = defineComponent({
  

  setup: (props, context) => {
    /*轮播切换的变量*/
    const cardContent = [
      {
        IconName : 'welcome1',
        titleText1 : '很会挣钱，更要省钱！',
        titlteText2 : '挣得很多，省得也要多！',
        cardNumebr: 0,
      },
      {
        IconName : 'welcome2',
        titleText1 : '每日邮箱提醒，',
        titlteText2 : '养成记账好习惯！',
        cardNumebr: 1,
      },
      {
        IconName : 'welcome3',
        titleText1 : '记账数据可视化，',
        titlteText2 : '收支趋势一目了然！',
        cardNumebr: 2,
      },
      {
        IconName : 'welcome4',
        titleText1 : '数据云备份，',
        titlteText2 : '设备切换账单不丢失！',
        cardNumebr: 3,
      },
    ]
    const cardNumber = ref(0)
    const nextCard = () => {
      if(cardNumber.value < 3) cardNumber.value +=1
    }
    /*滑动手势的变量*/
    const main = ref<HTMLElement>()//用ref标签main
    const { direction, swiping, distance, start, end } = useSwipe(main, { beforeStart: e => e.preventDefault()})//从滑动事件中取出距离与方向
    let swipable = true
    watchEffect(()=>{
      if( swiping.value && swipable){
        if(direction.value === 'left'){
          nextCard()
          swipable = false
        }
      }
      if(swipable === false){
        setTimeout(() => {
          swipable = true          
        }, 400);
      }
    })
    /*不重复触发的变量*/
    const setSkipFlag = () => {
      localStorage.setItem('skipFlag','yes')
    }
    return () => 
    <div class={s.wrapper}>
      <header class={s.header}>
        <Icon class={s.logo} name="logo"/>
        <h1 class={s.title}>蓝猫记账</h1>
      </header>
      <main ref={main} class={s.card}>
        {
        cardContent.map(item => {
          return <Transition 
                  enterFromClass={s.slide_fade_enter_from} 
                  enterActiveClass={s.slide_fade_enter_active}
                  leaveToClass={s.slide_fade_leave_to}
                  leaveActiveClass={s.slide_fade_leave_active}
                  >
                    <main class={s.cardWrapper} v-show={cardNumber.value === item.cardNumebr}>
                        <Icon class={s.cardImg} name={item.IconName}></Icon>
                        <h2 class={s.cardTitle}>{item.titleText1}</h2><br/>
                        <h2 class={s.cardTitle}>{item.titlteText2}</h2>
                    </main>
                  </Transition> 
        })
        }
      </main>
      
      <footer class={s.footer} v-show={cardNumber.value !== 3}>
        <h1 class={s.hidden}>占位</h1>
        <h1 onClick={nextCard}>下一页</h1>
        <RouterLink to='/start'>
          <h1 onClick={setSkipFlag}>跳过</h1>
        </RouterLink>
      </footer>

      <footer class={s.footer} v-show={cardNumber.value === 3}>
        <h1 class={s.hidden}>占位　</h1>
        <RouterLink to='/start'>
          <h1 onClick={setSkipFlag}>开启应用！</h1>
        </RouterLink>
        <h1 class={s.hidden}>占位</h1>
      </footer>
    </div>
  }
})