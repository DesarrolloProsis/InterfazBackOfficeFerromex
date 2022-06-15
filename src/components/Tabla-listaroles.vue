<template>
  <div class="responsive-table">
    <table class="tftable">
      <tr class="h-10">
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
      <tr v-for="(rol, index) in infoRoles" :key="index">
        <td :class="{'text-gray-300': rol.estatus == false}">{{ rol.nombreRol }}</td>
        <td :class="{'text-gray-300': rol.estatus == false}">
          <span v-if="rol.estatus == true">Activo</span>
          <span v-if="rol.estatus == false">Inactivo</span>
        </td>
        <td class="w-66">
          <div class="w-66 mx-auto">
            <Multiselect v-model="value" placeholder="Sleccione una Acción" @close="acciones_mapper(rol)" label="name" trackBy="name" :options="opticones_select_acciones(rol,index)" :searchable="true">
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
  <br />
  <!-- Editar Rol -->
  <Modal :show="modalModulos" @cerrarmodal="modalModulos = false">
    <div>
      <p class="text-gray-900 font-bold text-2xl -mt-8 mb-8 text-center">Actualizar Módulos {{ perfilSelected.name }}</p>
      <div class="grid grid-cols-2 mt-2" v-for="(modulos, index) in modulos" :key="index">
        <p class="text-center">{{ modulos.label }}</p>
        <p class="text-center">
          <button class="btn btn-active cursor-auto">Activo</button>
        </p>
      </div>
      <div class="grid grid-cols-2 mt-6">      
        <p class="text-sm mb-1 font-semibold text-gray-700 text-center ">Modulos a Asignar</p>
        <Multiselect
          v-model="asignarModulos"
          placeholder="Seleccione los modulos par este rol"
          mode="multiple"
          :searchable="true"
          :options="modulosExistentes"
          :close-on-select="false"
          class="w-52"
        />
      </div>
      <div class="mt-10 text-center mx-auto mb-4">
        <button @click="editarModulos(perfilSelected.nombreRol, asignarModulos)" class="rounded-lg w-18 bg-ferromex text-white p-10">Guardar</button>
      </div>
    </div>
  </Modal>
