<template>
<div class="login ">
  <!-- <Header/> -->
  <div class="flex ">
    <div id="" class="flex absolute justify-center items-center mx-auto h-12 w-screen min-700-imp -my-32 2xl:-my-0">
      <div class="absolute justify-end">
        <img class="img-centered rounded-full " src="~@/assets/Login/logoferromex.png" />
        <div class="bg-login-module h-96 " >
          <div class="error" v-if="message != ''">{{message}}</div>
          <div class="input-container">
            <fa icon="circle-user" class="w-10 h-8 mt-1 mr-2 text-red-700"/>
            <input id="username" v-model="user" class="input-field" type="text" placeholder="Usuario" />
          </div>
          <div class="input-container">
            <fa icon="key" class="w-10 h-6 mt-3 mr-2 text-red-700"/>
            <input id="password" v-model="pass" class="input-field" :type="tipoInput" placeholder="Contraseña" />
              <span @click="tipoInput == 'password' ? tipoInput = 'text' : tipoInput = 'password'" class="absolute right-0 mt-3 mr-14 cursor-pointer">
                <fa v-if="tipoInput == 'password'" icon="eye" class="text-gray-600 w-5 h-5" />
                <fa v-else  icon="eye-slash" class="text-gray-600 w-5 h-5" />
              </span>
          </div>
          <button class="btn mt-12" @click="login()">Iniciar Sesión</button>
        </div>
      </div>
    </div>
  </div>
  <Footer titulocentro = "BOSQUE DE CIRUELOS NO 99,COL. BOSQUES DE LAS LOMAS, MÉXICO, D.F.,C.P. 11700" tituloderecha = "V 2.0.5" tituloizquierda = "" color = "red"/>  
</div>
<Spinner class="-mt-1" :modalLoading="modalLoading"></Spinner>
</template>
<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION//constante global que 
import Footer from "../components/Footer-login.vue";
import axios from "axios";
import serviceToken from '../Servicios/Token-Services'
import { ref } from 'vue'
import router from '../router';
import Spinner from "../components/Spinner.vue"
export default {

  components: {
    Footer,
    Spinner
  },
  props: {
    msg: String,
  },
  setup(){
    const user = ref('')//Constante que almacena el valor del usuario insertado en el input
    const pass = ref('')//Constante que almacena el valor del password insetado en el input
    const message = ref('')//Constante que almacena el posible mensaje de error
    const modalLoading = ref(false)
    const tipoInput = ref('password')

    function login() {//Función que genera el inicio de sesión
      let data = {//Literal que almacena el json que se enviará para iniciar sesión
        "grant_type": 'password',
        "username": this.user, //parametro que almacena el usuario insertado en el input
        "password": this.pass, //parametro que almacena el password insertado en el input
        "client_id": '', //identificador de publico de la aplicación
        "cliente_secret":''//es una contraseña que generamos con el servidor OAuth
      }
      if(data.username != '' && data.password != ''){//validación para que el username y el password no esté vacio
        modalLoading.value = true
        axios.post(`${API}/identity/login`, data) //Se consume el endpoint, se le madna un JSON con los datos necesarios
        .then((result) => { 
          message.value = ''
          serviceToken.guardarToken(result.data.access_token) //Guardamos el token utiizando un servicio
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + result.data.access_token //Enviamos el token en la cabecera llamada Authorization porque todos los endpoints lo piden
          router.push('/inicio') //Enviamos la página al incio
          modalLoading.value = false
        }).catch((error) => {
          console.log(error);
          message.value ="Error, verifica tus datos o intentalo más tarde."
          modalLoading.value = false
        })
      }else{//Validación si es que el usuario no inserto algún campo
        message.value ="Los campos Usuario y COntraseña son obligatorios."
      }
    }
    return { user, pass, message, modalLoading, tipoInput, login} //Regreasamos las const y las funciones que utilizamos en la vista
  }
};
</script>
<style scoped>
.figura {
  
  width: 79vh;
  height: 100vh;
  /* margin-left: 795px; */
  background-image: radial-gradient(ellipse farthest-corner at 45px 30px , rgba(255, 255, 255, 0) 69%, rgba(44, 82, 130, 1) 0%);
  
}
@media (max-width:1024px){
  #min-figura{
    display: none;
  }
}
.error{
  background-color: #f5b7b1;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 10px;
  color:  #c0392b ;
}
.min-700 {
  min-height: 700px;
}

.min-700-imp {
  min-height: 700px !important;
}

#login-title {
  text-align: center;
  font-size: 28px;
}

@media (max-width:1024px) {
  #login-title {
    text-align: center;
    font-size: 23px;
  }
  #min-figura{
    visibility: hidden;
  }
}
#login-form {
  background-color: #ddd8d8;
}

.bg-login-module {
  background-color: white;
  padding: 100px 50px;
  border-radius: 10px;
  
}

.input-container {
  display: -ms-flexbox;
  /* IE10 */
  display: flex;
  width: 100%;
  margin-bottom: 15px;
}

.icon {
  padding-right: 5px;
  color: blue;
  min-width: 50px;
  text-align: center;
}

.input-field {
  width: 100%;
  padding: 10px;
  outline: none;
  border-bottom: 1px solid black;
  border-radius: 5px;
}

/* Set a style for the submit button */
.btn {
  background-color: #BB2028;
  color: white;
  padding: 15px;
  border: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
  border-radius: 10px;
}

.btn:focus {
  outline: 0;
}

.btn:hover {
  opacity: 1;
}

.img-centered {
  display: block;
  margin: auto;
  width: 130px;
  transform: translateY(50px);
}

@media (max-width:1024px) {
  .img-centered {
    display: block;
    margin: auto;
    width: 110px;
    transform: translateY(50px);
  }
}
</style>
