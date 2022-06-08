<template>
  <Navbar/>
  <h1 class="title font-titulo font-bold">Roles de Usuario</h1>
  <!-- Header Rol  -->
  <div class="container mx-auto px-0 pb-24 pt-4">    
    <div class="flex flex-wrap ferromex-color p-1 rounded-lg">
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        Nombre:<input v-model="nombre" type="text" class="rounded text-black ml-2 md:w-20 2xl:w-44"/>
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        Estatus:  
        <select v-model="estatus" class="flex-none text-black rounded 2xl:w-44">
          <option :value="undefined">Seleccione una opción</option>
          <option v-for="(option ,index) in options" :key="index" :value="option">{{option}}</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        <button @click="buscar(nombre , estatus)" class="btn-buscar animacion">Buscar</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        <button @click="todos()" class="btn-buscar animacion">Todos</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 md:ml-32 2xl:ml-69">
        <button @click="abrir_modal_new_rol" class="btn-buscar animacion">Agregar Rol</button>
      </div>
    </div>
    <TablaRoles :infoRoles="roles"/>
    <div class="mt-20 -mb-14">
      <Paginacion :total-pages="totalPaginas" :total="100" :current-page="paginaActual" :has-more-pages="hasMorePages" @pagechanged="showMore"/>
    </div>
  </div>
  <!-- Modal Agregar Rol -->
  <Modal :show="userModal" @cerrarmodal="cerralmodalpadre">
    <div>
      <p class="text-gray-900 font-bold text-2xl -mt-8 mb-8 text-center">Agregar Nuevo Rol</p>     
      <div class="grid grid-cols-2 mt-2">
        <p class="text-sm mb-1 font-semibold text-gray-700 text-center sm:-ml-6">Nombre Rol</p>
        <input v-model="newRol.nombre" type="text" class="border mx-auto w-52 rounded-lg">
      </div>
      <div class="grid grid-cols-2 mt-2">
        <p class="text-sm mb-1 text-center font-semibold text-gray-700 mt-2 sm:-ml-6">Módulos</p>
        <Multiselect
          v-model="newRol.vistas" 
          label="text"
          mode="multiple"
          valueProp="value"
          placeholder="Seleccione las Plazas"                    
          :options="modulosExistentes"
          :close-on-select="false"
          class="w-52"
        /> 
      </div>      
      <div class="mt-10 text-center mx-auto mb-4">
        <button @click="craer_nuevo_rol" class="rounded-lg w-18 bg-ferromex text-white p-10">Guardar</button>
      </div>
    </div>
  </Modal>
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
import { onMounted, reactive, ref, toRefs } from 'vue';
import Modal from "../../components/Modal.vue"
const API = process.env.VUE_APP_URL_API_PRODUCCION
export default {
  components: {
    TablaRoles,
    Navbar,
    Multiselect,
    Footer,
    Spinner,
    Paginacion,
    Modal
  },
  setup(){
    
    
    const roles = ref([])//Constante que almacena el listado de roles que existen
    const userModal = ref(false) //Constante que permite abrir el modal para agregar un nuevo Rol
    const options = ref(['Activo', 'Inactivo'])//Constante que almacena las opciones de estatus que pueden seleccionar en el header
    const modalLoading = ref(false)//Constante que permite abrir el spinner para las pantallas de carga
    const modulosExistentes = ref([])//constante que contiene los modulos, para la asignación en los roles
    const totalPaginas = ref(0) //variable que indica el número total de páginas por resultado
    const paginaActual = ref(1) //variable que indica la página en la que estás dentro de la paginación, en la primer carga siempre es la página 1
    const hasMorePages = ref(true) //variable para poder cambiar de páginas con los botones
    const numRespuesta = ref(10)//Variable que indica el número de respuestas por página
    const newRol = reactive({ nombre: "", vistas: [] }) //constante reactiva que nos va a permitir generar un arreglo con los datos de los modulos a agregar al rol
    const header = reactive({ nombre: "", estatus: undefined })//Constante reactiva que almacena el nombre y estatus para realizar el filtro de busqueda
                        
    const abrir_modal_new_rol = () => { //Constante que permite abrir el modal de creación de roles
      userModal.value = true
      axios.get(`${API}/Ferromex/modules`)//Endpoint que trae todos los modulos que existen
      .then((result)=>{//Si el endpoint tiene una respuesta correcta
      console.log(result.data.content);
        for(let i=0; i<result.data.content.length; i++){ //recorremos la respuesta, y cada que recorremos sumamos un 1 para el siguiente rol
          modulosExistentes.value.push({'text':result.data.content[i].nameModule, 'value':result.data.content[i].id,})//asignamos los roles existentes a la variable roles, para mostrarlos en el multiselect
        }
      })
    }
    const cerralmodalpadre = (modal) => {//constante que emite el cierre del modal para agregar roles, y limpia los valores del modal
      userModal.value = modal
      newRol.nombre = ''
      newRol.vistas = [{}]
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
    function buscar (nombre, estatus){//Función que realiza la busqueda de los roles existentes, o uno en especificos
      modalLoading.value = true
      if(nombre == "")//Si no se ha escrito ningún nombre en el header, el valor de nombre será un espacio en blanco
        nombre = ' '
      if(estatus == undefined)//Si no se ha seleccionado ningún estatus en el header, el valor de estatus será un espacio en blanco
        estatus = ' '
      if(nombre == ' ' && estatus == ' ')//Si nombre y estatus es espacio en blanco, no se realizará ningúna busqueda, se quedará con la carga inicial
      {
        notify({//Notificación en la que indicamos que no se ha insertado ningún dato para buscar
          title:'Sin Información',
          text:'No hay datos para realizar la busqueda',
          type: 'warn'
        });
        modalLoading.value = false
      }else{//Si se manda un nombre o un estatus, o ambos, realizaremos la busqueda correspondiente
        roles.value = [] //Constante que contiene los roles se muestra en vacio para hacer una busqueda limpia, y no se queden datos en cache
        const ruta = encodeURI(`${API}/Identity/roles/${paginaActual.value}/${numRespuesta.value}/${nombre}/${estatus}`)
        console.log(ruta)
        axios.get(`${API}/Identity/roles`)//Llamada al endpoint que trae los roles existentes
        .then((result) => {//Si el endpoint tiene una respuesta correcta
          if(result.status == 200){//valida que el estatus de la respuesta sea 200 para saber que es una respuesta correcta y con contenido
            modalLoading.value = false//Cerramos el spinner de carga
            roles.value = result.data //asignamos los resultados que nos trajo el endpoint a la constante roles
          }
        }).catch((error)=>{//Si el endpoint tiene un erro en la respuesta
          console.log(error);//Mostramos en consola el error  que nos da el endpoint
          modalLoading.value = false //cerramos el spinner de carga
        })
      }
    }
    function todos (){//Función que trae todos los roles existentes
      roles.value = [] //Constante que contiene los roles se muestra en vacio para hacer una busqueda limpia, y no se queden datos en cache
      modalLoading.value = true//Abrimos el spinner de pantalla de carga
      header.nombre = ''//Damos el valor de vacio a la constante que almacena el nombre que se escribió en le header
      header.estatus = undefined//Damos el valor de undefined a la constante que almacena el estatus que seleccionamos en el header
      let nombreRuta = ' '//Creamos dos literal con un espacio en blanco para mandarla en la ruta
      let estatusRuta = ' '
      const ruta = encodeURI(`${API}/Identity/roles/${paginaActual.value}/${numRespuesta.value}/${nombreRuta}/${estatusRuta}`)//constante con la ruta codificada
      console.log(ruta)
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
      console.log(page);
        //axios.get(`${API}/UsuarioMonitoreo/${page}/${numRespuesta.value}/${nombre.value}/${estatus.value}`)
        //.then((res) => {
          //perfiles.value = []
          //habilitar.value = true
          //totalPaginas.value = res.data.numberPages
          //currentPage.value = res.data.now
          //res.data.body.forEach(() => {
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
          //});
        //});
    }

    onMounted(todos)

    return { roles, modulosExistentes, userModal, abrir_modal_new_rol, newRol, ...toRefs(header), options, craer_nuevo_rol, buscar, todos, modalLoading, totalPaginas, paginaActual, hasMorePages, numRespuesta, showMore, cerralmodalpadre }

  }, 
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
}
</style>
<style src="@vueform/multiselect/themes/default.css"></style>