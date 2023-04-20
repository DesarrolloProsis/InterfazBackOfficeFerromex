<template>
  <Navbar/>
  <h1 class="title font-titulo ml-24 font-bold">Actividad de Usuario</h1>
  <!-- Header Rol  -->
  <div class="container mx-auto px-0 pb-2 pt-4">    
    <div class="flex flex-wrap ferromex-color p-1 rounded-lg">
      <div class="flex-none my-auto text-white font-md p-2 ml-1">
        Día:<input v-model="objSearch.dia" type="date" class="rounded text-black ml-2 md:w-20 2xl:w-20"/>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-1">
        Mes:<input v-model="objSearch.mes" type="month" class="rounded text-black ml-2 md:w-20 2xl:w-20"/>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-1">
        Semana:<input v-model="objSearch.semana" type="week" class="rounded text-black ml-2 md:w-20 2xl:w-20"/>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-1">
        Nombre:<input v-model="objSearch.nombre" type="text" class="rounded ml-2 text-black 2xl:w-20" />
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-1">
        Perfil:
        <select v-model="objSearch.rol" class="rounded ml-2 text-black 2xl:w-20">
          <option value="" >Seleccione un Perfil</option>
          <option :value="rol.nombreRol" v-for="(rol, key) in roles" :key="key">{{ rol.nombreRol }}</option>

        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-1">
        Acción:
        <select v-model="objSearch.accion" class="rounded ml-2 text-black 2xl:w-20">
          <option value="" >Seleccione una Acción</option>
          <option value="1">Añadir Rol</option>
          <option value="2">Actualizar Estatus de Rol</option>
          <option value="3">Añadir Modulo</option>          
          <option value="4">Eliminar Modulo</option>
          <option value="5">Actualizar Rol</option>
          <option value="6">Crear Usuario</option>
          <option value="7">Actualizar Estatus de Usuario</option>
          <option value="8">Actualizar Nombre de Usuario</option>
          <option value="9">Actualizar Contraseña</option>
          <option value="10">Añadir Tag</option>
          <option value="11">Actualizar Estatus de Tag</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        Resultados:
        <select @change="buscar_actividad(objSearch.numeroDeFilas)" v-model="objSearch.numeroDeFilas" class="text-gray-800 w-16 rounded">
          <option value="10">10</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        <button @click="buscar_actividad()" class="btn-buscar animacion">Buscar</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-1">
        <button @click="buscar_actividad_full()" class="btn-buscar animacion">Todos</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-1">
        <button @click="descargar_pdf_actividades()" class="btn-buscar animacion">Descargar</button>
      </div>
    </div>
    <div>
      <TablaActividad :infoActividad="infoActividades"/>
    </div>
    <div class="ml-20">
      <Paginacion :total-pages="numeroTotalPaginas" :current-page="objSearch.paginaActual" :has-more-pages="true" @pagechanged="cambiar_pagina"/>
    </div>
  </div>
  <!-- MODAL CARGANDO -->
  <Spinner :modalLoading="modalLoading"/>
  <Spinner :modalLoading="loading"/>
  <Footer/>
</template>

