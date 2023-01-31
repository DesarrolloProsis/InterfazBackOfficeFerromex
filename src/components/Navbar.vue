<template> 
  <div class="flex justify-between bg-nav">
    <div class="flex-none">
      <router-link to="/inicio" class="inline-block pl-5 pt-1 text-white text-xl" tag="div">
      <img class="logo inline rounded-full" src="~@/assets/ferromex.jpg">
      Intermodal México
      </router-link>
    </div>
    <span class="text-white mt-2">Bienvenido {{ nombre.toUpperCase() }}</span>
    
    <div class="flex">
      <div class="-mt-2 animacion">
      <router-link class="" to="/parametros/14" tag="div">
          <fa icon="gear" class="w-12 h-8 mt-3 mr-2 text-white" :class="{'hidden': ocultarparametros}"/>
      </router-link>
      </div>
      <div class="-mt-2 animacion">
        <router-link class="" to="/" tag="div">
        <button class="" @click="logout()">
          <fa icon="arrow-right-from-bracket" class="w-12 h-8 mt-3 mr-2 text-white"/>
        </button>
      </router-link>
      </div>
    </div>
  </div>
</template>
<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION //constante que hace referencia a la ip donde está montada el API, se utiliza para hacer peticiones
import Servicio from '../Servicios/Token-Services';//Se importa el servicio que nos permite tener la información del token
import { onMounted,ref,inject } from 'vue'//se importa onMounted para que haga una devolución de una llamada que se hará al montar el componente
import router from '../router';
export default{
  setup(){
    const axios = inject('axios')
    const nombre = ref('')//Constante que alamacena el nombre de usuario
    const ocultarparametros = ref(false)
    function logout (){//Función que cierra la sesión y elimina el token generadp
      axios.defaults.headers.common['Authorization'] = '' //Enviamos el token en la cabecera llamada Authorization porque todos los endpoints lo piden
      router.push('/')//Redirigimos al Login
    }
    function obtenerInfo() {//Función que obtine los datos del usuario
      let info = Servicio.obtenerInfoUser()//Literal que almacena la información del token
      nombre.value = info.nombreCompleto  //asignamos el nombre del usuario en la constante para mostarlo
      axios.get(`${API}/Ferromex/modules?roleName=${info.role}`)//Conocemos los roles del usuario que entro a la plataforma
      .then((res)=>{
          let respuesta = res.data.content;
          let ids  = respuesta.map((x)=>{ //Obtenemos los id de de los modulos
            return x.id
          })
          if(ids.includes(14) == false) {//Si no contamos con el modulo id 14 no mostramos el engrane
            ocultarparametros.value = true
          }
        }
      )
      .catch()
    }
    onMounted(obtenerInfo) //Montamos la función obtenerInfo para poder tener la respuesta cuando se monta el componente

    return { nombre, logout, obtenerInfo,ocultarparametros }
  }
}
</script>
<style scoped>
.bg-nav {
  background-color: #000000;
  padding: 10px;
}
.btn-salir {
  color: white;
  padding: 0px 10px;
  width: 80px;
}
.btn-salir:focus {
  outline: none;
}
.logo{
  width: 45px;
  height: 45px;
}
</style>
