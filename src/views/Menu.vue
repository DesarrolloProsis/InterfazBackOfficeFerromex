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
  </div>
  </div>
  
  <Footer></Footer>
</template>

<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION //constante que hace referencia a la ip donde está montada el API, se utiliza para hacer peticiones
import Navbar from "../components/Navbar";
import ModulosComp from "../components/Moldulo-menu";
import Servicio from '../Servicios/Token-Services';
import Footer from "../components/Footer";
import { onMounted,ref } from 'vue'
import axios from "axios";
export default {
  components: {
    Navbar,
    ModulosComp,
    Footer,
  },
  setup(){
    const modulos = ref([]) //Constante que va a almacenar el array de modulos que se van a mostrar
    const decoded = Servicio.obtenerInfoUser()
    function obtenerModulos(){ //Función que nos va a permitir obtener los modulos que va a ver el rol asignado al usuario que inicio sesión
      let rol = decoded.role
      axios.get(`${API}/Ferromex/modules?role=${rol}`)
      .then((result) => {
        console.log(result);
        //modulos.value.push(result.data.content[0])
        //console.log(modulos.value);
        let modules = result.data.content
        let proxy = new Proxy(modules ,{
          get : function(target, property){
            return property === 'length' ?
              target.length :
              target[property];
          }
        });
      for(let i= 0; i<proxy.length; i++){
        modulos.value.push({'nombre':proxy[i].nameModule, 'imagen':proxy[i].image, 'ruta':proxy[i].route}) 
      }
      


      })
    }

    onMounted(obtenerModulos)
    
    return {modulos, obtenerModulos}
  }
  /* data() {
    return {
      modulos:[] */

      /* modulos: [
        {
          titulo: "Registro de información de Telepeaje",
          imagen: "Menu/registro-informacion.png",
          ruta: "/inicio/registro-informacion-telepeaje",
          nombre:"Registro De Informacion De Telepeaje",
        },
        {
          titulo: "Mantenimiento de Tag`s",
          imagen: "Menu/mantenimiento-tag.png",
          ruta: "/inicio/mantenimiento-tag",
          nombre:"Mantenimiento de Tag`s",
        },
        {
          titulo: "Gestión de usuarios",
          imagen: "Menu/gestion-usuarios.png",
          ruta: "/gestion-usuarios",
          nombre:"Gestión de usuarios",
        },
        {
          titulo: "Generación de Reportes",
          imagen: "Menu/generacion-reportes.png",
          ruta: "/generacion-reportes",
          nombre:"Generación de Reportes",
        },
      ], 
    };
  },*/

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