import { Notify } from 'vant';
import { defineComponent, reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useBool } from '../hooks/useBool';
import { MainLayout } from '../layouts/MainLayout';
import { me, setMe } from '../main';
import { Button } from '../shared/Button';
import { Form, FormItem } from '../shared/Form';
import { http } from '../shared/Http';
import { Icon } from '../shared/Icon';
import { mePromise, refreshMe } from '../shared/me';
import { hasError, validate } from '../shared/validate';
import s from './SignInPage.module.scss';
export const SignInPage = defineComponent({
  setup: (props, context) => {
    const formData = reactive({
      email: '',
      code: ''
    })
    const errors = reactive({
      email: [],
      code: []
    })
    const router = useRouter()
    const route = useRoute()
    const refValidationCode = ref<any>()
    const { ref: refValidationCodeDisabled, toggle, on, off } = useBool(false)
    const onSubmit = async (e: Event) => {
      e.preventDefault()
      Object.assign(errors, {
        email: [], code: []
      })


      Object.assign(errors, validate(formData, [
        { key: 'email', type: 'required', message: '必填' },
        { key: 'email', type: 'pattern', regex: /.+@.+/, message: '邮箱地址格式不正确' },
        { key: 'code', type: 'required', message: '必填' },
      ]))


      if(!hasError(errors)){
        const response = await http.post<{jwt: string}>('/session', formData, {_autoLoading: true})
        .catch(onError)
        if(response.data === undefined){
          Notify({ type: 'warning', message: '登录失败！验证码或邮箱错误！', position: 'bottom' });
        }else{
          localStorage.setItem('jwt',response.data.jwt)
          // router.push('/sign_in?return_to='+ encodeURIComponent(route.fullPath))
          refreshMe()
          const response2 = await mePromise
          setMe(response2?.data.resource)
          router.push('/start')
          Notify({ type: 'success', message: '登录成功！', position: 'bottom' });
        }
      }
    }

    const onError = (error: any) => {
      console.log(error.status)
      if(error.status === 422){
        Object.assign(errors, {
          email:['邮箱或验证码不正确']
        })
      }
      throw error
    }
    const onClickSendValidationCode = async () => {
      on() //激活按钮静默
      const response = await http
        .post('/validation_codes', { email: formData.email }, {_autoLoading: true}).then(
          ()=>{
            Notify({ type: 'success', message: '发送成功！', position: 'bottom' });
          },
          ()=>{
            Notify({ type: 'warning', message: '发送失败！', position: 'bottom' });
          }
        )
        .catch(onError)
        .finally(off)
      refValidationCode.value.startCount()
    }
    return () => (
      <MainLayout>{
        {
          title: () => '登录',
          icon: () => <Icon name="left" onClick={()=>{
            router.push('/welcome')
          }}/>,
          default: () => (
            <div class={s.wrapper}>
              <div class={s.logo}>
                <Icon class={s.icon} name="logo" />
              </div>
              <Form onSubmit={onSubmit}>
                <FormItem label="邮箱地址" type="text"
                  placeholder='请输入邮箱，然后点击发送验证码'
                  v-model={formData.email} error={errors.email?.[0]} />
                <FormItem ref={refValidationCode} label="验证码" type="validationCode"
                  maxlength={6}
                  placeholder='请输入六位数字'
                  countFrom={10}
                  disabled={refValidationCodeDisabled.value}
                  onClick={onClickSendValidationCode}
                  v-model={formData.code} error={errors.code?.[0]} />
                <FormItem style={{ paddingTop: '96px' }}>
                  <Button type="submit">登录</Button>
                </FormItem>
              </Form>
            </div>
          )
        }
      }</MainLayout>
    )
  }
})