<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION
import TablaActividad from "../../components/Tabla-actividad.vue"//Importamos el componente de la tabla que contiene las cabeceras que corresponden y contiene los datos para mostrar
import Paginacion from "../../components/Paginacion.vue" //Importamos el componente de la páginación
import Spinner from '../../components/Spinner.vue' //Importamos el componente del spinner para las pantallas de carga
import Navbar from "../../components/Navbar.vue";//Importamos el componente navbar para la navegación
import Footer from "../../components/Footer";//Importamos el componente Footer
import { onMounted, reactive, ref, inject } from 'vue'
import { file }  from '../../Servicios/Files-Service'
export default {
  components: {
    TablaActividad,
    Navbar,
    Footer,
    Spinner,
    Paginacion,
  }, 
  setup() {
    const { xml_hhtp_request, loading } = file();
    let roles = ref([])
    let modalLoading = ref(false)
    let numeroTotalPaginas = ref(0)
    let infoActividades = ref([])
    let objSearch = reactive({
      paginaActual: 1,
      numeroDeFilas: 10,
      dia: "",
      semana: "",
      mes: "", 
      nombre: "",
      rol: "",
      accion: ""

    })
    const axios = inject('axios')    
  
    function cargar_datos(){
      axios.get(`${API}/Identity/roles/%20/%20/%20/%20`)
      .then((result) => {                
        roles.value = result.data.roles
      })
      .catch((err)=>{console.log(err);})
    }

    function buscar_actividad(numeroPaginas){

      if(numeroPaginas != undefined){
        objSearch.numeroDeFilas = numeroPaginas
      }


      let whiteSpace = "%20"
      modalLoading.value = true
      objSearch.paginaActual = 1
      infoActividades.value = []
      axios.get(`${API}/Ferromex/ActividadUsuarioCount/${objSearch.dia != "" ? objSearch.dia : whiteSpace}/${objSearch.semana != "" ? objSearch.semana : whiteSpace}/${objSearch.mes != "" ? objSearch.mes : whiteSpace}/${objSearch.nombre != "" ? objSearch.nombre : whiteSpace}/${objSearch.rol != "" ? objSearch.rol : whiteSpace}/${objSearch.accion != "" ? objSearch.accion : whiteSpace}`)
      .then((result) => {               
        numeroTotalPaginas.value = Math.ceil(result.data.content / objSearch.numeroDeFilas)        
      })
      .catch((err)=>{console.log(err); modalLoading.value = false})
      axios.get(`${API}/Ferromex/ActividadUsuario/${objSearch.paginaActual}/${objSearch.numeroDeFilas}/${objSearch.dia != "" ? objSearch.dia : whiteSpace}/${objSearch.semana != "" ? objSearch.semana : whiteSpace}/${objSearch.mes != "" ? objSearch.mes : whiteSpace}/${objSearch.nombre != "" ? objSearch.nombre : whiteSpace}/${objSearch.rol != "" ? objSearch.rol : whiteSpace}/${objSearch.accion != "" ? objSearch.accion : whiteSpace}`)
      .then((result) => {               
        infoActividades.value = result.data.content
        modalLoading.value = false
        
      })
      .catch((err)=>{console.log(err); modalLoading.value = false})      
    }

    function cambiar_pagina(pagina){      
      let whiteSpace = "%20"
      infoActividades.value = []
      modalLoading.value = true
      objSearch.paginaActual = pagina
      axios.get(`${API}/Ferromex/ActividadUsuario/${objSearch.paginaActual}/${objSearch.numeroDeFilas}/${objSearch.dia != "" ? objSearch.dia : whiteSpace}/${objSearch.semana != "" ? objSearch.semana : whiteSpace}/${objSearch.mes != "" ? objSearch.mes : whiteSpace}/${objSearch.nombre != "" ? objSearch.nombre : whiteSpace}/${objSearch.rol != "" ? objSearch.rol : whiteSpace}/${objSearch.accion != "" ? objSearch.accion : whiteSpace}`)
      .then((result) => {                
        infoActividades.value = result.data.content
        modalLoading.value = false
        
      })
      .catch((err)=>{console.log(err); modalLoading.value = false})
    }

    function buscar_actividad_full(){      
      let whiteSpace = "%20"
      infoActividades.value = []
      modalLoading.value = true      
      objSearch.paginaActual = 1 
      objSearch.numeroDeFilas = 10 
      objSearch.dia = ""
      objSearch.semana = "" 
      objSearch.mes = ""
      objSearch.nombre = "" 
      objSearch.rol = "" 
      objSearch.accion = "" 

      axios.get(`${API}/Ferromex/ActividadUsuarioCount/${objSearch.dia != "" ? objSearch.dia : whiteSpace}/${objSearch.semana != "" ? objSearch.semana : whiteSpace}/${objSearch.mes != "" ? objSearch.mes : whiteSpace}/${objSearch.nombre != "" ? objSearch.nombre : whiteSpace}/${objSearch.rol != "" ? objSearch.rol : whiteSpace}/${objSearch.accion != "" ? objSearch.accion : whiteSpace}`)
      .then((result) => {     
        if(result.data.content > objSearch.numeroDeFilas)     
          numeroTotalPaginas.value = Math.ceil(result.data.content / objSearch.numeroDeFilas)  
        else
          numeroTotalPaginas.value = 1
      })
      .catch((err)=>{console.log(err); modalLoading.value = false})

      axios.get(`${API}/Ferromex/ActividadUsuario/${objSearch.paginaActual}/${objSearch.numeroDeFilas}/${objSearch.dia != "" ? objSearch.dia : whiteSpace}/${objSearch.semana != "" ? objSearch.semana : whiteSpace}/${objSearch.mes != "" ? objSearch.mes : whiteSpace}/${objSearch.nombre != "" ? objSearch.nombre : whiteSpace}/${objSearch.rol != "" ? objSearch.rol : whiteSpace}/${objSearch.accion != "" ? objSearch.accion : whiteSpace}`)
      .then((result) => {        
        infoActividades.value = result.data.content
        modalLoading.value = false      
      })
      .catch((err)=>{console.log(err);})
    }

    function descargar_pdf_actividades(){
      let whiteSpace = "%20"
      let ruta = `${API}/Ferromex/Download/pdf/reporteActividadUsuario/${objSearch.dia != "" ? objSearch.dia : whiteSpace}/${objSearch.semana != "" ? objSearch.semana : whiteSpace}/${objSearch.mes != "" ? objSearch.mes : whiteSpace}/${objSearch.nombre != "" ? objSearch.nombre : whiteSpace}/${objSearch.rol != "" ? objSearch.rol : whiteSpace}/${objSearch.accion != "" ? objSearch.accion : whiteSpace}`
      xml_hhtp_request(ruta, 2, "ActividadUsuario.pdf")
    }

    onMounted([cargar_datos, buscar_actividad_full])
  
    return  { infoActividades, numeroTotalPaginas, objSearch, roles, modalLoading,loading, buscar_actividad, buscar_actividad_full, cambiar_pagina, descargar_pdf_actividades }
  }
};
</script>
<style scoped>
.bg-ferromex {
  background-color: #BB2028;
  padding: 10px 5px;
}
.title {
  text-align: center;
  font-size: 25px;
  padding-top: 20px;
}
@media (max-width: 750px) {
  .title {
    font-size: 20px;
    padding-bottom: 20px;
  }
}
</style>
<style src="@vueform/multiselect/themes/default.css"></style>