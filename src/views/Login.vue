<template>
<div class="login ">
  <!-- <Header/> -->
  <div class="flex h-screen  min-700">
    <div id="" class="flex absolute justify-center items-center mx-auto h-12 w-screen min-700-imp">
      <div class="absolute justify-end ">
        <!-- <p id="login-title" class="font-titulo font-bold">Monitoreo de Pagos Electrónicos</p> -->
        <img class="img-centered rounded-full " src="~@/assets/Login/logoferromex.png" />
        <div class="bg-login-module" style="max-width: 800px; margin: auto">
          <div class="error" v-if="mensaje != ''">
              {{mensaje}}
          </div>
          <div class="input-container">
            <img class="w-10 h-10 mt-1 mr-2 transform -rotate-180" src="~@/assets/Login/iniciar-sesion.png" />
            <input id="username" v-model="user" class="input-field" type="text" placeholder="Usuario" />
          </div>
          <div class="input-container">
            <img class="w-10 h-10 mt-1 mr-2" src="~@/assets/Login/password.png" />            
            <input id="password" v-model="pass" class="input-field" type="password" placeholder="Contraseña" />
          </div>
          <button class="btn mt-12" @click="login()">Iniciar Sesión</button>
        </div>
      </div>
    </div>
    <div id="login-bg" class=" hidden md:block"></div>
  </div>
  <Footer 
    titulocentro = "BOSQUE DE CIRUELOS NO 99,COL. BOSQUES DE LAS LOMAS, MÉXICO, D.F.,C.P. 11700"
    tituloderecha = "V 2.0.5"
    tituloizquierda = ""
    color = "red"
  />  
</div>
</template>

<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION
import Footer from "../components/Footer-login.vue";
import axios from "axios";
import serviceToken from '../Servicios/Token-Services'
//import jwt_decode from "jwt-decode";
export default {

  components: {
    Footer,
  },
  props: {
    msg: String,
  },
  data(){
    return{
      user:"",
      pass:"",
      mensaje:""
    }
  },
  methods: {
    login: function() {
      //document.cookie = "TipoUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC;" + "SameSite=None; Secure;";
      //document.cookie = "Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;" + "SameSite=None; Secure;";
      //this.user = document.getElementById("username").value;
      //this.pass = document.getElementById("password").value;
      this.mensaje = ""
      const data = {
        "Usuario": this.user,
        "Password": this.pass
      }
      if(data.Usuario != "" &&  data.Password != ""){
        axios.post(`${API}/Login`, data)
        .then((result) => {
          this.mensaje =""
          serviceToken.guardarToken(result.data.body)
          this.$router.push('/inicio')
        })
        .catch(()=>{
          this.mensaje="Error, verifica tus datos o intentalo más tarde."
        })
      }else{
        this.mensaje = "Escribe tu Usuario y Contraseña."
      }
    },
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
  min-height: 100vh;
}

.bg-login-module {
  background-color: #f5fafd;
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
