<template>
  <div class="responsive-table overflow-auto">
    <table class="tftable">
      <tr class="h-10">
        <th class="">
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 font-bold text-black">Tag</label>
        </th>
        <th class="">
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 font-bold text-black">Estatus</label>
        </th>
        <th class="">
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 font-bold text-black">Fecha</label>
        </th>
        <th class="">
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 font-bold text-black">No Economico</label>
        </th>
        <th class="">
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 font-bold text-black">No Placa</label>
        </th>
        <th class="">
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 font-bold text-black">Acciones</label>
          </th>
      </tr>
        <tr v-for="(cruces, index) in dataCruces" :key="index"  class="text-black">
        <td :class="{'text-gray-400':!cruces.active}">{{cruces.tag}}</td>
        <td v-if = "cruces.active == true">Activo</td>
        <td v-else :class="{'text-gray-400':!cruces.active}">Desactivado</td>
        <td :class="{'text-gray-400':!cruces.active}" >{{moment.utc(cruces.insertionDate).local().format("YYYY-MM-DD HH:mm:ss a")}}</td>
        <td :class="{'text-gray-400':!cruces.active}">{{cruces.economicNumber}}</td>
        <td :class="{'text-gray-400':!cruces.active}">{{cruces.vehiclePlate}}</td>
        <td class="w-66">
          <div class="w-66 mx-auto">
            <Multiselect v-model="select" placeholder="Seleccione una Acción" @close="acciones_mapper(cruces)"  :options="opticones_select_acciones(cruces)">
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
  <Modal :show="showModalAdvertencia" @cerrarmodal="cerralmodalpadre">
    <div>
        <div class="w-full flex items-center justify-center">
          <fa icon="circle-exclamation" class="h-20 text-yellow-400" />
          <p class="text-gray-900 font-medium text-lg ml-2 text-justify">Estas a punto de <label :class="{'text-green-600':texto == 'activar','text-yellow-600' :texto === 'desactivar','text-red-600' :texto === 'eliminar',  }">{{texto}}</label> el tag "{{infotag.tag}}" estas seguro</p>
        </div>
        <div class="mt-10 mb-4 w-full flex justify-center">
          <button class="rounded-lg w-32 botonIconOk" @click="accion(texto)">Confirmar</button>
        </div> 
    </div>   
  </Modal>
