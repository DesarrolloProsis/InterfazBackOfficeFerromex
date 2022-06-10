<template>
  <div class="responsive-table">          
    <table class="tftable">
      <tr class="h-10">
        <th>
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 text-black 2xl:px-28">Nombre de Usuario</label>
        </th>
        <th>
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 text-black 2xl:px-28">Nombre</label>
        </th>
        <th>
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 text-black 2xl:px-28">Estatus</label>
        </th>
        <th>
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 text-black 2xl:px-28">Acciones</label>
        </th>
      </tr>
      <tr v-for="(usuario, index) in dataUsuarios" :key="index">
        <td :class="{'text-gray-300': !usuario.estatus}">{{ usuario.nombreUsuario }}</td>
        <td :class="{'text-gray-300': !usuario.estatus}">{{ usuario.nombreCompleto }}</td>
        <td :class="{'text-gray-300': !usuario.estatus}">
          <span v-if="usuario.estatus == true">Activo</span>
          <span v-else>Inactivo</span>
        </td>
        <td>
          <div>
            <Multiselect v-model="accion" placeholder="Sleccione una Acción" @close="acciones_mapper(usuario)" label="name" trackBy="name" :options="opticones_select_acciones(usuario)" :searchable="true">
              <template v-slot:singleLabel="{ value }">
                <div class="multiselect-single-label">
                  <img height="26" style="margin: 0 6px 0 0;" :src="value.icon"> {{ value.name }}
                </div>
              </template>
              <template v-slot:option="{ option }">
                <img height="22" style="margin: 0 6px 0 0;" :src="option.icon">{{ option.name }}
              </template>
            </Multiselect>
          </div>
        </td>
      </tr>
    </table>
  </div>
  <!--MODAL DE ACTUALIZAR CONTRASEÑA -->
  <Modal :show="modalPass" @cerrarmodal="modalPass = false">
    <div>
      <p class="text-gray-900 font-bold text-xl -mt-8 mb-8 text-center">Cambiar Contraseña a {{ seleccionado.nombre + ' ' + seleccionado.apellidos }}</p>
      <div class="grid grid-cols-2 mt-2">
        <p class="mx-auto">Nueva Contraseña:</p>
        <input v-model="pass" class="border-b-2 rounded-lg mx-auto" type="password" :class="{'border-red-600': validacion}">
        <span></span>
        <span v-if="validacion" class="text-xs text-red-600 text-center">Campo Obligatorio</span>
      </div>
      <div class="mt-10 text-center mx-auto mb-4">
        <button @click="cambiarPass(seleccionado)" class="rounded-lg w-18 bg-ferromex text-white p-10">Cambiar Contraseña</button>
      </div>
    </div>
  </Modal>
  <!-- FIN MODAL-->
  <!-- MODAL EDITAR USUARIO -->
  <Modal :show="modalEditar" @cerrarmodal="modalEditar = false">
    <div>
      <p class="text-gray-900 font-bold text-2xl -mt-8 mb-8 text-center">Editar Usuario</p>
      <div class="grid grid-cols-2 mt-2">
        <p class="text-sm mb-1 mx-auto font-semibold text-gray-700">Nombre</p>
        <input v-model="usuario.nombre" class="border rounded-lg w-56" type="text">
        <p class="text-sm mb-1 font-semibold text-gray-700 mx-auto">Apellido(s)</p>
        <input v-model="usuario.apellidos" class="border rounded-lg w-56" type="text">
      </div>
      <div class="mt-10 text-center mx-auto mb-4">
        <button class="rounded-lg w-18 bg-ferromex text-white p-10" @click="editarUsuario(usuario)">Editar Usuario</button>
      </div>
    </div>
  </Modal>
  <!-- FIN MODAL-->
  <!-- MODAL CAMBIAR ROL -->
  <Modal :show="modalRol"  @cerrarmodal="modalRol = false">
    <div>
      <p class="text-gray-900 font-bold text-2xl -mt-8 mb-8 text-center -mx-6">Cambiar Rol a {{ usuario.nombre +' '+ usuario.apellidos }}</p>
      <p class="text-gray-900 font-bold text-2xl -mt-8 mb-8 text-center">con Rol {{ usuario.rol }}</p>
      <div class="grid grid-cols-2 mt-2">      
        <p class="text-sm mb-1 font-semibold text-gray-700  text-center sm:-ml-6">Rol</p>
        <Multiselect
          v-model="seleccionado.rol"
          placeholder="Seleccione un Rol"
          :searchable="true"
          :options="roles"
          :close-on-select="true"
          class="w-52"
        />
      </div>
      <div class="mt-10 text-center mx-auto mb-4">
        <button @click="cambiarRol(usuario)" class="rounded-lg w-18 bg-ferromex text-white p-10">Cambiar Rol</button>
      </div>
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
import { ref } from 'vue'//permite hacer referencia al tipo de dato que será la constante y asi volverla reactivaz
import { notify } from "@kyvg/vue3-notification";//muestra las notificaciones en las vistas
import Servicio from '../Servicios/Token-Services';//Servicio que importa la información del usuario
import axios from "axios";
import Modal from "../components/Modal.vue"

