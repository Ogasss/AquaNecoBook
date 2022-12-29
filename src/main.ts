import { routes } from './config/routes';
import { createApp } from 'vue'
import { App } from './App'
import { createRouter } from 'vue-router'
import { history } from './shared/history';
import '@svgstore';
import { http } from './shared/Http';

const router = createRouter({ history, routes })

router.beforeEach(async (to, from)=> {
    if(to.path === '/' || to.path === '/welcome' || to.path.startsWith('/sign_in')){
        return true
    }else{
        await http.get('/me').catch(() => {
         return '/sign_in?return_to='+ to.path
        })
        return true
    }
    // beforeEnter: async (to, from, next) => {
    //   await http.get('/me').catch(() => {
    //     next('/sign_in?return_to='+ to.path)
    //   })
    //   next()
    // },  
})


const app = createApp(App)
app.use(router)
app.mount('#app')
