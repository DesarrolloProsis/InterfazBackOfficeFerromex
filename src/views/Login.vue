<template>
<div class="login ">
  <!-- <Header/> -->
  <div class="flex ">
    <div id="" class="flex absolute justify-center items-center mx-auto h-12 w-screen min-700-imp -my-32 2xl:-my-0">
      <div class="absolute justify-end">
        <img class="img-centered rounded-full " src="~@/assets/Login/logoferromex.png" />
        <div class="bg-login-module h-96 " >
          <div class="error" v-if="message != ''">{{message}}</div><!-- Div que contiene el mensaje de error -->
          <div class="input-container">
            <fa icon="circle-user" class="w-10 h-8 mt-1 mr-2 text-red-700"/>
            <input id="username" v-model="user" class="input-field" type="text" placeholder="Usuario" />
          </div>
          <div class="input-container">
            <fa icon="key" class="w-10 h-6 mt-3 mr-2 text-red-700"/>
            <input id="password" v-model="pass" class="input-field" :type="tipoInput" placeholder="Contraseña" /><!-- input que contiene la contraseña -->
              <span @click="tipoInput == 'password' ? tipoInput = 'text' : tipoInput = 'password'" class="absolute right-0 mt-3 mr-14 cursor-pointer"><!-- Span que nos permite contener los iconos para visualizar y ocultar las contraseñas al dar click -->
                <fa v-if="tipoInput == 'password'" icon="eye" class="text-gray-600 w-5 h-5" /><!-- Icono de ojo para visualizar la contraseña -->
                <fa v-else  icon="eye-slash" class="text-gray-600 w-5 h-5" /><!-- Icono de ojo para ocultar la contraseña -->
              </span>
          </div>
          <button class="btn mt-12" @click="login()">Iniciar Sesión</button>
        </div>
      </div>
    </div>
  </div>
  <Footer titulocentro = "BOSQUE DE CIRUELOS NO 99,COL. BOSQUES DE LAS LOMAS, MÉXICO, D.F.,C.P. 11700" tituloderecha = "V 1.0" tituloizquierda = "" color = "red"/>  
</div>
<Spinner class="-mt-1" :modalLoading="modalLoading"></Spinner>
</template>
<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION//constante global que  contiene la cadena de conexión al API
import Footer from "../components/Footer-login.vue";//Importamos el componente Footer que es exclusivo para el login
import axios from "axios";//Importamos axios para poder hacer peticiones http al API
import serviceToken from '../Servicios/Token-Services'//Importamos el Servicio que nos va a permitir obtener, decodificar y utilizar el token
import { ref } from 'vue'//Importmos ref que nos permite que se devuelba un objeto reactivo y mutable, accedemos al valor ocupando .value
import router from '../router';//Importamos el router de vue para poder navejar hacia rutas existentes
import Spinner from "../components/Spinner.vue"//Importamos el componente de la pantalla de carga
export default {
  components: {
    Footer,
    Spinner
  },
  setup(){//Hook que se encarga de ser el constructor del componente
    const user = ref('')//Constante que almacena el valor del usuario insertado en el input
    const pass = ref('')//Constante que almacena el valor del password insetado en el input
    const message = ref('')//Constante que almacena el posible mensaje de error
    const modalLoading = ref(false)//Contante que funciona como bandera para activar o desactivar el spinner de pantalla de carga
    const tipoInput = ref('password')//Constante que indica el tipo de input para mostra u ocultar la contraseña

    function login() {//Función que genera el inicio de sesión
      let data = {//Literal que almacena el json que se enviará para iniciar sesión
        "grant_type": 'password',//Configuración que permite enviar las credenciales al servidor, si son valida nos regresa el token
        "username": this.user, //parametro que almacena el usuario insertado en el input
        "password": this.pass, //parametro que almacena el password insertado en el input
        "client_id": '', //identificador de publico de la aplicación
        "cliente_secret":''//es una contraseña que generamos con el servidor OAuth
      }
      if(data.username != '' && data.password != ''){//validación para que el username y el password no esté vacio
        modalLoading.value = true//Activamos la bandera que abre el spinner de la pantalla de carga
        axios.post(`${API}/identity/login`, data) //Se consume el endpoint, se le madna un JSON con los datos necesarios
        .then((result) => { //Si el endpoint tiene una respuesta correcta
          message.value = ''//Dejamos vacio el mensaje de error
          serviceToken.guardarToken(result.data.access_token) //Guardamos el token utiizando un servicio
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + result.data.access_token //Enviamos el token en la cabecera llamada Authorization porque todos los endpoints lo piden
          router.push('/inicio') //Enviamos la página al incio
          modalLoading.value = false//Desactivamos la bandera que abre el spinner de la pantalla de carga
        }).catch((error) => {//SI el endpoint tiene una respuesta con error
          console.log(error.request.response);//Mostramos el error en la consola
          message.value ="Error, verifica tus datos o intentalo más tarde."//Damos un mensaje de error en la interfaz
          modalLoading.value = false//Desactivamos la bandera que abre el spinner de la pantalla de carga
        })
      }else{//Validación si es que el usuario no inserto algún campo
        message.value ="Los campos Usuario y COntraseña son obligatorios."//Damos un mensaje de error en la interfaz
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
