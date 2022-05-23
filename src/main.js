import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'
import router from './router'
import './index.css'
import Notification from '@kyvg/vue3-notification'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'



library.add(fas,far,fab);
createApp(App)
.use(router)
.use(Notification)
.component('fa', FontAwesomeIcon)
.mount('#app')