export default {
  name: "TablaListaUsuarios",
  props: {
    dataUsuarios: Array,//propiedad que almacena un array de información de cada usuario existente
  },
  components:{ Multiselect, Spinner, Modal },
  //emits: ["refrescarTabla"],
    setup() {
    
    const modalEditar = ref(false)//Constante que va a abrir el modal que permite editar el usuario
    const modalPass = ref(false)//Modal que va a abrir el modal que permite cambiar la contraseña del usuario
    const modalRol = ref(false)//Constancia que va a abrir el modal que permite cambiar el rol del usuario
    const modalLoading = ref(false)//Constante que permite abrir el modal con el spinner de las pantallas de cargas
    const seleccionado = ref({})//Constante que alamcena la información del usuario seleccionado para las distintas acciones
    const accion = ref(null)//Constante que hace referencia a la acción seleccionada 
    const validacion = ref(false)//Constane que habilita el mensaje de datos obligatorios en los diferentes modales.
    const usuario = ref({ usuarioId:'', nombre: '', apellidos:'', rol:'',  estatus: '' })
    const roles = ref([])//Constante que almacena los roles existentes
    const pass = ref('')//Constatnte que alamcena el password para la edición de la contraseña del usuario
    const status = ref('')//Constante que almacena el estatus del usuario para habilitarlo o deshabilitarlo
    const errorMessage = ref('')//Constante que almacena el mensaje de error que se da al hacer una petición

    const modal_Rol = async () => {
      modalRol.value = true
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
    function cambiarPass(usuario) {//Función que hace el cambio de contraseña del usuario seleccionado
      console.log(usuario);
      let data = { //literal que almacena el id del usuario y la nueva contraseña ingresada en el formulario
        "usuarioId": usuario.usuarioId, //id del usuario, viene desde el option mapper
        "password": pass.value //nueva password que se ingresó en el formulario
      }
      console.log(data);
      axios.put(`${API}/ferromex/changePass`, data)
      .then((result) => {//Si el endpoint tiene una respuesta correcta
        console.log(result);
        notify({//Notificación que se les muestra al usuario cuando se cambia de manera correcta
          title:'Cambio Exitoso',
          text:`Se cambió el estatus al usuario ${usuario.nombre + ' ' + usuario.apellidos}`,
          type: 'success'
        });
      }).catch((error) => {//Su el endpoint tiene un error en la respuesta
        console.log(error);
        notify({//Notificación que se les muestra a los usuarios cuando no se realiza el cambio
          title:'Cambio Exitoso',
          text:`No se pudo cambiar el estatus al usuario ${usuario.nombre + ' ' + usuario.apellidos}`,
          type: 'error'
        });
      })
    }
    function editarUsuario(usuario){//Función que hace la edioción del usuario, en cuanto a nombre y apellido
      console.log(usuario);
      let data = { //literal que almacena los datos para enviar al endpoint de la edición
        "usuarioId": usuario.usuarioId,
        "nombre": usuario.nombre,
        "apellido": usuario.apellidos,
        "rol": usuario.rol,
        "estatus": usuario.estatus
      }
      console.log(data);
      axios.put(`${API}/ferromex/editUser`, data)//endpoint que recibe un JSON con la información del usuario para editar
      .then((result) => {//Si el endpoint tiene una respuesta correcta
        console.log(result);
        notify({//Notifiación que se le muestra al usuario si se hizo el cmabio correcto
          title:'Cambio Exitoso',
          text:`Se cambió el estatus al usuario ${usuario.nombre + ' ' + usuario.apellidos}`,
          type: 'success'
        });
      }).catch((error) => {//Si el endpoint tiene un error en la respuesta
        console.log(error);//Mostramos el error en la consola
        notify({//Notifiación que se le muestra al usuario si no se hace el cambio
          title:'Cambio Exitoso',
          text:`No se pudo cambiar el estatus al usuario ${usuario.nombre + ' ' + usuario.apellidos}`,
          type: 'error'
        });
      })
    }
    function cambiarEstatus(usuario) {//Función que cambia el estatus del usuario
      let data = {
        "usuarioId": usuario.usuarioId,
        "nombre": usuario.nombre,
        "apellido": usuario.apellidos,
        "rol": usuario.rol,
        "estatus": usuario.estatus = !usuario.estatus //Cambia el valor de la variable estatus, solo cambia al valor opuesto al que est{a en ese momento}
      }
      axios.put(`${API}/ferromex/editUser`, data)//endpoint que hace la edición del usuario
      .then((result) => {
        console.log(result);
        notify({
          title:'Cambio Exitoso',
          text:`Se cambió el estatus al usuario ${usuario.nombre + ' ' + usuario.apellidos}`,
          type: 'success'
        });
      }).catch((error) => {
        console.log(error);
        notify({
          title:'Cambio Exitoso',
          text:`No se pudo cambiar el estatus al usuario ${usuario.nombre + ' ' + usuario.apellidos}`,
          type: 'error'
        });
      })
    }
    function cambiarRol(usuario){//Función que cambia de rol al usuario
      console.log(usuario);
      let data = {
        "usuarioId": usuario.usuarioId,
        "nombre": usuario.nombre,
        "apellido": usuario.apellidos,
        "rol": seleccionado.value.rol,
        "estatus": usuario.estatus
      }
      console.log(data);
      axios.put(`${API}/ferromex/editUser`, data)
      .then((result) => {
        console.log(result);
        notify({
          title:'Cambio Exitoso',
          text:`Se cambió el estatus al usuario ${usuario.nombre + ' ' + usuario.apellidos}`,
          type: 'success'
        });
      }).catch((error) => {
        console.log(error);
        notify({
          title:'Cambio Exitoso',
          text:`No se pudo cambiar el estatus al usuario ${usuario.nombre + ' ' + usuario.apellidos}`,
          type: 'error'
        });
      })
    }
    function acciones_mapper(item){
      if(accion.value == 'Habilitar'){
        cambiarEstatus(item)
      }if(accion.value == 'Deshabilitar'){
        cambiarEstatus(item)
      }if(accion.value == 'Cambiar Contraseña'){
        seleccionado.value = item;
        modalPass.value = true;
      }if(accion.value == 'Editar Usuario'){
        modalEditar.value = true
        usuario.value.nombre = item.nombre
        usuario.value.apellidos = item.apellidos
        usuario.value.rol = item.rol
        usuario.value.estatus = item.estatus
        usuario.value.usuarioId = item.usuarioId
      }if(accion.value == 'Cambiar Rol'){
        modal_Rol()
        usuario.value.nombre = item.nombre
        usuario.value.apellidos = item.apellidos
        usuario.value.rol = item.rol
        usuario.value.estatus = item.estatus
        usuario.value.usuarioId = item.usuarioId
      }
      accion.value = ""
    }
    function opticones_select_acciones(item){
      let info = Servicio.obtenerInfoUser()
      let options = [
          {  value: 'Habilitar', name: 'Habilitar'},//0
          {  value: 'Deshabilitar', name: 'Deshabilitar'},//1
          {  value: 'Cambiar Contraseña', name: 'Cambiar Contraseña'},//2
          {  value: 'Editar Usuario', name: 'Editar Usuario'},//3
          {  value: 'Cambiar Rol', name: 'Cambiar Rol'},//4
      ]
      let filtroOpciones = []
          if(item.estatus == false)
            filtroOpciones.push(options[0])
          if(item.estatus ==  true){
            filtroOpciones.push(options[3])
            filtroOpciones.push(options[4])
            if(item.id != info.UsuarioId){
              filtroOpciones.push(options[1])
            }
            filtroOpciones.push(options[1])
            filtroOpciones.push(options[2])
          }
      return filtroOpciones  
    }
    return{ cambiarRol, cambiarEstatus, editarUsuario, cambiarPass, modal_Rol, acciones_mapper, opticones_select_acciones, modalEditar, modalPass, modalRol, modalLoading, seleccionado, accion, validacion, usuario, roles, pass, status, errorMessage }
  }
}
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped>
.modal-container{
    position: fixed;
    width: 100%;
    height: 100vh;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
}
.input-pass {
  width: 100%;
  font-size: 20px;
  border: 1px solid black;
  padding: 5px;
}
.button {
  padding: 5px 10px;
  border-radius: 10px;
  min-width: 100px;
}
.button:focus {
  outline: 0;
}
.btn-actualizar {
  background-color: #55f768;
  color: #00be0f;
}

.btn-activo {
  background-color: #614dff;
  color: #000071;
}
.btn-inactivo {
  background-color: #ff3131;
  color: #6f0404;
}
.responsive-table {
  padding-top: 20px;
  overflow-x: auto;
  overflow-y: auto;
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
</style>