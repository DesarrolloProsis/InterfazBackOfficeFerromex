<template>
  <div class="responsive-table">          
    <table class="tftable">
      <tr class="h-10">
        <th>
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 text-black 2xl:px-28">Usuario</label>
        </th>
        <th>
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 text-black 2xl:px-28">Nombre Completo</label>
        </th>
        <th>
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 text-black 2xl:px-28">Perfil</label>
        </th>
        <th>
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 text-black 2xl:px-28">Estatus</label>
        </th>
        <th>
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 text-black 2xl:px-28">Acciones</label>
        </th>
      </tr>
      <tr v-for="(usuario, index) in dataUsuarios" :key="index" v-show="usuario.nombreUsuario !='AdmPROSIS'">
        <td :class="{'text-gray-400': !usuario.estatus}">{{ usuario.nombreUsuario }}</td>
        <td :class="{'text-gray-400': !usuario.estatus}">{{ usuario.nombreCompleto }}</td>
        <td :class="{'text-gray-400': !usuario.estatus}">{{ usuario.rol }}</td>
        <td :class="{'text-gray-400': !usuario.estatus}">
          <span v-if="usuario.estatus == true">Activo</span>
          <span v-else>Desactivado</span>
        </td>
        <td>
          <div>
            <Multiselect v-model="accion" placeholder="Seleccione una Acción" @close="acciones_mapper(usuario)" :options="opticones_select_acciones(usuario)" >
              <template v-slot:singleLabel="{ value }">
                <div class="multiselect-single-label">
                  <img height="26" style="margin: 0 6px 0 0;"> {{ value.name }}
                </div>
              </template>
              <template v-slot:option="{ option }">
                <img height="22" style="margin: 0 6px 0 0;">{{ option.name }}
              </template>
            </Multiselect>
          </div>
        </td>
      </tr>
    </table>
  </div>
  <!--MODAL DE ACTUALIZAR CONTRASEÑA -->
  <Modal :show="modalPass" @cerrarmodal="modalPass = false, pass = '', passConfirm = '', mayuscula = true">
    <div>
      <p class="text-gray-900 font-bold text-xl -mt-8 mb-8 text-center">Cambiar Contraseña a {{ seleccionado.nombre + ' ' + seleccionado.apellidos }}</p>
      <div class="mt-2">
        <div class="grid grid-cols-2">
          <p class="mx-auto">Nueva Contraseña*:</p>
          <div class="w-full inline-flex relative flex-row-reverse">
            <input v-model="pass" class="border border-gray-300 rounded-lg mx-16 w-full " :type="tipoInput" :class="{'border-red-600': !mayuscula}" @input="mayuscula = true">
            <span @click="tipoInput == 'password' ? tipoInput = 'text' : tipoInput = 'password'" class="absolute mx-16 mt-1 curor-pointer">
              <fa v-if="tipoInput == 'password'" icon="eye" class="text-gray-600 w-5 h-5" />
              <fa v-else  icon="eye-slash" class="text-gray-600 w-5 h-5" />
            </span>
          </div>
          <span></span>
          <span v-if="!mayuscula" class="text-xs text-red-300 mx-auto">
            <p>Se necesita mínimo una mayuscula</p>
            <p>Se necesita mínimo 6 caracteres</p>
          </span>
        </div>
        <div class="grid grid-cols-2">
        <p class="mx-auto">Confirmar Contraseña*:</p>
        <div class="w-full inline-flex relative flex-row-reverse">
          <input v-model="passConfirm" class="border border-gray-300 rounded-lg mx-16 w-full " :type="tipoInputConfirm" :class="{'border-red-600': passConfirm != pass}">
          <span @click="tipoInputConfirm == 'password' ? tipoInputConfirm = 'text' : tipoInputConfirm = 'password'" class="absolute mx-16 mt-1 curor-pointer">
            <fa v-if="tipoInputConfirm == 'password'" icon="eye" class="text-gray-600 w-5 h-5" />
            <fa v-else  icon="eye-slash" class="text-gray-600 w-5 h-5" />
          </span>
        </div>
        <span></span>
        <span v-if="passConfirm != pass" class="text-xs text-red-300 mx-auto">
          <p>La contraseña no coincide</p>
        </span>
        </div>
      </div>
      <div class="mt-10 text-center mx-auto mb-4">
        <button @click="cambiarPass()" class="rounded-lg w-18 bg-ferromex text-white p-10">Cambiar Contraseña</button>
      </div>
      <h1 class="text-xl font-bold font-titulo text-center -mt-2">* Campo Obligatorio</h1>
    </div>
  </Modal>
  <!-- FIN MODAL-->
  <!-- MODAL COMFIRMAR -->
  <Modal :show="modalConfirmacion" @cerrarmodal="modalConfirmacion = false">
    <div>
      <div class="w-full flex items-center justify-center ">
          <fa icon="circle-exclamation" class="h-20 text-yellow-400"/>
          <p class="text-gray-900 font-medium text-lg mt-2 ml-6 text-center">Estas seguro de cambiar la contraseña del usuario {{ seleccionado.nombre.toUpperCase() + ' ' + seleccionado.apellidos.toUpperCase() }}</p>
      </div>
      <div class="mt-10 mb-4 w-full flex justify-center">
        <button @click="confirmar(seleccionado)" class="rounded-lg w-32 botonIconOk">Confirmar</button>
      </div>
    </div>
  </Modal>
  <!-- FIN MODAL-->
  <!-- MODAL EDITAR USUARIO -->
  <Modal :show="modalEditar" @cerrarmodal="modalEditar = false">
    <div>
      <p class="text-gray-900 font-bold text-2xl -mt-8 mb-8 text-center">Editar Usuario</p>
      <div class="grid grid-cols-2 mt-2">
        <p class="text-sm mb-1 mx-auto font-semibold text-gray-700">Nombre*:</p>
        <input v-model="usuario.nombre" class="border rounded-lg w-56" type="text" :class="{'border border-red-500': usuario.nombre.trim() == ''}">
        <p class="text-sm mb-1 font-semibold text-gray-700 mx-auto">Apellido(s)*:</p>
        <input v-model="usuario.apellidos" class="border rounded-lg w-56" type="text" :class="{'border border-red-500': usuario.apellidos.trim() == ''}">
      </div>
      <span v-if="usuario.nombre.trim() == '' || usuario.apellidos.trim() == ''" class="text-xs text-center text-red-300 mx-auto">
          <p>Todos los campos son obligatorios</p>
      </span>
      <div class="mt-10 text-center mx-auto mb-4">
        <button class="rounded-lg w-18 bg-ferromex text-white p-10" @click="editarUsuario(usuario)">Guardar</button>
      </div>
      <h1 class="text-xl font-bold font-titulo text-center -mt-2">* Campo Obligatorio</h1>
    </div>
  </Modal>
  <!-- FIN MODAL-->
  <!-- MODAL CAMBIAR ROL -->
  <Modal :show="modalRol"  @cerrarmodal="modalRol = false, validacion = false, seleccionado.rol = ''">
    <div>
      <p class="text-gray-900 font-bold text-2xl -mt-8 mb-8 text-center -mx-6">Cambiar Perfil a {{ usuario.nombre +' '+ usuario.apellidos }}</p>
      <p class="text-gray-900 font-bold text-2xl -mt-8 mb-8 text-center">con Perfil {{ usuario.rol }}</p>
      <div class="grid grid-cols-2 mt-2">      
        <p class="text-sm mb-1 font-semibold text-gray-700  text-center sm:-ml-6">Perfil*:</p>
        <Multiselect
          v-model="seleccionado.rol"
          placeholder="Seleccione un Rol"
          :searchable="true"
          :options="roles"
          :close-on-select="true"
          :class="{'border border-red-500': validacion}"
          class="w-52"
        />
        <span ></span>
        <span v-if="validacion" class="text-xs text-center text-red-300 mx-auto">
            <p>Todos los campos son obligatorios</p>
        </span>
      </div>
      <div class="mt-10 text-center mx-auto mb-4">
        <button @click="cambiarRol(usuario)" class="rounded-lg w-18 bg-ferromex text-white p-10">Guardar</button>
      </div>
      <h1 class="text-xl font-bold font-titulo text-center -mt-2">* Campo Obligatorio</h1>
    </div>
  </Modal>
  <!-- FIN MODAL-->
  <!-- MODAL CARGANDO -->
  <Spinner :modalLoading="modalLoading"/>
