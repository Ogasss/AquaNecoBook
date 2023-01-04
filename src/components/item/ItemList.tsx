import { defineComponent, ref } from 'vue';
import { TimeTabsLayout } from '../../layouts/TimeTabsLayout';
import { StartPage } from '../../views/StartPage';
import { ItemSummary } from './ItemSummary';
export const ItemList = defineComponent({
  setup: (props, context) => {
    const flag = ref(false)
    return () => <>
    {
      flag.value 
      ?<TimeTabsLayout component={ItemSummary}/>
      :<StartPage/>
    }
    </>
  }
})