</template>
<script>
import Servicio from '../Servicios/Token-Services'; //Importamos el Servicio de Toke, para obtener información del usuario con base en el token
import Multiselect from '@vueform/multiselect' //Importamos el componente Multiselect para utilizarlo en la columna Acciones o en el modal de asignar módulos
import axios from 'axios';
import Modal from '../components/Modal.vue'
import { ref } from 'vue'
import { notify } from "@kyvg/vue3-notification"; //Componente para generar notificaciones
const API = process.env.VUE_APP_URL_API_PRODUCCION //Constante que nos almacena la cadena de conexión a la API
export default {
  name: "TablaListaPerfiles",//Nombre del componente que se mostrar en el vuex
  props: ["infoRoles"],//propiedad que almacena los valores de cada uno de los roles
  components:{
    Multiselect, //Utilizamos el componente para su implementación
    Modal,//Componente Modal
  },
  setup(){
    const modalModulos = ref(false)//Constante que permite abrir o cerrar el modal de módulos asignados     
    const perfilSelected = ref({})//Cnstante que almacena los valores del rol seleccionado
    const value = ref('')//Constante almacena el valor de la opción seleccionada en el multiselect de Acciones
    const modulos = ref([])//Constante que almacena todos los módulos que tiene asignados a un rol en especifico
    const asignarModulos = ref([])//Constante que almacena el array de módulos que se van a asignar a un rol en especifico
    const modulosExistentes = ref([])//Constante que almacena todos los módulos existentes
    const infoUser = Servicio.obtenerInfoUser() //Constante que obtiene la información del usuario

    function cambiarEstatus (rol){//Funciòn praa cambiar el estatus del rol
      let data = {//Literal que va a almacenar la informacion del rol para poder enviarlo al endpoint
        "idRol": rol.idRol,
        "nombreRol": rol.nombreRol,
        "estatus" : rol.estatus = !rol.estatus//Cambia el valor de la variable estatus, solo cambia al valor opuesto al que est{a en ese momento}
      }  
      axios.put(`${API}/Identity/editRole`, data)//endpoint que hace la edición del rol
      .then(() => {//Si el endpoint tiene una respuesta correcta
        notify({//Notifiación que se muestra cuando se realiza el cambio de una manera correcta
          title:'Cambio Exitoso',
          text:`Se cambió el estatus al Rol ${rol.nombreRol}`,
          type: 'success'
        });
      }).catch((error) => {
        console.log(error.request.response);
        notify({//Notificación que se muestra cuando no se puede hacer el cambio de manera correcta
          title:'Cambio Fallido',
          text:`No se pudo cambiar el estatus al Rol ${rol.nombreRol}`,
          type: 'error'
        });
      })
    }
    function modulosExistente(){//Función para obtener todos los modulos registrados
      axios.get(`${API}/Ferromex/modules`)//Endpoint que trae todos los modulos que existen
      .then((result)=>{//Si el endpoint tiene una respuesta correcta
        for(let i=0; i<result.data.content.length; i++){ //recorremos la respuesta, y cada que recorremos sumamos un 1 para el siguiente rol
          modulosExistentes.value.push({'value':result.data.content[i].id, 'label':result.data.content[i].nameModule})//asignamos los roles existentes a la variable roles, para mostrarlos en el multiselect
        }
      })
    }
    function traerModulos(rol){//Función que trae los modulos asignados a un rol en especifico
      modulosExistente()//Llamamos a la función que trae todos los roles, para llenar el multiselect
      modulos.value = []
      axios.get(`${API}/Ferromex/modules?role=${rol.nombreRol}`)//Endpoint que trae los módulos asignados a un rol en especificio, si no le mandamos ningún rol, trae todos los módulos
      .then((result)=>{//Si el endpoint tiene una respuesta correcta
        for(let i=0; i<result.data.content.length; i++){ //recorremos la respuesta, y cada que recorremos sumamos un 1 para el siguiente rol
          modulos.value.push({'value':result.data.content[i].id, 'label':result.data.content[i].nameModule})//asignamos los roles existentes a la variable roles, para mostrarlos en el multiselect
        }
      })
    }
    function editarModulos(rol, modulos){//Función que permite agregar o quitar módulos a un rol en especifico, recibe el nombre del rol y un array con los módulos a asignar
      if(modulos.length === 0){// Si no se ha seleccionado ningún módulo, no nos va a permitir actualizarlos
        notify({//Notificación que se muestra cuando no se puede hacer el cambio de manera correcta
          title:'Sin Módulos Seleccionados',
          text:`Se debe de seleccionar mínimo un módulo para el rol`,
          type: 'warn',
          duration:5000,
        });
      }else{//Si se seleccionó mínimo un módulo, se puede hacer la actualización
        let data = {//literal que alamacena el nombre del rol y los módulos, para enviarlo en le body del endpoint
          'roleName': rol,
          'modules': modulos
        }
        axios.post(`${API}/Ferromex/addRoleModules`, data)//Enpoint que asigna los módulos a un rol en especifico
        .then(()=> {//Si el endpoint tiene una respuesta correcta
          modalModulos.value = false //cerramos el modal de asignación de módulos
          notify({//Notifiación que se muestra cuando se realiza el cambio de una manera correcta
            title:'Cambio Exitoso',
            text:`Se cambiaron los módulos al Rol ${rol}`,
            type: 'success'
          });
        }).catch((error) => {//Si el endpoint tiene un error en la respuesta
          console.log(error.request.response);
          modalModulos.value = false //cerramos el modal de asignación de módulos
          notify({//Notificación que se muestra cuando no se puede hacer el cambio de manera correcta
            title:'Cambio Fallido',
            text:`No se pudo cambiar los módulos al Rol ${rol.name}`,
            type: 'error'
          });
        }) 
      }
    }
    function acciones_mapper(rol){//Opciones que se presentan en la columna de Acciones
      if(value.value == 'Habilitar'){//Cuando seleccionamos la opción Habilitar
        cambiarEstatus(rol)//Mandamos a llamar a la función para cambiar el estatus del Rol
      }
      if(value.value == 'Deshabilitar'){//Cuando seleccionamos la opción Deshabilitar
        cambiarEstatus(rol)//Mandamos a llamar a la función para cambiar el estatus del Rol
      }
      if(this.value == 'Editar Modulos'){//Cuando seleccionamos la opción Editar Módulos
        modulosExistentes.value = [{}] //Limpiamos el array que contiene todos los roles, para que no aparezcan los que seleccionamos antes
        traerModulos(rol)//Llamamos a la función que trae los módulos asignados al rol seleccionado
        perfilSelected.value = rol//asignamos los valores del rol seleccionado a la variable perfilSelected, para poder mostralos en el modal
        modalModulos.value = true//Abrimos el modal de los módulos asignados
      }
      value.value = ""
    }
    function opticones_select_acciones(rol){//Función que asigna las opciones dependiendo de el estatus del rol
      let options= [//literal que almacena un array de opciones que se presentan en la columna de Acciones, value corresponde al valor de la opción y name es el texto que se presentará en la columna de Acciones
          {  value: 'Habilitar', name: 'Habilitar'},//0 
          {  value: 'Deshabilitar', name: 'Deshabilitar'},//1
          {  value: 'Editar Modulos', name: 'Editar Modulos'},//2
      ]
      let filtroOpciones = [] //Literal que nos da las opciones filtradas que se presentan en la columna de acciones
        if(rol.estatus == false)
          filtroOpciones.push(options[0])
        if(rol.nombreRol != infoUser.role && rol.estatus == true){
          filtroOpciones.push(options[1])
          filtroOpciones.push(options[2])    
        }
      return filtroOpciones //Regresamos el array con las opciones ya filtradas
    }

    return { modalModulos, perfilSelected, value, modulos, asignarModulos, modulosExistentes, infoUser, cambiarEstatus, modulosExistente, traerModulos,editarModulos, acciones_mapper, opticones_select_acciones }
  }
};
</script>
<style scoped>
.bg-ferromex {
  background-color: #BB2028;
  padding: 10px 5px;
}
.modal-container{
    position: fixed;
    width: 100%;
    height: 100vh;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
}
.btn {
  padding: 5px;
  border-radius: 5px;
  margin-top: 10px;
}
.btn-active {
  background-color: green;
  color: white;
}
.btn-inactive {
  background-color: grey;
  color: white;
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
  background-color: #f7ac55;
  color: #6e0400;
}
.btn-seleccionar {
  background-color: #4dffea;
  color: #025c51;
}
.btn-activo {
  background-color: #00b158;
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
</style>
