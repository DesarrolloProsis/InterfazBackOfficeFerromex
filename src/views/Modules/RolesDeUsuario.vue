<template>
  <Navbar/>
  <h1 class="title font-titulo font-bold">Roles de Usuario</h1>
    <!-- Modal Agregar Rol -->
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
          valueProp="value"
          placeholder="Seleccione las Plazas"                    
          :options="modulosExistentes"
          :close-on-select="false"
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
        Nombre:<input v-model="nombre" type="text" class="rounded text-black ml-2 md:w-20 2xl:w-44"/>
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        Estatus:  
        <select v-model="estatus" class="flex-none filter-style color-black rounded 2xl:w-44" name="select" placeholder="Selecciona">
          <option hidden selected>Seleccione </option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        <button @click="buscar(nombre,estatus)" class="btn-buscar animacion">Buscar</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        <button @click="buscar()" class="btn-buscar animacion">Todos</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 md:ml-32 2xl:ml-69">
        <button @click="abrir_modal_new_rol" class="btn-buscar animacion">Agregar Rol</button>
      </div>
    </div>
    <TablaRoles :infoRoles="roles"/>
    <div class="mt-20 -mb-14">
      <Paginacion :total-pages="totalPaginas" :total="100" :current-page="currentPage" :has-more-pages="hasMorePages" @pagechanged="showMore"/>
    </div>
  </div>
  <!-- MODAL CARGANDO -->
  <Spinner :modalLoading="modalLoading"/>
  <Footer/>
</template>