</template>
<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION//Constante que almacena la cadena de conexión a la API
import Spinner from '../components/Spinner.vue'//Componente spinner para las pantallas de carga
import Multiselect from '@vueform/multiselect'//Componente multiselect para el menú de acciones
import { ref,inject } from 'vue'//permite hacer referencia al tipo de dato que será la constante y asi volverla reactivaz
import { notify } from "@kyvg/vue3-notification";//muestra las notificaciones en las vistas
import Servicio from '../Servicios/Token-Services';//Servicio que importa la información del usuario
import Modal from "../components/Modal.vue"
//import router from '../router';

export default {
  name: "TablaListaUsuarios",
  props: {
    dataUsuarios: Array,//propiedad que almacena un array de información de cada usuario existente
  },
  components:{ Multiselect, Spinner, Modal },
  emits: ["refrescarTabla"],
    setup(props, {emit}) {
    const axios = inject('axios')
    const modalEditar = ref(false)//Constante que va a abrir el modal que permite editar el usuario
    const modalPass = ref(false)//Modal que va a abrir el modal que permite cambiar la contraseña del usuario
    const modalRol = ref(false)//Constancia que va a abrir el modal que permite cambiar el rol del usuario
    const modalLoading = ref(false)//Constante que permite abrir el modal con el spinner de las pantallas de cargas
    const seleccionado = ref({})//Constante que alamcena la información del usuario seleccionado para las distintas acciones
    const accion = ref(null)//Constante que hace referencia a la acción seleccionada 
    const validacion = ref(false)//Constane que habilita el mensaje de datos obligatorios en los diferentes modales.
    const usuario = ref({})
    const roles = ref([])//Constante que almacena los roles existentes
    const pass = ref('')//Constatnte que alamcena el password para la edición de la contraseña del usuario
    const status = ref('')//Constante que almacena el estatus del usuario para habilitarlo o deshabilitarlo
    const errorMessage = ref('')//Constante que almacena el mensaje de error que se da al hacer una petición
    const infoUser = Servicio.obtenerInfoUser()//Constante que trae toda la información del usuario que inicio sesión
    const tipoInput = ref('password')//Constante que almacena el tipo de input para poder ver la contraseña dentro del modal de cambiar contraseña
    const tipoInputConfirm = ref('password')//Constante que almacena el tipo de input para poder ver la contraseña dentro del modal de cambiar contraseña
    const mayuscula = ref(true)//Constante que almacena la respuesta de la validación si es que hya o no mayusculas para la contraseña
    const coinciden = ref(true)//Constante que alamcena la bandera para saber si las contraseñas coinciden
    const passConfirm = ref('')//Constante que almacena la confirmación de la contraseña, tiene que ser identica que la insertada
    const modalConfirmacion = ref(false)
    const modal_Rol = async () => {//Constante que abre el modal para cambiar el rol, y trae todos los roles existentes
      modalRol.value = true
      axios.get(`${API}/Identity/roles/%20/%20/%20/%20`)//Llamada al endpoint que trae los roles existentes
      .then((result) => {//Si el endpoint tiene una respuesta correcta
        for(let i=0; i<result.data.roles.length; i++){ //recorremos la respuesta, y cada que recorremos sumamos un 1 para el siguiente rol
          roles.value.push({'value':result.data.roles[i].nombreRol, 'label':result.data.roles[i].nombreRol})//asignamos los roles existentes a la variable roles, para mostrarlos en el multiselect
          if(result.data.roles[i].nombreRol == 'PINFRA'){
            var pin = result.data.roles[i].nombreRol
            roles.value.pop(pin)
          }
          if(result.data.roles[i].nombreRol == 'AdminIntermodal'){
            var inter = result.data.roles[i].nombreRol
            roles.value.pop(inter)
          }
          if(result.data.roles[i].nombreRol == 'Admin'){
            var adm = result.data.roles[i].nombreRol
            roles.value.pop(adm)
          }
        }
      }).catch((error)=>{//si el endpoint tiene un error
        console.log(error.request.response);//Mostramos en consola el error  que nos da el endpoint
        modalLoading.value = false //cerramos el spinner de carga
      })
    }
    function confirmar (usuario){//Función que se ejecuta cuando le damos clic al botón de Aceptar en el modal de cambiar la contraseña
      let data = { //literal que almacena el id del usuario y la nueva contraseña ingresada en el formulario
        "usuarioId": usuario.usuarioId, //id del usuario, viene desde el option mapper
        "password": pass.value //nueva password que se ingresó en el formulario
      }
      if(data.password.length >= 6){
        let mayusculas = 'ABCDEFGHYJKLMNÑOPQRSTUVWXYZ'//Literal que almacena todas las letras en mayusculas
        let contador = []
        for(let i = 0; i< data.password.length; i++){//Recorremos toda la palabra insertada en el password y si no encuentra alguna mayuscula no nos dejará insertar
          if (mayusculas.indexOf(data.password.charAt(i),0)!=-1)
            contador.push(true)
          else{
            mayuscula.value = false 
          }   
        }
        if(contador.includes(true)){
          mayuscula.value = true
        }
        if(mayuscula.value ==  true && passConfirm.value === pass.value){//Si hay mínimo una mayuscula en la 
          axios.put(`${API}/Identity/changePassword`, data)
          .then(() => {
            modalPass.value = false
            modalConfirmacion.value = false
            emit('refrescarTabla', true)//Se realiza el emit al componente padre, para refrescar la tabla con los cambios realizados
            notify({//Notifiación que se le muestra al usuario si se hizo el cmabio correcto
              title:'Cambio Exitoso',
              text:`Se cambió la contraseña al usuario ${usuario.nombre + ' ' + usuario.apellidos}`,
              type: 'success'
            });
            //axios.defaults.headers.common['Authorization'] = '' //Enviamos el token en la cabecera llamada Authorization porque todos los endpoints lo piden
            //router.push('/')//Redirigimos al Login
          })
          .catch((error) => {
            modalPass.value = false
            modalConfirmacion.value = false
            notify({//Notifiación que se le muestra al usuario si no se hace el cambio
              title:'Cambio Exitoso',
              text:`No se pudo cambiar la contraseña al usuario ${usuario.nombre + ' ' + usuario.apellidos}`,
              type: 'error'
            });
            console.log(error.request.response);
          })
        }else{
          modalConfirmacion.value = false
        }
      }else{
        mayuscula. value = false//Si existe una mayuscula en la contraseña
        modalConfirmacion.value = false
      }
    }
    function cambiarPass() {//Función que hace el cambio de contraseña del usuario seleccionado
      if(pass.value == '' && passConfirm.value == '')//Si la contraseña tiene espacios en blanco y está vacia
      {
        notify({//notificación de que el usuario se inserto correctamente
          title:'Nuevo Usuario',//titulo de la notificaci{on}
          text:`Todos los campos son obligatorios`,//texto de la notificación 
          duration: 20000,//duración de la notificación
          closeonclick:true,//si le damos click se cierra la notificación
          type: 'warn'//el tipo de notificación, si es success el color será verde
        });
      }else if(passConfirm.value != pass.value){
        notify({//notificación de que el usuario se inserto correctamente
          title:'Nuevo Usuario',//titulo de la notificaci{on}
          text:`Las contraseñas tienen que coincidir`,//texto de la notificación 
          duration: 20000,//duración de la notificación
          closeonclick:true,//si le damos click se cierra la notificación
          type: 'warn'//el tipo de notificación, si es success el color será verde
        });
      }else{
        modalConfirmacion.value = true
      }
    }
    function editarUsuario(usuario){//Función que hace la edioción del usuario, en cuanto a nombre y apellido
      let data = { //literal que almacena los datos para enviar al endpoint de la edición
        "usuarioId": usuario.usuarioId,
        "nombreUsuario": usuario.nombreUsuario,
        "nombre": usuario.nombre,
        "apellidos": usuario.apellidos,
        "rol": usuario.rol,
        "nombreCompleto": usuario.nombreCompleto,
        "estatus": usuario.estatus
      }
      if( data.nombreUsuario.trim() != '' && data.apellidos.trim() != '' ){
        axios.put(`${API}/Identity/editUser`, data)//endpoint que recibe un JSON con la información del usuario para editar
        .then(() => {//Si el endpoint tiene una respuesta correcta
          modalEditar.value = false
          emit('refrescarTabla', true)//Se realiza el emit al componente padre, para refrescar la tabla con los cambios realizados
          notify({//Notifiación que se le muestra al usuario si se hizo el cmabio correcto
            title:'Cambio Exitoso',
            text:`Se editó correctamente el usuario ${usuario.nombre + ' ' + usuario.apellidos}`,
            type: 'success'
          });
        })
        .catch(error => {//Si el endpoint tiene un error en la respuesta
          console.log(error.request.response);//Mostramos el error en la consola
          notify({//Notifiación que se le muestra al usuario si no se hace el cambio
            title:'Cambio Exitoso',
            text:`No se pudo editar el usuario ${usuario.nombre + ' ' + usuario.apellidos}`,
            type: 'error'
          });
        })
      }else{
        notify({//notificación de que el usuario se inserto correctamente
          title:'Nuevo Usuario',//titulo de la notificaci{on}
          text:`Todos los campos son obligatorios`,//texto de la notificación 
          duration: 5000,//duración de la notificación
          closeonclick:true,//si le damos click se cierra la notificación
          type: 'warn'//el tipo de notificación, si es success el color será verde
        });
      }
    }
    function cambiarEstatus(usuario) {//Función que cambia el estatus del usuario
      let data = { //literal que almacena los datos para enviar al endpoint de la edición
        "usuarioId": usuario.usuarioId,
        "nombreUsuario": usuario.nombreUsuario,
        "nombre": usuario.nombre,
        "apellidos": usuario.apellidos,
        "rol": usuario.rol,
        "nombreCompleto": usuario.nombreCompleto,
        "estatus": usuario.estatus = !usuario.estatus
      }
      axios.put(`${API}/Identity/editUser`, data)//endpoint que recibe un JSON con la información del usuario para editar
      .then(() => {
        emit('refrescarTabla', true)//Se realiza el emit al componente padre, para refrescar la tabla con los cambios realizados
        notify({
          title:'Cambio Exitoso',
          text:`Se cambió el estatus al usuario ${usuario.nombre + ' ' + usuario.apellidos}`,
          type: 'success'
        });
      }).catch((error) => {
        console.log(error.request.response);
        notify({
          title:'Cambio Exitoso',
          text:`No se pudo cambiar el estatus al usuario ${usuario.nombre + ' ' + usuario.apellidos}`,
          type: 'error'
        });
      })
    }
    function cambiarRol(usuario){//Función que cambia de rol al usuario
      let data = { //literal que almacena los datos para enviar al endpoint de la edición
        "usuarioId": usuario.usuarioId,
        "nombreUsuario": usuario.nombreUsuario,
        "nombre": usuario.nombre,
        "apellidos": usuario.apellidos,
        "rol": seleccionado.value.rol,
        "nombreCompleto": usuario.nombreCompleto,
        "estatus": usuario.estatus
      }
      if(data.rol != undefined){
        axios.put(`${API}/Identity/editUser`, data)//endpoint que recibe un JSON con la información del usuario para editar
        .then(() => {
          modalRol.value = false
          validacion.value = false
          seleccionado.value.rol = ''
          emit('refrescarTabla', true)//Se realiza el emit al componente padre, para refrescar la tabla con los cambios realizados
          notify({
            title:'Cambio Exitoso',
            text:`Se cambió el perfil del usuario ${usuario.nombre + ' ' + usuario.apellidos}`,
            type: 'success'
          });
        }).catch((error) => {
          console.log(error.request.response);
          notify({
            title:'No se pudo hacer el cambio',
            text:`No se pudo cambiar el rol del usuario ${usuario.nombre + ' ' + usuario.apellidos}`,
            type: 'error'
          });
        })
      }else{
        validacion.value = true
      }
    }
    function acciones_mapper(item){//Asignación de funciones de la lista de opciones que hay en el menú de acciones
      if(accion.value == 'Activar'){
        cambiarEstatus(item)//Llamamos a la función cambiarEstatus y le enviamos el parámetro del usuario que seleccionamos
      }
      if(accion.value == 'Desactivar'){
        cambiarEstatus(item)//Llamamos a la función cambiarEstatus y le enviamos el parámetro del usuario que seleccionamos
      }
      if(accion.value == 'Cambiar Contraseña'){
        seleccionado.value = item;//Asignamos los valores del usuario seleccionado a la constante seleccionado
        modalPass.value = true;//abrimos el modal para cambiar el password
      }
      if(accion.value == 'Editar Usuario'){
        modalEditar.value = true//Abrimos el modal para editar el usuario
        usuario.value = item//Asignamos los parametros utiles para la edición
      }
      if(accion.value == 'Cambiar Perfil'){
        modal_Rol()//Llamamos a la función que abre el modal para cambiar el Rol
        usuario.value = item//Asignamos los parametros utiles para la edición
      }
      accion.value = ""
    }
    function opticones_select_acciones(item){//Lista de opciones que se muestran en el menú de acciones
      let options = [
          {  value: 'Activar', name: 'Activar'},//0
          {  value: 'Desactivar', name: 'Desactivar'},//1
          {  value: 'Cambiar Contraseña', name: 'Cambiar Contraseña'},//2
          {  value: 'Editar Usuario', name: 'Editar Usuario'},//3
          {  value: 'Cambiar Perfil', name: 'Cambiar Perfil'},//4
      ]
      let filtroOpciones = []
          if(item.estatus == false)
            filtroOpciones.push(options[0])
          if(item.estatus ==  true){
            filtroOpciones.push(options[3])
            if(item.usuarioId != infoUser.sub){
              filtroOpciones.push(options[1])
              filtroOpciones.push(options[4])
            }
            if(infoUser.role == "AdminIntermodal") //Si el usuario solo es AdminIntermodal solo el podra cambiar las contraseñas
              filtroOpciones.push(options[2])
          }
      return filtroOpciones  //Regresamos la lista de acciones filtrada
    }
    return{ cambiarRol, cambiarEstatus, editarUsuario, cambiarPass, modal_Rol, acciones_mapper, opticones_select_acciones, confirmar, modalConfirmacion, coinciden, passConfirm, tipoInputConfirm, mayuscula, tipoInput, infoUser, modalEditar, modalPass, modalRol, modalLoading, seleccionado, accion, validacion, usuario, roles, pass, status, errorMessage }
  }
}
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped>
.responsive-table {
  padding-top: 20px;
  max-height: 640px;
}
.tftable {
  font-size: 12px;
  color: #333333;
  width: 100%;
}
.tftable td {
  font-size: 14px;
  border-bottom-width: 2px;
  border-left-width: 5px;
  border-right-width: 5px;
  border-top-width: 2px;
  padding: 8px;
  border-style: solid;
  border-bottom-color: #a1a1a1;
  border-left-color: white;
  border-right-color: white;

  text-align: center;
}
.bg-ferromex {
  background-color: #BB2028;
  padding: 10px 5px;
}
.input-container {
  display: -ms-flexbox;
  /* IE10 */
  display: flex;
  width: 100%;
  margin-bottom: 15px;
}
</style>