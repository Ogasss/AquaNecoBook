import { Notify } from 'vant';
import { defineComponent, onMounted, PropType, reactive, toRaw } from 'vue';
import { routerKey, useRoute } from 'vue-router';
import { Button } from '../../shared/Button';
import { Form, FormItem } from '../../shared/Form';
import { http } from '../../shared/Http';
import { hasError, Rules, validate } from '../../shared/validate';
import s from './Tag.module.scss';
export const TagForm = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const route = useRoute()
    const resetFormDate = ()=>{
      formData.name = '',
      formData.sign = '',
      formData.kind = 'expenses'
    }
    const formData = reactive({
      name: '',
      sign: '',
      kind: 'expenses',
    })
    onMounted(()=>{
      if(route.query.kind){
        formData.kind = route.query.kind!.toString()
      }
    })
    const errors = reactive<{ [k in keyof typeof formData]?: string[] }>({})
    const onError = (error: any) => {
        Object.assign(errors, error.data.errors)
      throw error
    }
    const onSubmit = async (e: Event) => {
      e.preventDefault()
      const rules: Rules<typeof formData> = [
        { key: 'name', type: 'required', message: '必填' },
        { key: 'sign', type: 'required', message: '必填' },
      ]
      Object.assign(errors, {
        name: [],
        sign: [],
        kind: [],
      })
      Object.assign(errors, validate(formData, rules))
      if(!hasError(errors)){
        await http.post('/tags', formData).catch(onError)
        resetFormDate()
        Notify({ type: 'success', message: '创建了新的标签！' });
      }
    }
    return () => (
      <Form onSubmit={onSubmit}>
        <FormItem label='名称'
          type="text"
          maxlength={4}
          v-model={formData.name}
          error={errors['name']?.[0]} />
        <FormItem label={'符号 ' + formData.sign}
          type="emojiSelect" v-model={formData.sign}
          error={errors['sign']?.[0]} />
        <FormItem label='类型' type="select" options={[
          { value: 'expenses', text: '支出' },
          { value: 'income', text: '收入' }
        ]} v-model={formData.kind} />
        <FormItem>
          <p class={s.tips}>记账时长按标签即可进行编辑</p>
        </FormItem>
        <FormItem>
          <Button type="submit" class={[s.button]}>确定</Button>
        </FormItem>
      </Form>
    )
  }
})