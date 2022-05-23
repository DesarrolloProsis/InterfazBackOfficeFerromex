<template>
  <Navbar/>
  <h1 class="title font-titulo font-bold">Roles de Usuario</h1>
    <!-- Modal Rol -->
  <div class="sticky inset-0 " :class="{'modal-container': userModal}">
    <div v-if="userModal" class="rounded-lg  justify-center border absolute inset-x-0 bg-white border-gray-400 w-69  mx-auto px-12 py-10 shadow-2xl mt-66">
      <p class="text-gray-900 font-bold text-2xl -mt-8 mb-8 text-center">Agregar Nuevo Rol</p>     
      <div class="grid grid-cols-2 mt-2">
        <p class="text-sm mb-1 font-semibold text-gray-700 sm:-ml-6">Nombre Rol</p>
        <input v-model="newRol.nombre" type="text" class="border rounded-lg">
      </div>
      <div class="grid grid-cols-2 mt-2">
        <p class="text-sm mb-1 font-semibold text-gray-700 mt-2 sm:-ml-6">Vistas</p>
        <Multiselect
          v-model="newRol.vistas" 
          label="text"
          mode="multiple"
          valueProp="alias"
          placeholder="Seleccione las Plazas"                    
          :options="optionRoles"
        /> 
      </div>      
      <div class="mt-5 text-center ml-6">
        <button @click="craer_nuevo_rol" class="botonIconBuscar">Guardar</button>
        <button @click="abrir_modal_new_rol" class="botonIconCancelar">Cancelar</button>
      </div>
    </div>
  </div>
  <!-- Header Rol  -->
  <div class="container mx-auto px-0 pb-24 pt-4">    
    <div class="flex flex-wrap ferromex-color p-1 rounded-lg">
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        Nombre:<input v-model="tag" type="text" class="rounded ml-2" />
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        Estatus:  
        <select v-model="estatus" class="flex-none filter-style color-black rounded" name="select" placeholder="Selecciona">
          <option hidden selected>Seleccione </option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        <button @click="buscar()" class="btn-buscar animacion">Buscar</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        <button @click="buscar()" class="btn-buscar animacion">Todos</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-56">
        <button @click="abrir_modal_new_rol" class="btn-buscar animacion">Agregar Rol</button>
      </div>
      <div class="flex-none my-auto font-md p-2 ml-3 w-66">
        <FilesDownload @download-api="downloadApi" class=""/>
      </div>
    </div>
    <TablaListaPerfiles :dataPerfiles="roles"/>
    <div class="mt-20 -mb-14">
      <Paginacion :total-pages="totalPaginas" :total="100" :current-page="currentPage" :has-more-pages="hasMorePages" @pagechanged="showMore"/>
    </div>
  </div>
  <!-- MODAL CARGANDO -->
  <Spinner :modalLoading="modalLoading"/>
  <Footer/>
</template>

