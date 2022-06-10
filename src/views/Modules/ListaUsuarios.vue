<template>
  <Navbar/>
  <!--  -->
  <h1 class="title font-titulo font-bold">Lista de Usuarios</h1>
  <div class="container mx-auto px-0 pb-24 pt-4">
    <div class="flex flex-wrap ferromex-color p-1 rounded-lg">
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        Nombre:<input v-model="nombre" type="text" class="rounded ml-2 text-black" />
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        Estatus:  
        <select v-model="estatus" class="flex-none filter-style color-black rounded" name="select" placeholder="Selecciona">
          <option :value="undefined">Seleccione un estatus</option>
          <option v-for="(option ,index) in options" :key="index" :value="option">{{option}}</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        <button @click="buscar(nombre,estatus)" class="btn-buscar animacion">Buscar</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-6">
        <button @click="todos()" class="btn-buscar animacion">Todos</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 md:ml-32 2xl:ml-69">
        <button @click="abrirModal" class="btn-buscar animacion">Agregar Usuario</button>
      </div>
    </div>
    <!-- <TablaListaUsuarios @refrescarTabla="refrescar_tabla" :dataUsuarios="usuarios" /> -->
    <TablaListaUsuarios :dataUsuarios="usuarios" />
    <div class="-mt-2 -mb-14">
      <Paginacion :total-pages="totalPaginas" :total="100" :current-page="paginaActual" :has-more-pages="hasMorePages" @pagechanged="showMore"/>
    </div>
  </div>
  <!-- MODAL CREAR USUARIO -->
  <div class="sticky inset-0 " :class="{'modal-container': modalAgregar}">
    <div v-if="modalAgregar" class="rounded-lg  justify-center border absolute inset-x-0 bg-white border-gray-400 w-69  mx-auto px-12 py-10 shadow-2xl mt-60">
      <p class="text-gray-900 font-bold text-2xl -mt-8 mb-8 text-center">Agregar Nuevo Usuario</p>
      <div class="grid grid-cols-2 mt-2">
        <p class="text-sm mb-1 font-semibold text-gray-700 sm:-ml-6">Nombre(s) *</p>
        <input v-model="usuario.nombre" type="text" class="border rounded-lg">
        <p class="text-sm mb-1 font-semibold text-gray-700 mt-2 sm:-ml-6">Apellidos*</p>
        <input v-model="usuario.apellidos" type="text" class="border rounded-lg">
        <p class="text-sm mb-1 font-semibold text-gray-700 mt-2 sm:-ml-6">Contraseña *</p>
        <input v-model="usuario.pass" type="text" class="border rounded-lg">
        <p class="text-sm mb-1 font-semibold text-gray-700 mt-2 sm:-ml-6">Rol *</p>
        <Multiselect
          v-model="usuario.rol"
          placeholder="Seleccione un Rol"
          :searchable="true"
          :options="roles"
          :close-on-select="true"
        /> 
      </div>
      <div class="mt-5 text-center ml-6">
        <button @click="guardar" class="botonIconBuscar">Guardar</button>
        <button @click="cancelar(), modalAgregar= false" class="botonIconCancelar">Cancelar</button>
      </div>
    </div>
  </div>
  <!-- MODAL CARGANDO -->
  <Spinner :modalLoading="modalLoading"/>
  <Footer/>
