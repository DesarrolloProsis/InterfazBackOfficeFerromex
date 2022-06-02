<template> 
  <div class="flex justify-between bg-nav">
    <div class="flex-none">
      <router-link to="/inicio" class="inline-block pl-5 pt-1 text-white text-xl" tag="div">
      <img class="logo inline rounded-full" src="~@/assets/ferromex.jpg">
      Ferromex 
      </router-link>
    </div>
    <span class="text-white mt-2">Bienvenido {{ nombre }}</span>
    <div class="flex-none -mt-2 animacion">
      <router-link class="" to="/" tag="div">
        <button class="" @click="logout()">
          <fa icon="arrow-right-from-bracket" class="w-10 h-8 mt-3 mr-2 text-white"/>
        </button>
      </router-link>
    </div>
  </div>
</template>
<script>
import Servicio from '../Servicios/Token-Services';//Se importa el servicio que nos permite tener la información del token
import { onMounted,ref } from 'vue'//se importa onMounted para que haga una devolución de una llamada que se hará al montar el componente
import axios from "axios";
import router from '../router';
export default{
  setup(){
    const nombre = ref('')//Constante que alamacena el nombre de usuario
    function logout (){//Función que cierra la sesión y elimina el token generadp
      axios.defaults.headers.common['Authorization'] = '' //Enviamos el token en la cabecera llamada Authorization porque todos los endpoints lo piden
      router.push('/')//Redirigimos al Login
    }
    function obtenerInfo() {//Función que obtine los datos del usuario
      let info = Servicio.obtenerInfoUser()//Literal que almacena la información del token
      nombre.value = info.name  //asignamos el nombre del usuario en la constante para mostarlo
    }
    onMounted(obtenerInfo) //Montamos la función obtenerInfo para poder tener la respuesta cuando se monta el componente

    return { nombre, logout, obtenerInfo }
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
