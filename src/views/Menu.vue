<template>
  <Navbar></Navbar>
    <div class="container mx-auto px-auto pt-32 my-32">
      <div class="flex flex-wrap">
        <ModulosComp
        v-for="(modulo, index) in modulos"
        :key="index"
        :imagen="modulo.imagen"
        :ruta="modulo.ruta"
        :nombre="modulo.nombre"
        ></ModulosComp>
        <div v-if="modulos.length == 0" class=" mx-auto p-4 border border-gray-300 rounded-lg dark:border-gray-600 bg-gray-400 opacity-75" role="alert">
          <div class="flex items-center">
            <svg aria-hidden="true" class="w-5 h-5 mr-2 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
            <span class="sr-only text-white">Info</span>
            <h3 class="text-xl font-medium text-white">No cuentas con Modulos</h3>
            
          </div>
          <div class="mt-2 mb-4 text-sm text-white">
            <p class="mb-3 font-normal">Estás pueden ser las posibles causas:</p>
            <li class="mb-3 font-normal">Actualmente no cuentas con algun modulo activado.</li>
            <li class="mb-3 font-normal">Tu Rol a sido desactivado.</li>
            <p class="mb-3 font-bold">Consultalo con tu Supervisor</p>
          </div>
          <div class="flex w-full justify-end">
            <router-link class="" to="/" tag="div">
              <button class="text-white ferromex-color hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center border" @click="logout()">
                <fa icon="arrow-right-from-bracket" class="-ml-0.5 mr-2 h-4 w-4 text-white"/>
                Salir
              </button>
            </router-link>
          </div>
        </div>
      
    <Spinner :modalLoading="modalLoading"/>
  </div>
  </div>
  
  <Footer></Footer>
</template>

<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION //constante que hace referencia a la ip donde está montada el API, se utiliza para hacer peticiones
import Navbar from "../components/Navbar"; //Importamos el componnete Navbar para mostrar en la vista
import Spinner from '../components/Spinner.vue' //Importamos el componente spinner 
import ModulosComp from "../components/Moldulo-menu"; //Importamos el componente de Menú para poder poner cada uno de los modulos que tiene el rol
import Servicio from '../Servicios/Token-Services'; //Importamos el Servicio de Toke, para obtener información del usuario con base en el token
import Footer from "../components/Footer";//Importamos el footer para mostrar en la vista
import { onMounted,ref,inject } from 'vue' //Importamos onMounted para recibir una respuesta de una llamada cuando se monta el modulo, y ref para hacer referencia al tipo de dato que estamos utilizando y volvemos reactiva la constante
export default {
  components: {
    Navbar,
    ModulosComp,
    Footer,
    Spinner
  },
  setup(){
    const axios = inject('axios')
    const modulos = ref([]) //Constante que va a almacenar el array de modulos que se van a mostrar
    const decoded = Servicio.obtenerInfoUser() //variable que obtiene la información del usuario
    const modalLoading = ref(false) //constante que habilita el spinner
    function obtenerModulos(){ //Función que nos va a permitir obtener los modulos que va a ver el rol asignado al usuario que inicio sesión
      let rol = decoded.role // literal local que obtiene el rol del usuario
      modalLoading.value = true //habilitamos el spinner para esperar a que cargue los modulos que podrá ver el rol
      axios.get(`${API}/Ferromex/modules?roleName=${rol}`) //enpoint que trae los modulos que puede ver el rol del usuario
      .then((result) => {
        console.log(result);
        let modules = result.data.content //literal que almacena el contenido o resuesta del endpoint
        console.log(modules);
        let proxy = new Proxy(modules ,{ //literal que obtiene la información del evento proxy, que almacena la respuesta del endpoint
          get : function(target, property){
            return property === 'length' ?
              target.length :
              target[property];
          }
        });
      // for(let i= 0; i<proxy.length; i++){ //asignamos los valores de los modulos correspondientes a cada rol
      //   modulos.value.push({'nombre':proxy[i].nameModule, 'imagen':proxy[i].image, 'ruta':proxy[i].route}) 
      // }
      proxy.forEach((e) => {//reiteracion y comprobacion si es un submodulo
        if({}.hasOwnProperty.call(e,'parentModule') == false){
        modulos.value.push({'nombre':e.nameModule, 'imagen':e.image, 'ruta':e.route}) 
      }
      })
      modalLoading.value = false //cerramos el spinner
      }).catch((err)=>{console.log(err);})
    }

    onMounted(obtenerModulos)//Se monta la función para que desde un incio realice la obtención de los datos
    
    return {modulos, obtenerModulos, modalLoading}
  }
};
</script>
<style scoped>
.full-height {
  height: calc(100vh - 85px);
  min-height: 700px;
  margin-bottom: 10px;
}
@media (max-width: 765px) {
  .full-height {
    height: 100%;
    margin-bottom: 80px;
  }
}
</style>