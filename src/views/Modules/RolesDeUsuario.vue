<template>
  <Navbar/>
  <h1 class="title font-titulo ml-24 font-bold">Perfiles de Usuario</h1>
  <!-- Header Rol  -->
  <div class="container mx-auto px-0 pb-2 pt-4">    
    <div class="flex flex-wrap ferromex-color p-1 rounded-lg">
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        Perfil:<input v-model="nombre" type="text" class="rounded text-black ml-2 md:w-20 2xl:w-44"/>
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        Estatus:  
        <select v-model="estatus" class="flex-none text-black rounded 2xl:w-44">
          <option :value="undefined">Seleccione una opción</option>
          <option v-for="(option ,index) in options" :key="index" :value="option">{{option}}</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        Resultados:
        <select v-model="numRespuesta" class="text-gray-800 w-16 rounded" @change="buscarchange(nombre , estatus)">
          <option value="10">10</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        <button @click="buscar(nombre , estatus)" class="btn-buscar animacion">Buscar</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        <button @click="todos()" class="btn-buscar animacion">Todos</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 md:ml-32 ">
        <button @click="abrir_modal_new_rol" class="btn-buscar animacion">Agregar Perfil</button>
      </div>
    </div>
    <TablaRoles :infoRoles="roles"/>
    <div class="ml-20">
      <Paginacion :total-pages="totalPaginas" :total="100" :current-page="paginaActual" :has-more-pages="hasMorePages" @pagechanged="cambiarPagina"/>
    </div>
  </div>
  <!-- Modal Agregar Rol -->
  <Modal :show="userModal" @cerrarmodal="cerralmodalpadre">
    <div>
      <p class="text-gray-900 font-bold text-2xl -mt-8 mb-8 text-center">Agregar Nuevo Perfil</p>     
      <div class="grid grid-cols-2 mt-2">
        <p class="text-sm mb-1 font-semibold text-gray-700 text-center sm:-ml-6">Nombre Perfil*:</p>
        <input v-model="newRol.nombre" type="text" class="border mx-auto w-52 rounded-lg" :class="{'border border-red-400': vacio}" @input="vacio = false">
      </div>
      <div class="grid grid-cols-2 mt-2">
        <p class="text-sm mb-1 text-center font-semibold text-gray-700 mt-2 sm:-ml-6">Módulos*:</p>
        <Multiselect
          v-model="newRol.vistas" 
          label="text"
          mode="multiple"
          valueProp="value"
          placeholder="Seleccione las Plazas"                    
          :options="modulosExistentes"
          :close-on-select="false"
          class="w-52"
          :class="{'border border-red-400': vacio}"
        /> 
      </div>  
      <span v-if="vacio" class="text-xs text-center text-red-300 mx-auto">
          <p>Todos los campos son obligatorios</p>
      </span>    
      <div class="mt-10 text-center mx-auto mb-4">
        <button @click="craer_nuevo_rol" class="rounded-lg w-18 bg-ferromex text-white p-10">Guardar</button>
      </div>
      <h1 class="text-xl font-bold font-titulo text-center -mt-2">* Campo Obligatorio</h1>
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
import Multiselect from '@vueform/multiselect'//Importamos el componente multiselect para la selección de modulos a asignar
import { notify } from "@kyvg/vue3-notification";//Importamos el componente notify para mostrar las notifiaciones al usuario
import { onMounted, reactive, ref, toRefs, inject } from 'vue';
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
    const axios = inject('axios')
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
    const vacio = ref(false)//Constante que activa la bandera de validaciones sobre campos vacios en los modales
    const abrir_modal_new_rol = () => { //Constante que permite abrir el modal de creación de roles
      userModal.value = true
      modulosExistentes.value = []//Vaciamos la constante que obtine los módulos existentes
      axios.get(`${API}/Ferromex/modules`)//Endpoint que trae todos los modulos que existen
      .then((result)=>{//Si el endpoint tiene una respuesta correcta
        result.data.content.forEach((e) => {//reiteracion y comprobacion si es un submodulo
        if({}.hasOwnProperty.call(e,'parentModule') == false){
        modulosExistentes.value.push({'text':e.nameModule, 'value':e.id,})//asignamos los roles existentes a la variable roles, para mostrarlos en el multiselect
        }
      })
      })
    }
    const cerralmodalpadre = (modal) => {//constante que emite el cierre del modal para agregar roles, y limpia los valores del modal
      userModal.value = modal//Toma el valor que se le envia a la constante, siempre será false, esto hará que se cierre el modal
      newRol.nombre = ''//Limpiamos la constante para que la siguiente vez que lo abramos esté en blanco
      newRol.vistas = [{}]//Limpiamos la constante para que la siguiente vez que lo abramos esté en blanco
      vacio.value = false//Cambiamos el valor de la constante, para que la siguiente vez que lo abramos no este activada la validación
    }
    const craer_nuevo_rol = async () => { //Funcion que inserta el nuevo rol
      let data = { //literal que guarda el nombre del rol, para mandarselo al endpoint en el body
        "roleName": newRol.nombre
      }
      if(newRol.nombre != '' && newRol.vistas != ''){//Si el nombre y las vistas no están vacias
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
              if(result.status == 200)//Validamos que la respuesta sea correcta
              {
                modalLoading.value = false//Desactivamos el spinner
                notify({ type: 'success', title:'Rol creado', text: `Se creo correctamente el rol ${newRol.nombre}`});//Mostramos notificación de que se creo correctamente el rol
                newRol.vistas = []; newRol.nombre = "";//limpiamos los input del modal para agregar roles
                cerralmodalpadre()//Llamamos a la función que cierra el modal
                todos()//Llamamos a la función que trae todos los resultados actualizados
              }
            }).catch((error) => {//Si el enpoint tiene algun error
              console.log(error.request.response);//Imprimimos el error en consola
              modalLoading.value = false//Desactivamos el spinner
              notify({ type: 'warn', title:'Rol no creado', text: `No se pudo insertar los modulos al rol ${newRol.nombre}`});//Mostramos nositificación de que no se creo el rol
              newRol.vistas = []; newRol.nombre = "";//limpiamos los input del modal para agregar roles
              cerralmodalpadre()//Llamamos a la función que cierra el modal
              todos()//Llamamos a la función que trae todos los resultados actualizados
            })
          }
        }).catch((error) => {
          console.log(error.request.response);//Imprimimos el error en consola
          modalLoading.value = false//Desactivamos el spinner
          notify({ type: 'warn', title:'Rol no creado', text: `No se pudo crear el rol ${newRol.nombre}`});//Mostramos nositificación de que no se creo el rol
          newRol.vistas = []; newRol.nombre = "";//limpiamos los input del modal para agregar roles
          cerralmodalpadre()//Llamamos a la función que cierra el modal
          todos()//Llamamos a la función que trae todos los resultados actualizados
        })
      }else//Si el nombre y las vistas están vacias
        vacio.value = true//Activamos la bandera que nos da los estilos y advertencias
    }
    function buscar (nombre, estatus){//Función que realiza la busqueda de los roles existentes, o uno en especificos, recibe como parametros el nombre y el estatus, pueden llegar vacios
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
        axios.get(ruta)//Llamada al endpoint que trae los roles existentes
        .then((result) => {//Si el endpoint tiene una respuesta correcta
          if(result.status == 200){//valida que el estatus de la respuesta sea 200 para saber que es una respuesta correcta y con contenido
            totalPaginas.value = result.data.paginas_totales//Asignamos el valor de las páginas totales para el componente de páginación
            paginaActual.value = result.data.pagina_actual//Asignamos el valor de la pagina actual para saber en cual nos posicionamos en el componente de paginación
            modalLoading.value = false//Cerramos el spinner de carga
            roles.value = result.data.roles //asignamos los resultados que nos trajo el endpoint a la constante roles
          }
        }).catch((error)=>{//Si el endpoint tiene un erro en la respuesta
          console.log(error.request.response);//Mostramos en consola el error  que nos da el endpoint
          modalLoading.value = false //cerramos el spinner de carga
        })
      }
    }
    function buscarchange(nombre, estatus){//Función que realiza la busqueda de los roles existentes, o uno en especificos, recibe como parametros el nombre y el estatus, pueden llegar vacios
      paginaActual.value = 1;
      modalLoading.value = true;
      if(nombre == "")//Si no se ha escrito ningún nombre en el header, el valor de nombre será un espacio en blanco
        nombre = ' '
      if(estatus == undefined)//Si no se ha seleccionado ningún estatus en el header, el valor de estatus será un espacio en blanco
        estatus = ' '
        roles.value = [] //Constante que contiene los roles se muestra en vacio para hacer una busqueda limpia, y no se queden datos en cache
        const ruta = encodeURI(`${API}/Identity/roles/${paginaActual.value}/${numRespuesta.value}/${nombre}/${estatus}`)
        axios.get(ruta)//Llamada al endpoint que trae los roles existentes
        .then((result) => {//Si el endpoint tiene una respuesta correcta
          if(result.status == 200){//valida que el estatus de la respuesta sea 200 para saber que es una respuesta correcta y con contenido
            totalPaginas.value = result.data.paginas_totales//Asignamos el valor de las páginas totales para el componente de páginación
            paginaActual.value = result.data.pagina_actual//Asignamos el valor de la pagina actual para saber en cual nos posicionamos en el componente de paginación
            modalLoading.value = false//Cerramos el spinner de carga
            roles.value = result.data.roles //asignamos los resultados que nos trajo el endpoint a la constante roles
          }
        }).catch((error)=>{//Si el endpoint tiene un erro en la respuesta
          console.log(error.request.response);//Mostramos en consola el error  que nos da el endpoint
          modalLoading.value = false //cerramos el spinner de carga
        })
    }
    function todos (){//Función que trae todos los roles existentes
      roles.value = [] //Constante que contiene los roles se muestra en vacio para hacer una busqueda limpia, y no se queden datos en cache
      modalLoading.value = true//Abrimos el spinner de pantalla de carga
      header.nombre = ''//Damos el valor de vacio a la constante que almacena el nombre que se escribió en le header
      header.estatus = undefined//Damos el valor de undefined a la constante que almacena el estatus que seleccionamos en el header
      let nombreRuta = ' '//Creamos dos literal con un espacio en blanco para mandarla en la ruta
      let estatusRuta = ' '
      numRespuesta.value = 10 //Volvemos al default a 10 resultados
      const ruta = encodeURI(`${API}/Identity/roles/1/${numRespuesta.value}/${nombreRuta}/${estatusRuta}`)//constante con la ruta codificada
      axios.get(ruta)//Llamada al endpoint que trae los roles existentes
      .then((result) => {//Si el endpoint tiene una respuesta correcta
        if(result.status == 200){//valida que el estatus de la respuesta sea 200 para saber que es una respuesta correcta y con contenido
          totalPaginas.value = result.data.paginas_totales//Asignamos el valor de las páginas totales para el componente de páginación
          paginaActual.value = result.data.pagina_actual//Asignamos el valor de la pagina actual para saber en cual nos posicionamos en el componente de paginación
          modalLoading.value = false//Cerramos el spinner de carga
          roles.value = result.data.roles //asignamos los resultados que nos trajo el endpoint a la constante roles
        }
      }).catch((error)=>{//Si el endpoint tiene un error en la respuesta
        console.log(error.request.response);//Mostramos en consola el error  que nos da el endpoint
        modalLoading.value = false //cerramos el spinner de carga
      })
    }
    function cambiarPagina(page){//Función que cambia la página
      if(header.nombre == "")//Si el filtro de nombre está vacío
        header.nombre = ' '//Damos un espacio en blanco para enviarlo asi en la ruta
      if(header.estatus)//Si el filtro de estatus está vacío
        header.estatus = ' '//Damos un espacio en blanco para enviarlo asi en la ruta
      const ruta = encodeURI(`${API}/Identity/roles/${page}/${numRespuesta.value}/${header.nombre}/${header.estatus}`)//constante con la ruta codificada
      axios.get(ruta)//Llamada al endpoint que trae los roles existentes
      .then((result) => {//SI el endpoint tiene una respuesta correcta
        if(result.status == 200){//valida que el estatus de la respuesta sea 200 para saber que es una respuesta correcta y con contenido
          totalPaginas.value = result.data.paginas_totales//Asignamos el valor de las páginas totales para el componente de páginación
          paginaActual.value = result.data.pagina_actual//Asignamos el valor de la pagina actual para saber en cual nos posicionamos en el componente de paginación
          modalLoading.value = false//Cerramos el spinner de carga
          roles.value = result.data.roles //asignamos los resultados que nos trajo el endpoint a la constante roles
        }
      }).catch((error) => {//Si el endpoint tiene un error 
        console.log(error.request.response);//Mostramos en consola el error  que nos da el endpoint
        modalLoading.value = false //cerramos el spinner de carga
      })
    }

    onMounted(todos)//Montamos la función todos apra que traiga todos los roles existentes en la primer carga

    return { 
      roles, 
      modulosExistentes, 
      userModal, 
      abrir_modal_new_rol, 
      newRol, 
      ...toRefs(header), 
      options, 
      craer_nuevo_rol, 
      buscar, 
      todos, 
      vacio, 
      modalLoading, 
      totalPaginas, 
      paginaActual, 
      hasMorePages, 
      numRespuesta, 
      cambiarPagina, 
      cerralmodalpadre,
      buscarchange }

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
@media (max-width: 750px) {
  .title {
    font-size: 20px;
    padding-bottom: 20px;
  }
}
</style>
<style src="@vueform/multiselect/themes/default.css"></style>