<template>
  <Navbar/>
  <h1 class="title border ml-24 font-titulo font-bold">Lista de Usuarios</h1>
  <!-- header -->
  <div class="container mx-auto px-0 pb-2 pt-4">
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
      <div class="flex-none my-auto text-white font-md p-2">
        Resultados:
        <select v-model="numRespuesta" class="text-gray-800 w-16 rounded" @change="buscarchange(nombre,estatus)">
          <option value="10">10</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        <button @click="buscar(nombre,estatus)" class="btn-buscar animacion">Buscar</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-6">
        <button @click="todos()" class="btn-buscar animacion">Todos</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 md:ml-32">
        <button @click="abrirModal" class="btn-buscar animacion">Agregar Usuario</button>
      </div>
    </div>
    <TablaListaUsuarios @refrescarTabla="todos()" :dataUsuarios="usuarios"/>
    <div class="ml-24">
      <Paginacion :total-pages="totalPaginas" :total="100" :current-page="paginaActual" :has-more-pages="hasMorePages" @pagechanged="cambiarPagina"/>
    </div>
  </div>
  <!-- MODAL CREAR USUARIO -->
  <Modal :show="modalAgregar" @cerrarmodal="cerrarModal">
    <div>
      <p class="text-gray-900 font-bold text-2xl -mt-8 mb-8 text-center">Agregar Nuevo Usuario</p>
      <div class="grid grid-cols-2 mt-2 text-center">
        <p class="text-sm mb-1 font-semibold text-gray-700 sm:-ml-6">Nombre(s)*</p>
        <input v-model="usuario.nombre" type="text" class="border mx-auto w-52 rounded-lg">
        <p class="text-sm mb-1 font-semibold text-gray-700 mt-2 sm:-ml-6">Apellidos*</p>
        <input v-model="usuario.apellidos" type="text" class="border mx-auto w-52 rounded-lg">
        <p class="text-sm mb-1 font-semibold text-gray-700 mt-2 sm:-ml-6">Contraseña *</p>
        <div class="w-52 mx-auto inline-flex relative flex-row-reverse border">
          <input v-model="usuario.pass" :type="tipoInput" class="mx-auto w-full rounded-lg" :class="{'border border-red-500':!mayuscula || !corta}" @input="mayuscula = true, corta = true">
          <span @click="tipoInput == 'password' ? tipoInput = 'text' : tipoInput = 'password'" class="absolute mx-auto  mt-1 cursor-pointer">
            <fa v-if="tipoInput == 'password'" icon="eye" class="text-gray-600 w-5 h-5" />
            <fa v-else  icon="eye-slash" class="text-gray-600 w-5 h-5" />
          </span>
        </div>
        <span></span>
        <span v-if="!mayuscula || !corta" class="text-xs text-red-300 mx-auto">
          <p>Se necesita mínimo una mayuscula</p>
          <p>Se necesita mínimo 6 caracteres</p>
        </span>
        <span v-else></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <p class="text-sm mb-1 font-semibold text-gray-700 mt-2 sm:-ml-6">Perfil *</p>
        <Multiselect
          v-model="usuario.rol"
          placeholder="Seleccione un perfil"
          :searchable="true"
          :options="roles"
          :close-on-select="true"
          class="w-52"
        /> 
      </div>
      <div class="mt-10 text-center mx-auto mb-4">
        <button @click="guardar()" class="rounded-lg w-18 bg-ferromex text-white p-10">Guardar</button>
      </div>
      <h1 class="text-xl font-bold font-titulo text-center -mt-2">* Campo Obligatorio</h1>
    </div>
  </Modal>
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
import Modal from "../../components/Modal.vue"//Importamos el componente modal
import { onMounted, reactive,inject, ref, toRefs } from 'vue'
export default {
  components: {
    TablaListaUsuarios,
    Navbar,
    Footer,
    Multiselect,
    Spinner,
    Paginacion,
    Modal
  },
  setup() {
    const axios = inject('axios')
    const usuarios = ref([])//Constante que almacena el array de todos los usuarios que se han registrado con toda la información
    const options = ref(['Activo', 'Inactivo'])//Constante que almacena las opciones de estatus que pueden seleccionar en el header
    const modalAgregar = ref(false)//Constante que abre el modal para agregar el usuario
    const roles = ref ([])//Constante que almacena el array de roles existentes
    const modalLoading = ref(false)//Constante que abre el modal del spinner de la pantalla de carga
    const header = reactive({ nombre: "", estatus: undefined })//Constante reactiva que almacena el nombre y estatus para realizar el filtro de busqueda
    const totalPaginas = ref(0)//Constante que almacena el total de páginas que hay en la busqueda
    const paginaActual = ref(1)//Constante que almacena la página actual de la busqueda realizada
    const hasMorePages = ref(true)//Constante que nos indica si puede haber más páginas y si puede hacer un cambio de página
    const numRespuesta = ref(10)//Constante que indica el número de respuestas que va a mostrar por página
    const usuario = reactive ({})//constante reactiva que va a almacenar la información de un usuario nuevo
    const mayuscula = ref(true)//Constante que almacena la respuesta de la validación si es que hay o no mayusculas para la contraseña
    const corta = ref(true)//Constante que alamcena la respuesta de la validación si es que la contraseña es muy corta
    const tipoInput = ref('password')//Constante que nos permite cambiar el tipo de input de la contraseña para poder verla
    const abrirModal = async () => {//función asincorna que espera a que des click en el botón Agregar usuario, que abre el formulario para agreagar un usuario
      modalAgregar.value = true //Habilitamos el spinner de pantalla de carga
      axios.get(`${API}/Identity/roles/%20/%20/%20/%20`)//Llamada al endpoint que trae los roles existentes
      .then((result) => {//Si el endpoint tiene una respuesta correcta
        let res = []//Creamos una literal para almacenar la respuesta del endpoint
        res = result.data.roles//Asignamos la respuesta del endpoint a la literal creada
        let filtro = res.filter(res => res.estatus == true)//filtramos sobre los resultados existentes, para solo obtener los que están activos
        for(let i=0; i<filtro.length; i++){ //recorremos la respuesta, y cada que recorremos sumamos un 1 para el siguiente rol
          roles.value.push({'value':filtro[i].nombreRol, 'label':filtro[i].nombreRol})//asignamos los roles existentes a la variable roles, para mostrarlos en el multiselect
          if(filtro[i].nombreRol == 'PINFRA'){
            var pin = filtro[i].nombreRol
            roles.value.pop(pin)
          }
          if(filtro[i].nombreRol == 'AdminIntermodal'){
            var inter = filtro[i].nombreRol
            roles.value.pop(inter)
          }
          if(filtro[i].nombreRol == 'Admin'){
            var adm = filtro[i].nombreRol
            roles.value.pop(adm)
          }
        }
      }).catch((error)=>{//si el endpoint tiene un error
        console.log(error.request.response);//Mostramos en consola el error  que nos da el endpoint
        modalLoading.value = false //cerramos el spinner de carga
      })
    }
    function todos (){//Función que obtiene todos los usuarios existentes, sin ningún filtro
      modalLoading.value = true//Abrimos el spinner de pantalla de carga
      header.nombre = ''//Damos el valor de vacio a la constante que almacena el nombre que se escribió en le header
      header.estatus = undefined//Damos el valor de undefined a la constante que almacena el estatus que seleccionamos en el header
      let nombreRuta = ' '//Creamos dos literal con un espacio en blanco para mandarla en la ruta
      let estatusRuta = ' '//Creamos dos literal con un espacio en blanco para mandarla en la ruta
      numRespuesta.value = 10 //Filtramos por 10 valores por default
      const ruta = encodeURI(`${API}/Identity/user/1/${numRespuesta.value}/${nombreRuta}/${estatusRuta}`)
      axios.get(ruta)//Llamada al endpoint que trae los roles existentes
      .then((result) => {//Si el endpoint tiene una respuesta correcta
        if(result.status == 200){//valida que el estatus de la respuesta sea 200 para saber que es una respuesta correcta y con contenido
          totalPaginas.value = result.data.paginas_totales
          paginaActual.value = result.data.pagina_actual
          modalLoading.value = false//Cerramos el spinner de carga
          usuarios.value = result.data.usuarios //asignamos los resultados que nos trajo el endpoint a la constante roles
        }
      }).catch((error)=>{//Si el endpoint tiene un error en la respuesta
        console.log(error.request.response);//Mostramos en consola el error  que nos da el endpoint
        modalLoading.value = false //cerramos el spinner de carga
      })
    }
    function buscar (nombre, estatus){//Función que realiza la busqueda de acuerdo a los parámetros ingresados en los header
      modalLoading.value = true//Abrimos el spinner de la pantalla de carga
      if(nombre == '')//Hacemos la validación si es que el nombre estaá vacios
        nombre = ' '//Añadimos un espacio en blanco
      if(estatus == undefined)//Hacemos la validación si es que el estatus está indefinido
        estatus = ' '//Añadimos un espacio en blanco
      if(nombre == ' ' && estatus == ' '){//Validamos si ambos campos estan vacios
        notify({//Notificación en la que indicamos que no se ha insertado ningún dato para buscar
          title:'Sin Información',
          text:'No hay datos para realizar la busqueda',
          type: 'warn'
        });
        modalLoading.value = false
      }else{//Si se selecciona alguno de los campos
        modalLoading.value = true//Abrimos el spinner de pantalla de carga
        const ruta = encodeURI(`${API}/Identity/user/${paginaActual.value}/${numRespuesta.value}/${nombre}/${estatus}`)
        axios.get(ruta)//Llamada al endpoint que trae los roles existentes
        .then((result) => {//Si el endpoint tiene una respuesta correcta
          if(result.status == 200){//valida que el estatus de la respuesta sea 200 para saber que es una respuesta correcta y con contenido
            totalPaginas.value = result.data.paginas_totales
            paginaActual.value = result.data.pagina_actual
            modalLoading.value = false//Cerramos el spinner de carga
            usuarios.value = result.data.usuarios //asignamos los resultados que nos trajo el endpoint a la constante roles
          }
        }).catch((error)=>{//Si el endpoint tiene un error en la respuesta
          console.log(error.request.response);//Mostramos en consola el error  que nos da el endpoint
          modalLoading.value = false //cerramos el spinner de carga
        })
      }
    }
    function buscarchange (nombre, estatus){//Función que realiza la busqueda de acuerdo a los parámetros ingresados en los header
      paginaActual.value = 1;
      modalLoading.value = true//Abrimos el spinner de la pantalla de carga
      if(nombre == ''){ //Hacemos la validación si es que el nombre estaá vacios
         nombre = ' '//Añadimos un espacio en blanco
      }
      if(estatus == undefined){ //Hacemos la validación si es que el estatus está indefinido
        estatus = ' '//Añadimos un espacio en blanco
      }
      modalLoading.value = true//Abrimos el spinner de pantalla de carga
      const ruta = encodeURI(`${API}/Identity/user/${paginaActual.value}/${numRespuesta.value}/${nombre}/${estatus}`)
      axios.get(ruta)//Llamada al endpoint que trae los roles existentes
        .then((result) => {//Si el endpoint tiene una respuesta correcta
        if(result.status == 200){//valida que el estatus de la respuesta sea 200 para saber que es una respuesta correcta y con contenido
          totalPaginas.value = result.data.paginas_totales
          paginaActual.value = result.data.pagina_actual
          modalLoading.value = false//Cerramos el spinner de carga
          usuarios.value = result.data.usuarios //asignamos los resultados que nos trajo el endpoint a la constante roles
          }
        }).catch((error)=>{//Si el endpoint tiene un error en la respuesta
          console.log(error.request.response);//Mostramos en consola el error  que nos da el endpoint
          modalLoading.value = false //cerramos el spinner de carga
        })
    }
    function cambiarPagina (page){//Función que permite hacer el cambio de páginas con las nuevas respuestas
      if(header.nombre == '')//Si el nombre está vacio
        header.nombre = ' '//Agregamos un espacio en blanco
      if(header.estatus == undefined)//Si el estatus está indefinido
        header.estatus = ' '//Agregamos un espacio en blanco
      const ruta = encodeURI(`${API}/Identity/user/${page}/${numRespuesta.value}/${header.nombre}/${header.estatus}`)
        axios.get(ruta)//Llamada al endpoint que trae los roles existentes
        .then((result) => {//Si el endpoint tiene una respuesta correcta
          if(result.status == 200){//valida que el estatus de la respuesta sea 200 para saber que es una respuesta correcta y con contenido
            totalPaginas.value = result.data.paginas_totales
            paginaActual.value = result.data.pagina_actual
            modalLoading.value = false//Cerramos el spinner de carga
            usuarios.value = result.data.usuarios //asignamos los resultados que nos trajo el endpoint a la constante roles
          }
        }).catch((error)=>{//Si el endpoint tiene un error en la respuesta
          console.log(error.request.response);//Mostramos en consola el error  que nos da el endpoint
          modalLoading.value = false //cerramos el spinner de carga
        })
    }
    function guardar (){//Función que envía los parametros para guardar un nuevo usuario
      const data = { //constante que va a almacenar la información del formulario para agregar un usuario
        "password":usuario.pass,//password que se escribio en el formulario de agregar usuario
        "nombre":usuario.nombre,//usuario que se escribio en el formulario de agregar usuario
        "apellidos":usuario.apellidos,//apellido o apellidos que se escribieron en el formulario de agregar usuario
        "roleName":usuario.rol//rol que se seleccionó en el formulario de agregar usuario
      }
      if(data.nombre == '' || data.password == '' || data.apellidos == '' || data.roleName == ''){//Si alguno de los campos está vacio
        notify({//notificación de que el usuario se inserto correctamente
          title:'Nuevo Usuario',//titulo de la notificaci{on}
          text:`Todos los campos son obligatorios`,//texto de la notificación 
          duration: 20000,//duración de la notificación
          closeonclick:true,//si le damos click se cierra la notificación
          type: 'warn'//el tipo de notificación, si es success el color será verde
        });
      }else{
        if(data.password.length >= 6){//Si la contraseña es menor a 6 carácteres
          let mayusculas = 'ABCDEFGHYJKLMNÑOPQRSTUVWXYZ'//Literal que almacena todas las letras en mayusculas
          let contador = []
          for(let i = 0; i< data.password.length; i++){//Recorremos toda la palabra insertada en el password y si no encuentra alguna mayuscula no nos dejará insertar
            if (mayusculas.indexOf(data.password.charAt(i),0)!=-1)
              contador.push(true)
            else
              mayuscula.value = false 
          }
          if(contador.includes(true))
            mayuscula.value = true
          if(mayuscula.value ==  true){
            axios.post(`${API}/Identity/register`,data)//endpoitn que registra usuario en la base de datos
            .then((result) => {//si el usuario tiene una respuesta correcta
              if(result.status == 200){//si el status de la respuesta es 201, es decir respuesta correcta
                modalAgregar.value = false//cerramos el spinner de la pantalla de carga
                usuario.pass = '',//limpiamos el valor de password del formulario de agregar usuario
                usuario.nombre = '',//limpiamos el valor de nombre del formulario de agregar usuario
                usuario.apellidos = '',//limpiamos el valor de apellido o apellidos del formulario de agregar usuario
                usuario.rol = ''//limpiamos el valor de rol del formulario de agregar usuario
                notify({//notificación de que el usuario se inserto correctamente
                  title:'Nuevo Usuario',//titulo de la notificaci{on}
                  text:`Se creo correctamente el nuevo usuario ${result.data.nombreUsuario}`,//texto de la notificación 
                  duration: 3000,//duración de la notificación
                  closeonclick:true,//si le damos click se cierra la notificación
                  type: 'success'//el tipo de notificación, si es success el color será verde
                });
                todos()//LLamamos a la función para refrescar la tabla
              }
            })
            .catch(error => {
              let descripcionerror = JSON.parse(error.request.response);
              if(descripcionerror[0].code == "DuplicateUserName"){
                notify({//notificación de que el usuario se inserto correctamente
                  title:'Usuario Repetido',//titulo de la notificaci{on}
                  text:`No se puede crear el usuario`,//texto de la notificación 
                  duration: 3000,//duración de la notificación
                  closeonclick:true,//si le damos click se cierra la notificación
                  type: 'warn'//el tipo de notificación, si es success el color será verde
                });
              }else{
                modalAgregar.value = false//cerramos el spinner de la pantalla de carga
                usuario.pass = '',//limpiamos el valor de password del formulario de agregar usuario
                usuario.nombre = '',//limpiamos el valor de nombre del formulario de agregar usuario
                usuario.apellidos = '',//limpiamos el valor de apellido o apellidos del formulario de agregar usuario
                usuario.rol = ''//limpiamos el valor de rol del formulario de agregar usuario
                notify({//notificación de que el usuario se inserto correctamente
                  title:'Error al crear',//titulo de la notificaci{on}
                  text:`No se creo correctamente el nuevo usuario`,//texto de la notificación 
                  duration: 3000,//duración de la notificación
                  closeonclick:true,//si le damos click se cierra la notificación
                  type: 'error'//el tipo de notificación, si es success el color será verde
                });
                todos()//LLamamos a la función para refrescar la tabla
              }
            })
          }
        }else{
          corta.value = false //La contraseña es demasiado corta
        }
      }
    }
    const cerrarModal = (modal) => {//constante que emite el cierre del modal para agregar roles, y limpia los valores del modal
      modalAgregar.value = modal
      mayuscula.value = true
      corta.value = true
      usuario.nombre = ''
      usuario.apellidos = ''
      usuario.pass = ''
      usuario.rol = ''
    }
    onMounted(todos)//Montamos la función todos para que en la primer carga traiga todos los usuarios existentes

  return { abrirModal, 
  todos, 
  guardar, 
  buscar, 
  cambiarPagina, 
  cerrarModal, 
  usuario, 
  usuarios, 
  options, 
  ...toRefs(header),
  mayuscula, 
  tipoInput, 
  corta, 
  modalAgregar, 
  roles, 
  modalLoading, 
  paginaActual, 
  hasMorePages, 
  numRespuesta, 
  totalPaginas,
  buscarchange
  }
  },
}
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
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
}
</style>