<script>
import TablaRoles from "../../components/Tabla-listaroles.vue";//Importamos el componente de la tabla que contiene las cabeceras que corresponden y contiene los datos para mostrar
import Paginacion from "../../components/Paginacion.vue" //Importamos el componente de la páginación
import Spinner from '../../components/Spinner.vue' //Importamos el componente del spinner para las pantallas de carga
import Navbar from "../../components/Navbar.vue";//Importamos el componente navbar para la navegación
import Footer from "../../components/Footer";//Importamos el componente Footer
import axios from 'axios';//Importamos axios, para poder hacer llamadas a endpoint 
import Multiselect from '@vueform/multiselect'//Importamos el componente multiselect para la selección de modulos a asignar
import { notify } from "@kyvg/vue3-notification";//Importamos el componente notify para mostrar las notifiaciones al usuario
import { onMounted,reactive, ref } from 'vue'
const API = process.env.VUE_APP_URL_API_PRODUCCION
export default {
  components: {
    TablaRoles,
    Navbar,
    Multiselect,
    Footer,
    Spinner,
    Paginacion
  },
  setup(){
    
    const nombre = ref('')//constamte qie almacena el nombre del rol que queremos buscar
    const estatus = ref('')//constante que almacena el estatus que queremos buscar
    const roles = ref([])//Constante que almacena el listado de roles que existen
    const userModal = ref(false) //Constante que permite abrir el modal para agregar un nuevo Rol
    //const habilitar = ref(false)
    const modalLoading = ref(false)//Constante que permite abrir el spinner para las pantallas de carga
    const modulosExistentes = ref([])//constante que contiene los modulos, para la asignación en los roles
    const totalPaginas = ref(0) //variable que indica el número total de páginas por resultado
    const currentPage = ref(1) //variable que indica la página en la que estás dentro de la paginación, en la primer carga siempre es la página 1
    const hasMorePages = ref(true) //variable para poder cambiar de páginas con los botones
    const numRespuesta = ref(10)//Variable que indica el número de respuestas por página
    const newRol = reactive({ nombre: "", vistas: [] }) //constante reactiva que nos va a permitir generar un arreglo con los datos de los modulos a agregar al rol
                        
    const abrir_modal_new_rol = () => { //Constante que permite abrir el modal de creación de roles
      userModal.value = !userModal.value
      axios.get(`${API}/Ferromex/modules`)//Endpoint que trae todos los modulos que existen
      .then((result)=>{//Si el endpoint tiene una respuesta correcta
      console.log(result.data.content);
        for(let i=0; i<result.data.content.length; i++){ //recorremos la respuesta, y cada que recorremos sumamos un 1 para el siguiente rol
          modulosExistentes.value.push({'text':result.data.content[i].nameModule, 'value':result.data.content[i].id,})//asignamos los roles existentes a la variable roles, para mostrarlos en el multiselect
        }
      })
    }
    const craer_nuevo_rol = async () => { //Funcion que inserta el nuevo rol
    let data = { //literal que guarda el nombre del rol, para mandarselo al endpoint en el body
      "roleName": newRol.nombre
    }
      axios.post(`${API}/Identity/addRoles`, data) //llamada al enpoint que inserta el rol en la base, se le envia data en body
      .then((result) => {//Si el endpoint funcionó correctamente
        modalLoading.value = true //Activamos el modalloading
        if(result.status == 204){//Validamos que la respuesta sea correcta
          let data = { //literal con la que guardamos el nombre del rol y los modulos que va a tener este
            "roleName": newRol.nombre,
            "modules": newRol.vistas //id de los modulos que se van a agregar
          }
          axios.post(`${API}/Ferromex/addRoleModules`, data) //llamada al endpoint que inserta los modulos al rol correspondiente
          .then((result)=>{
            if(result.status == 204)//Validamos que la respuesta sea correcta
            {
              modalLoading.value = false//Desactivamos el spinner
              notify({ type: 'success', title:'Rol creado', text: `Se creo correctamente el rol ${newRol.nombre}`});//Mostramos notificación de que se creo correctamente el rol
              newRol.vistas = []; newRol.nombre = "";//limpiamos los input del modal para agregar roles
              abrir_modal_new_rol()//Llamamos a la función que cierra el modal
            }
          }).catch((error) => {//Si el enpoint tiene algun error
            console.log(error);//Imprimimos el error en consola
            modalLoading.value = false//Desactivamos el spinner
            notify({ type: 'warning', title:'Rol no creado', text: `No se pudo insertar los modulos al rol ${newRol.nombre}`});//Mostramos nositificación de que no se creo el rol
            newRol.vistas = []; newRol.nombre = "";//limpiamos los input del modal para agregar roles
            abrir_modal_new_rol()//Llamamos a la función que cierra el modal
          })
        }
      }).catch((error) => {
        console.log(error);//Imprimimos el error en consola
        modalLoading.value = false//Desactivamos el spinner
        notify({ type: 'warning', title:'Rol no creado', text: `No se pudo crear el rol ${newRol.nombre}`});//Mostramos nositificación de que no se creo el rol
        newRol.vistas = []; newRol.nombre = "";//limpiamos los input del modal para agregar roles
        abrir_modal_new_rol()//Llamamos a la función que cierra el modal
      })
    }
    function buscar (nombre,estatus){//Función que realiza la busqueda de los roles existentes, o uno en especificos
      roles.value = [] //Constante que contiene los roles se muestra en vacio para hacer una busqueda limpia, y no se queden datos en cache
      console.log(nombre, estatus);
      modalLoading.value = true
      axios.get(`${API}/Identity/roles`)//Llamada al endpoint que trae los roles existentes
      .then((result) => {
        console.log(result);
        if(result.status == 200){//valida que el estatus de la respuesta sea 200 para saber que es una respuesta correcta y con contenido
          modalLoading.value = false//Cerramos el spinner de carga
          roles.value = result.data //asignamos los resultados que nos trajo el endpoint a la constante roles
        }
      }).catch((error)=>{
        console.log(error);//Mostramos en consola el error  que nos da el endpoint
        modalLoading.value = false //cerramos el spinner de carga
      })
    }
    function todos (){//Función que trae todos los roles existentes
      roles.value = [] //Constante que contiene los roles se muestra en vacio para hacer una busqueda limpia, y no se queden datos en cache
      modalLoading.value = true
      axios.get(`${API}/Identity/roles`)//Llamada al endpoint que trae los roles existentes
      .then((result) => {//Si el endpoint tiene una respuesta correcta
        if(result.status == 200){//valida que el estatus de la respuesta sea 200 para saber que es una respuesta correcta y con contenido
          modalLoading.value = false//Cerramos el spinner de carga
          roles.value = result.data //asignamos los resultados que nos trajo el endpoint a la constante roles
        }
      }).catch((error)=>{//Si el endpoint tiene un error en la respuesta
        console.log(error);//Mostramos en consola el error  que nos da el endpoint
        modalLoading.value = false //cerramos el spinner de carga
      })
    }
    function showMore(page){
        axios.get(`${API}/UsuarioMonitoreo/${page}/${numRespuesta.value}/${nombre.value}/${estatus.value}`)
        .then((res) => {
          //perfiles.value = []
          //habilitar.value = true
          totalPaginas.value = res.data.numberPages
          currentPage.value = res.data.now
          res.data.body.forEach(() => {
            /* let obj = {
                id: e.usuarioId,
                usuario: e.nombreUsuario,
                nombre: e.nombre,
                apellidoP: e.apellidoPaterno,
                apellidoM: e.apellidoMaterno,
                rol: e.rol,
                idrol: e.idRol,
                plazas: e.plazas,
                estatus: e.estatus,
            }; */
            //perfiles.value.push(obj);
          });
        });
    }

    onMounted(buscar)

    return { roles, modulosExistentes, userModal, abrir_modal_new_rol, newRol, craer_nuevo_rol, nombre, estatus, buscar, todos, modalLoading, totalPaginas, currentPage, hasMorePages, numRespuesta, showMore }

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