<script>
import TablaListaPerfiles from "../../components/Tabla-listaperfiles";
import Paginacion from "../../components/Paginacion.vue"
import FilesDownload from '../../components/Files-descargar.vue'
import Spinner from '../../components/Spn.vue'
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer";
import axios from 'axios';
import Multiselect from '@vueform/multiselect'
import { notify } from "@kyvg/vue3-notification";
//import { onMounted, reactive, ref } from 'vue'
import { reactive, ref } from 'vue'
const API = process.env.VUE_APP_URL_API_PRODUCCION
export default {
  components: {
    TablaListaPerfiles,
    Navbar,
    Multiselect,
    Footer,
    Spinner,
    FilesDownload,
    Paginacion
  },
  setup(){
    
    const nombre = ref(null)
    const estatus = ref(null)
    const roles = ref([])
    const tramo = ref(null)
    const plaza = ref(null)   
    const userModal = ref(false)
    const habilitar = ref(false)
    const modalLoading = ref(false)
    //Paginacion
    const totalPaginas = ref(0) //variable que indica el número total de páginas por resultado
    const currentPage = ref(1) //variable que indica la página en la que estás dentro de la paginación, en la primer carga siempre es la página 1
    const hasMorePages = ref(true) //variable para poder cambiar de páginas con los botones
    const numRespuesta = ref(10)//Variable que indica el número de respuestas por página
    //addEmi
    const formato = ref('')
    const newRol = reactive({ nombre: "", vistas: [] })
    const optionRoles = [{text: 'Registro de Información de Telepeaje', alias: 'RegistroInformacion'},
                          {text: 'Mantenimiento Tags', alias: 'ManteniminetoTag'},
                          {text: 'Gestión de Usuarios', alias: 'GestionUsuarios'},
                          {text: 'Generación de Reportes', alias: 'GeneracionReportes'},
                        ]
    const buscar_roles = async () => { 
      axios.get(`${API}/CatalogoRoles/null/null/${plaza.value}`)
        .then((response) => {
            roles.value = response.data.body 
          }
        )
        .catch((error) => console.log(error))        
    }    
    //Nuevo Rol
    const abrir_modal_new_rol = () => userModal.value = !userModal.value    
    const craer_nuevo_rol = async () => {
      modalLoading.value = true
      //objeto para post api
      let objRol = {}
      objRol['nombreRol'] = newRol.nombre
      objRol['RegistroInformacion'] = false,
      objRol['ManteniminetoTag'] = false,
      objRol['GestionUsuarios'] = false,
      objRol['GeneracionReportes'] = false,
      objRol['dateStamp'] = new Date(),
      objRol['activo'] = true                 
      //Validamos que plazas selecciono el usuario y modificamos objRol            
      newRol.vistas.forEach(item => {       
          objRol[item] = true                   
      })
      axios.post(`${API}/CAtalogoRoles`, objRol)
        .then((response) => {
          modalLoading.value = false
          if(response.data.status == 'Ok'){
            notify({ type: 'success', title:'Rol creado', text: `Se creo correctamente el rol ${objRol.nombreRol}`});
            newRol.vistas = []; newRol.nombre = "";
            abrir_modal_new_rol()
            buscar_roles()   
          }       
        })
        .catch((error) => {
          console.log(error)
          abrir_modal_new_rol()
          notify({ type: 'warning', title:'Rol no creado', text: `No se pudo crear el rol ${objRol.nombreRol}`});
        })
    }
    function buscar (nombre,estatus){
      roles.value = []
      modalLoading.value = true
      axios.get(`${API}/CatalogoRoles/${nombre}/${estatus}/${plaza.value}`)
        .then((response) => {
            if((response.data.status == 'Ok') && (response.data.body.length > 0)){
              habilitar.value = true
              modalLoading.value = false
              roles.value = response.data.body 
            }else{
              notify({ type: 'warn', title:'Rol no creado', text: `No se encontró el Rol`});
            }
          }
        )
        .catch((error) => console.log(error))
    }
    function todos (){
      modalLoading.value = true
      nombre.value = null
      estatus.value = null
      axios.get(`${API}/CatalogoRoles/null/null/${plaza.value}`)
        .then((response) => {
            roles.value = response.data.body 
            modalLoading.value = false
          }
        )
        .catch((error) => console.log(error))
    }
    function recibir_tramo_plaza(value){
      tramo.value = value.tramo
      plaza.value = value.plaza
    }
    //onMounted(buscar_roles)
    return { roles, userModal, buscar_roles, abrir_modal_new_rol, newRol, optionRoles, craer_nuevo_rol, nombre, estatus, buscar, todos, recibir_tramo_plaza, habilitar, modalLoading, formato, totalPaginas, currentPage, hasMorePages, numRespuesta }

  }, 
};
</script>
<style scoped>
.modal-container{
    position: fixed;
    width: 100%;
    height: 100vh;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
}
.title {
  text-align: center;
  font-size: 25px;
  padding-top: 20px;
}
.bg-blue {
  background-color: #2c5282;
  padding: 10px 5px;
}
.filter-style {
  color: white;
  font-size: 16px;
  margin-left: 10px;
}
.filter-style input {
  margin-left: 20px;
  color: black;
  border: 1px solid black;
  padding: 0px 5px;
}
.ml-right {
  display: block;
  margin-left: auto;
  margin-right: 10px;
}
.btn-carriles {
  background-color: #017296;
  color: white;
  font-size: 15px;
  height: 100%;
  padding: 0px 5px;
  border: 1px solid black;
  border-radius: 5px;
}
.btn-carriles:focus {
  outline: 0;
}
.color-black {
  color: black !important;
}
.color-black:focus {
  outline: 0;
}
@media (max-width: 750px) {
  .title {
    font-size: 20px;
    padding-bottom: 20px;
  }
  .filter-style {
    padding-top: 5px;
    padding-bottom: 15px;
  }
  .btn-carriles {
    background-color: #017296;
    color: white;
    font-size: 15px;
    padding: 10px 5px;
    border: 1px solid black;
    border-radius: 5px;
  }
}
</style>
<style src="@vueform/multiselect/themes/default.css"></style>