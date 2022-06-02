<template>
  <Navbar></Navbar>
  <div class="">
    <div class="mt-6 grid grid-cols-2 gap-4 place-items-center 2xl:mt-24 2xl:gap-10">
    <ModulosComp
      v-for="(modulo, index) in modulos"
      :key="index"
      :imagen="modulo.imagen"
      :ruta="modulo.ruta"
      :nombre="modulo.nombre"
    ></ModulosComp>
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
import { onMounted,ref } from 'vue' //Importamos onMounted para recibir una respuesta de una llamada cuando se monta el modulo, y ref para hacer referencia al tipo de dato que estamos utilizando y volvemos reactiva la constante
import axios from "axios";
export default {
  components: {
    Navbar,
    ModulosComp,
    Footer,
    Spinner
  },
  setup(){
    const modulos = ref([]) //Constante que va a almacenar el array de modulos que se van a mostrar
    const decoded = Servicio.obtenerInfoUser() //variable que obtiene la información del usuario
    const modalLoading = ref(false) //constante que habilita el spinner
    function obtenerModulos(){ //Función que nos va a permitir obtener los modulos que va a ver el rol asignado al usuario que inicio sesión
      let rol = decoded.role // literal local que obtiene el rol del usuario
      modalLoading.value = true //habilitamos el spinner para esperar a que cargue los modulos que podrá ver el rol
      axios.get(`${API}/Ferromex/modules?role=${rol}`) //enpoint que trae los modulos que puede ver el rol del usuario
      .then((result) => {
        let modules = result.data.content //literal que almacena el contenido o resuesta del endpoint
        let proxy = new Proxy(modules ,{ //literal que obtiene la información del evento proxy, que almacena la respuesta del endpoint
          get : function(target, property){
            return property === 'length' ?
              target.length :
              target[property];
          }
        });
      for(let i= 0; i<proxy.length; i++){ //asignamos los valores de los modulos correspondientes a cada rol
        modulos.value.push({'nombre':proxy[i].nameModule, 'imagen':proxy[i].image, 'ruta':proxy[i].route}) 
      }
      modalLoading.value = false //cerramos el spinner
      })
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