</template>
<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION
import moment from 'moment'
import { ref,inject } from 'vue'
import Modal from "../components/Modal.vue"
import Multiselect from '@vueform/multiselect'//Importamos el componente multiselect para la selección de modulos a asignar
import { notify } from "@kyvg/vue3-notification";
export default {
  name: "TablaBusquedaCruces",
  components: {
    Modal,
    Multiselect
  },
  emits:["actualizartabla"],
  props: ["dataCruces"],
  created: function () {
    this.moment = moment;
  },
  setup(props ,{ emit }){
    //Declaracion de variable
      const axios = inject('axios')
      const showModalAdvertencia = ref(false)//Variable que manipula el modal de advertencia
      const texto = ref('') //Variable que contiene el texto del modal
      const select = ref('') // Variable que contiene el valor del multiselect
      const infotag = ref({}) // Variable para asignar todo el valor del tag
    //Funcion que emitimos al modal para que se cierre
    const cerralmodalpadre = (modal) => { //Se abre la funcion con un parametro que recibimos desde el modal
      showModalAdvertencia.value = modal //Recibimos el valor de la varible y la asignamos al padre para que cerrar el modal
      texto.value = "" //Limpiamos el texto que mostramos en el modal
      emit("actualizartabla",true) //Emitimos un evento para actualizar la tabla con el endpoint de la primera carga
    }//Cerramos funcion
    //Funcion que determina la accion del modal de advertencia
      function accion(texto){ //Se abre la funcion con el parametro del texto esta la utilizamos para decidir que accion realizar
        const tag = { //Declaracion del objeto a enviar
            "tag" : infotag.value.tag,
            "insertionDate": infotag.value.insertionDate,
            "active": infotag.value.active = !infotag.value.active,
            "idUser": "",
            "vehiclePlate" : infotag.value.vehiclePlate,
            "economicNumber" :  infotag.value.economicNumber,
            "IDVIATags": infotag.value.idViatags
        }
        const ruta = encodeURI(`${API}/Ferromex/editartag`) //Deeclaramos la ruta edl enpoint y la codificamos con encodeURI
        if(texto == "activar" || texto == "desactivar"){ //si es texto es habilitar o deshabilitar debemos modificar el estatus del tag
          axios.put(ruta,tag) //Llamamos Axios enviandole la ruta y el obejto del tag 
          .then(()=>{        //En caso de que sea exitosa entra aqui 
          emit("actualizartabla",true) //Actualizamos los resultados de la tabla
          notify({                //Enviamos una notificacion de que el estatus se modifico de manera correcta 
            title:'Tag Modificado',
            text:'El estatus del tag cambio correctamente' ,
            type: 'success'//Declaramos el tipo de notificacion que buscamos
          });
          })
          .catch((err) =>{// si hay error entra aqui
          console.log(err);
            notify({ //Enviamos una notificacion
            title:'Upps ocurrio un error ' + err.request.status, //mostramos el numero del error en el titulo
            text: err.request.responseText, //Mostramos el error ocurrido
            type: 'error' //Declaramos el tipo de notificacion que buscamos
            });
            emit("actualizartabla",true) //Actualizamos los resultados de la tabla
          })
        }else if(texto == "eliminar"){
          axios.delete(`${API}/Ferromex/eliminartag/${infotag.value.tag}`)//Mandamos a llamar el end point para eliminar un tag
          .then(()=>{ 
          emit("actualizartabla",true) //Actualizamos la tabla 
          notify({ //Notiificamos que el tag fue elimiado
            title:'Tag Eliminado',
            text:'El tag se elimino de forma correcta' ,
            type: 'error'
          });
          })
          .catch((err) =>{ 
            notify({//Enviamos una notificacion
            title:'Upps ocurrio un error ' + err.request.status, //mostramos el numero del error en el titulo
            text: err.request.responseText, //Mostramos el error ocurrido
            type: 'error' //Declaramos el tipo de notificacion que buscamos
            });
            emit("actualizartabla",true)//Actualizamos los resultados de la tabla
            })
        }
        showModalAdvertencia.value = !showModalAdvertencia.value //Cerramos el modal 
        select.value = ""
      }
      function opticones_select_acciones(item){//Lista de opciones que se muestran en el menú de acciones
      let filtroOpciones = [] //Declaramos el arreglo de que contendran las opciones
      let options = [ //Declaramos el arreglo que contiene las acciones posibles 
          {  value: '0', name: 'Activar'},//0
          {  value: '1', name: 'Desactivar'},//1
          {  value: '2', name: 'Eliminar'},//2
      ]
          if(item.active == true){ //Si el estatus del tag es activo entonces 
            filtroOpciones = []
            filtroOpciones.push(options[1])//Agregamos la opcion de deshabilitar
            //filtroOpciones.push(options[2])//Agregamos la opcion de Eliminar
          }
          if(item.active ==  false){//Si el estatus del tag es inactivo
            filtroOpciones = []
            filtroOpciones.push(options[0])//Agregamos la opcion de habilitar
            //filtroOpciones.push(options[2])//Agregamos la opcion de eliminar
          }
      return filtroOpciones  //Regresamos la lista de acciones filtrada
    }
    function acciones_mapper(item){//Asignación de funciones de la lista de opciones que hay en el menú de acciones
      if(select.value == '0'){ //Apartir del value del multiselect asignamos un valor al texto 
        showModalAdvertencia.value = !showModalAdvertencia.value //Abrimos nuestro modal de advertencia
        texto.value = "activar"//Si es 0 el texto sera habilitar
        infotag.value = item //Asignamos la informacion del tag a nuestra varible reactiva de vue
      }if(select.value == '1'){
        showModalAdvertencia.value = !showModalAdvertencia.value //Abrimos nuestro modal de advertencia
        texto.value = "desactivar"//Si es 1 el texto sera deshabilitar
        infotag.value = item//Asignamos la informacion del tag a nuestra varible reactiva de vue
      }if(select.value == '2'){
        showModalAdvertencia.value = !showModalAdvertencia.value //Abrimos nuestro modal de advertencia
        texto.value = "eliminar"//Si es 1 el texto sera eliminar
        infotag.value = item//Asignamos la informacion del tag a nuestra varible reactiva de vue
      }
      select.value = ""//Limpiamos el multiselect
    }
      return{
      infotag,
      acciones_mapper,
      opticones_select_acciones,
      accion,
      showModalAdvertencia,
      texto,
      select,
      cerralmodalpadre
      }
    
  },
};
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
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