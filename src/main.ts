import { routes } from './config/routes';
import { computed, createApp, ref } from 'vue'
import { App } from './App'
import { createRouter } from 'vue-router'
import { history } from './shared/history';
import '@svgstore';
import { mePromise, refreshMe, fetchMe } from './shared/me';

const router = createRouter({ history, routes })

export const me = ref<User>()

fetchMe().then(async ()=>{
    const response = await mePromise
    me.value = response?.data.resource
    console.log(me.value)
})
export const exit = () => {
    me.value = undefined
}
export const setMe = (value: User | undefined)=>{
    me.value = value
}

router.beforeEach(async (to, from)=> {
    // to.path === '/' || to.path === '/welcome'  || to.path === '/start' || to.path.startsWith('/sign_in')
    if(to.path === '/' || to.path === '/welcome'  || to.path.startsWith('/sign_in')){
        return true
    }else{
        const path = mePromise!.then(
            () => true,
            () => '/sign_in'
        )
        return path
    }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