</template>
<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION//Constante que alamcena la cadena de conexión para la API
import TablaListaUsuarios from "../../components/Tabla-listausuarios";//Componente que contiene la tabla con la información de los usuarios
import Navbar from "../../components/Navbar.vue";//Importamos el componente Navbar para mostrar en la vista
import Footer from "../../components/Footer.vue";//Importamos el componente Footer para mostrar en la vista
import Multiselect from '@vueform/multiselect';//Importamos el componente Multiselect que se va a utilizarte en el modal para crear usuario
import { notify } from "@kyvg/vue3-notification";//Componente que realiuza las notificaciones
import Spinner from '../../components/Spinner.vue'//Componente que contiene el spinner para las pantallas de cargas
import Paginacion from "../../components/Paginacion.vue"//Componente que contiene la paginación
import axios from "axios";
import { onMounted, reactive, ref, toRefs } from 'vue'
export default {
  components: {
    TablaListaUsuarios,
    Navbar,
    Footer,
    Multiselect,
    Spinner,
    Paginacion,
    
  },
  setup() {
    const usuarios = ref([])//Constante que almacena el array de todos los usuarios que se han registrado con toda la información
    const options = ref(['Activo', 'Inactivo'])//Constante que almacena las opciones de estatus que pueden seleccionar en el header
    const modalAgregar = ref(false)//Constante que abre el modal para agregar el usuario
    const roles = ref ([])//Constante que almacena el array de roles existentes
    const modalLoading = ref(false)//Constante que abre el modal del spinner de la pantalla de carga
    const header = reactive({ nombre: "", estatus: undefined })//Constante reactiva que almacena el nombre y estatus para realizar el filtro de busqueda
    //Paginacion
    const totalPaginas = ref(0)//Constante que almacena el total de páginas que hay en la busqueda
    const paginaActual = ref(1)//Constante que almacena la página actual de la busqueda realizada
    const hasMorePages = ref(true)//Constante que nos indica si puede haber más páginas y si puede hacer un cambio de página
    const numRespuesta = ref(10)//Constante que indica el número de respuestas que va a mostrar por página
    const usuario = reactive ({})//constante reactiva que va a almacenar la información de un usuario nuevo
    
    const abrirModal = async () => {//función asincorna que espera a que des click en el botón Agregar usuario, que abre el formulario para agreagar un usuario
      modalAgregar.value = true //Habilitamos el spinner de pantalla de carga
      axios.get(`${API}/Identity/roles`)//Llamada al endpoint que trae los roles existentes
      .then((result) => {//Si el endpoint tiene una respuesta correcta
        console.log(result);
        for(let i=0; i<result.data.length; i++){ //recorremos la respuesta, y cada que recorremos sumamos un 1 para el siguiente rol
          roles.value.push({'value':result.data[i].name, 'label':result.data[i].name})//asignamos los roles existentes a la variable roles, para mostrarlos en el multiselect
        }
      }).catch((error)=>{//si el endpoint tiene un error
        console.log(error);//Mostramos en consola el error  que nos da el endpoint
        modalLoading.value = false //cerramos el spinner de carga
      })
    }
    function cancelar (){
      usuario.pass = '',
      usuario.nombre = '',
      usuario.apellidos = '',
      usuario.apellidoM = ''
    }
    function todos (){
      modalLoading.value = true//Abrimos el spinner de pantalla de carga
      header.nombre = ''//Damos el valor de vacio a la constante que almacena el nombre que se escribió en le header
      header.estatus = undefined//Damos el valor de undefined a la constante que almacena el estatus que seleccionamos en el header
      let nombreRuta = ' '//Creamos dos literal con un espacio en blanco para mandarla en la ruta
      let estatusRuta = ' '
      const ruta = encodeURI(`${API}/Identity/user/1/${numRespuesta.value}/${nombreRuta}/${estatusRuta}`)
      axios.get(ruta)//Llamada al endpoint que trae los roles existentes
      .then((result) => {//Si el endpoint tiene una respuesta correcta
      console.log(result);
        if(result.status == 200){//valida que el estatus de la respuesta sea 200 para saber que es una respuesta correcta y con contenido
          totalPaginas.value = result.data.paginas_totales
          paginaActual.value = result.data.pagina_actual
          modalLoading.value = false//Cerramos el spinner de carga
          usuarios.value = result.data.usuarios //asignamos los resultados que nos trajo el endpoint a la constante roles
        }
      }).catch((error)=>{//Si el endpoint tiene un error en la respuesta
        console.log(error);//Mostramos en consola el error  que nos da el endpoint
        modalLoading.value = false //cerramos el spinner de carga
      })
    }
    function buscar (nombre, estatus){
      modalLoading.value = true
      if(nombre == '')
        nombre = ' '
      if(estatus == undefined)
        estatus = ' '
      if(nombre == ' ' && estatus == ' '){
        notify({//Notificación en la que indicamos que no se ha insertado ningún dato para buscar
          title:'Sin Información',
          text:'No hay datos para realizar la busqueda',
          type: 'warn'
        });
        modalLoading.value = false
      }else{
        modalLoading.value = true//Abrimos el spinner de pantalla de carga
        const ruta = encodeURI(`${API}/Identity/user/${paginaActual.value}/${numRespuesta.value}/${nombre}/${estatus}`)
        axios.get(ruta)//Llamada al endpoint que trae los roles existentes
        .then((result) => {//Si el endpoint tiene una respuesta correcta
        console.log(result);
          if(result.status == 200){//valida que el estatus de la respuesta sea 200 para saber que es una respuesta correcta y con contenido
            totalPaginas.value = result.data.paginas_totales
            paginaActual.value = result.data.pagina_actual
            modalLoading.value = false//Cerramos el spinner de carga
            usuarios.value = result.data.usuarios //asignamos los resultados que nos trajo el endpoint a la constante roles
          }
        }).catch((error)=>{//Si el endpoint tiene un error en la respuesta
          console.log(error);//Mostramos en consola el error  que nos da el endpoint
          modalLoading.value = false //cerramos el spinner de carga
        })
      }
    }
    function showMore (page){
      if(header.nombre == '')
        header.nombre = ' '
      if(header.estatus == undefined)
        header.estatus = ' '
      const ruta = encodeURI(`${API}/Identity/user/${page}/${numRespuesta.value}/${header.nombre}/${header.estatus}`)
        axios.get(ruta)//Llamada al endpoint que trae los roles existentes
        .then((result) => {//Si el endpoint tiene una respuesta correcta
        console.log(result);
          if(result.status == 200){//valida que el estatus de la respuesta sea 200 para saber que es una respuesta correcta y con contenido
            totalPaginas.value = result.data.paginas_totales
            paginaActual.value = result.data.pagina_actual
            modalLoading.value = false//Cerramos el spinner de carga
            usuarios.value = result.data.usuarios //asignamos los resultados que nos trajo el endpoint a la constante roles
          }
        }).catch((error)=>{//Si el endpoint tiene un error en la respuesta
          console.log(error);//Mostramos en consola el error  que nos da el endpoint
          modalLoading.value = false //cerramos el spinner de carga
        })
    }
    function guardar (){
      const data = { //constante que va a almacenar la información del formulario para agregar un usuario
        "password":usuario.pass,//password que se escribio en el formulario de agregar usuario
        "nombre":usuario.nombre,//usuario que se escribio en el formulario de agregar usuario
        "apellidos":usuario.apellidos,//apellido o apellidos que se escribieron en el formulario de agregar usuario
        "roleName":usuario.rol//rol que se seleccionó en el formulario de agregar usuario
      }
      axios.post(`${API}/Identity/register`,data)//endpoitn que registra usuario en la base de datos
      .then((result) => {//si el usuario tiene una respuesta correcta
        if(result.status == 201){//si el status de la respuesta es 201, es decir respuesta correcta
          modalAgregar.value = false//cerramos el spinner de la pantalla de carga
          usuario.pass = '',//limpiamos el valor de password del formulario de agregar usuario
          usuario.nombre = '',//limpiamos el valor de nombre del formulario de agregar usuario
          usuario.apellidos = '',//limpiamos el valor de apellido o apellidos del formulario de agregar usuario
          notify({//notificación de que el usuario se inserto correctamente
            title:'Nuevo Usuario',//titulo de la notificaci{on}
            text:`Se creo correctamente el nuevo usuario userName`,//texto de la notificación 
            duration: 20000,//duración de la notificación
            closeonclick:true,//si le damos click se cierra la notificación
            type: 'success'//el tipo de notificación, si es success el color será verde
          });
        }
      })
      
    }

    onMounted(todos)

  return { abrirModal, cancelar, todos, guardar, buscar, showMore, usuario, usuarios, options, ...toRefs(header), modalAgregar, roles, modalLoading, paginaActual, hasMorePages, numRespuesta, totalPaginas }
  },
}
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped>
.modal-container{
    position: fixed;
    width: 100%;
    height: 100vh;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.2);
}
.title {
  text-align: center;
  font-size: 45px;
  padding-top: 20px;
}
.button-pagination {
  padding: 2px;
  border: 1px solid #2c5282;
  border-radius: 5px;
  margin-right: 5px;
  font-size: 12px;
  margin-top: 20px;
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
.btn-buscar:focus {
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