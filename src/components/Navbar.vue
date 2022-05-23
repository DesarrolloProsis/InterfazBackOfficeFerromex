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
const API = process.env.VUE_APP_URL_API_PRODUCCION
import Servicio from '../Servicios/Token-Services';
//import jwt_decode from "jwt-decode"; <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket" />
import axios from "axios";
export default{
  data(){
    return {
      nombre:''
    }
  },
  beforeMount() {
    //Servicio.getCookie("Token")
    //let info = jwt_decode(Servicio.getCookie("Token"))
    let info = Servicio.obtenerInfoUser()
    this.nombre = info.nameid
  },
  methods:{
    logout: function(){      
      //if(Servicio.getCookie("Token")){
      if(Servicio.obtenerToken()){
        let info = Servicio.obtenerInfoUser() //jwt_decode(Servicio.getCookie("Token"))        
        try
        {
        document.cookie = "TipoUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC;" + "SameSite=None; Secure;";
        document.cookie = "Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;" + "SameSite=None; Secure;";
        this.$router.push('/')
        axios.post(`${API}/Login/LogOut/${info.UsuarioId}`)
        .then(() => {
            this.$router.push('/')
        })
        .catch((error) => console.log(error))
        }
        catch(error){
          console.log(error)
        }
      }
      else {        
        document.cookie = "TipoUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC;" + "SameSite=None; Secure;";
        document.cookie = "Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;" + "SameSite=None; Secure;";
        this.$router.push('/')
      }
    },
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
