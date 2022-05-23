import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'
import router from './router'
import './index.css'
import Notification from '@kyvg/vue3-notification'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";



library.add(fas);
createApp(App)
.use(router)
.use(Notification)
.component('fa', FontAwesomeIcon)
.mount('#app')

