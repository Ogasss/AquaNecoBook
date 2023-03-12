import { routes } from './config/routes';
import { computed, createApp, ref } from 'vue'
import { App } from './App'
import { createRouter } from 'vue-router'
import { history } from './shared/history';
import '@svgstore';
import { mePromise, fetchMe } from './shared/me';

const router = createRouter({ history, routes })

export const me = ref<User>()

fetchMe().then(
        async ()=>{
            const response = await mePromise
            me.value = response?.data?.resource
            const jwt = localStorage.getItem('jwt')
            if(me.value === undefined && jwt !== null){
                localStorage.removeItem('jwt')
            }
        },
    )

router.beforeEach(async (to, from)=> {
    // to.path === '/' || to.path === '/welcome'  || to.path === '/start' || to.path.startsWith('/sign_in')
    if(to.path === '/' || to.path === '/welcome'  || to.path.startsWith('/sign_in')){
        return true
    }else{
        const jwt = localStorage.getItem('jwt')
        if(jwt === null){
            return 'sign_in'
        }else{
            return true
        }
        
    }
})

export const exit = () => {
    me.value = undefined
}
export const setMe = (value: User | undefined)=>{
    me.value = value
}

const app = createApp(App)
app.use(router)
app.mount('#app')
