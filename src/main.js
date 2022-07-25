import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'
import router from './router'
import './index.css'
import Notification from '@kyvg/vue3-notification'
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import axios from 'axios'
import VueAxios from 'vue-axios'

var token = localStorage.getItem('token')
if(token){
    var tokenenviar = 'Bearer ' + token.replace(/['"]+/g, '')
    axios.defaults.headers.common['Authorization'] = tokenenviar;
}


library.add(fas,far,fab);
const app = createApp(App);
app.use(router)
app.use(Notification)
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)
app.component('fa', FontAwesomeIcon)
app.mount('#app')

