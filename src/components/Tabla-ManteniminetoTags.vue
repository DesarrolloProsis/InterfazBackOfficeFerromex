<template>
  <div class="responsive-table">
    <table class="tftable">
      <tr class="h-10">
        <th class="">
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 font-bold text-black 2xl:px-28">Tag</label>
        </th>
        <th class="">
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 text-black 2xl:px-28">Estatus</label>
        </th>
        <th class="">
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 text-black 2xl:px-28">Fecha de Registro</label>
          </th>
        <th class="">
          <label class="rounded-full px-20 bg-gray-200 ring-2 ring-gray-500 p-2 text-black 2xl:px-28">Acciones</label>
          </th>
      </tr>
      <tr v-for="(cruces, index) in dataCruces" :key="index"  :class="{'text-gray-100':cruces.active == 'false'}" class="text-black">
        <td>{{cruces.tag}}</td>
        <td v-if = "cruces.active == true">Activo</td>
        <td v-else>Desactivado</td>
        <td>{{moment.utc(cruces.insertionDate).local().format("YYYY-MM-DD HH:mm:ss a")}}</td>
        <td>
          <Multiselect v-model="select" 
          placeholder="Seleccione una Acción"
           @close="acciones_mapper(cruces)" 
           :options="opticones_select_acciones(cruces)"
           >
              <template v-slot:singleLabel="{ value }">
                <div class="multiselect-single-label">
                  <img height="26" style="margin: 0 6px 0 0;"> {{ value.name }}
                </div>
              </template>
              <template v-slot:option="{ option }">
                <img height="22" style="margin: 0 6px 0 0;">{{ option.name }}
              </template>
            </Multiselect>
        </td>
      </tr>
      
    </table>
  </div>
  <Modal :show="showModalAdvertencia" @cerrarmodal="cerralmodalpadre">
        <div class="w-full flex justify-center mt-4">
          <fa icon="triangle-exclamation" class="h-20 text-yellow-400"/>
        </div>
        <h1 class="text-5xl font-bold font-titulo text-center ">Advertencia</h1>  
        <div class="w-full flex justify-center mt-4 text-xl font-medium text-center">
          <p class="">Estas a punto de <label :class="{'text-green-400':texto == 'habilitar','text-yellow-400' :texto === 'deshabilitar','text-red-600' :texto === 'eliminar',  }">{{texto}}</label> el tag "{{infotag.tag}}" estas seguro?</p>
        </div>
        <div class="w-full flex justify-center space-x-28 mt-6 mb-6">
          <button class="botonIconOk animacion" @click="accion(texto)">Aceptar</button>
        </div>    
  </Modal>
</template>
<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION
import moment from 'moment'
import { ref } from 'vue'
import Modal from "../components/Modal.vue"
import Multiselect from '@vueform/multiselect'//Importamos el componente multiselect para la selección de modulos a asignar
import axios from 'axios'
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
      const showModalAdvertencia = ref(false)
      const texto = ref('')
      const accionestags = ref('')
      const options = ref([])
      const select = ref('')
      const selectestatus = ref(undefined)
      const infotag = ref({})
      const actualizar = ref(false)
    
    const cerralmodalpadre = (modal) => {
      console.log(modal)
      showModalAdvertencia.value = modal
      texto.value = ""
      console.log(showModalAdvertencia.value)
      emit("actualizartabla",true)
    }
    //Funcion para las opciones del tag
    function opcionestag(cruce){
      options.value = []
      let opciones = [{text:'Activo', value:'0'},{text:'Inactivo',value:'1'},{text:'Eliminar',value:'2'}]
      if(cruce.active){
        options.value.push(opciones[1])
        options.value.push(opciones[2])
      }else if(cruce.active == false){
        options.value.push(opciones[0])
        options.value.push(opciones[2])
      }
      return options.value
    }
    //Funcion para identificar la accion del usuario en el tag
    function accionesTags(cruces) {
        infotag.value = cruces
        console.log(select.value)
        showModalAdvertencia.value = !showModalAdvertencia.value
        console.log(infotag.value);
        if(select.value == '0'){
          texto.value = "habilitar"
          select.value = ""
        }
        else if(select.value == '1'){
          texto.value = "deshabilitar"
          select.value = ""
        }
        else if(select.value == '2'){
          texto.value = "eliminar"
          select.value = ""
        }
         
      }
      function accion(texto){
        console.log(texto)
        actualizar.value = false; 
        const tag = {
            "tag" : infotag.value.tag,
            "insertionDate": infotag.value.insertionDate,
            "active": infotag.value.active = !infotag.value.active
        }
        console.log(tag);
        const ruta = encodeURI(`${API}/Ferromex/editartag`)
        if(texto == "habilitar" || texto == "deshabilitar"){
          axios.put(ruta,tag)
          .then((res)=>{ console.log(res) 
          actualizar.value = true;
          emit("actualizartabla",actualizar.value)
          notify({
            title:'Tag Modificado',
            text:'El estatus del tag cambio correctamente' ,
            type: 'success'
          });
          })
          .catch((err) =>{
            console.log(err.request.responseText)
            notify({
            title:'Upps ocurrio un error ' + err.request.status,
            text: err.request.responseText,
            type: 'error'
            });
            emit("actualizartabla",true)
          })
        }else if(texto == "eliminar"){
          axios.delete(`${API}/Ferromex/eliminartag/${infotag.value.tag}`)
          .then((res)=>{ console.log(res)
          actualizar.value = true; 
          emit("actualizartabla",actualizar.value)
          notify({
            title:'Tag Eliminado',
            text:'El tag se elimino de forma correcta' ,
            type: 'error'
          });
          })
          .catch((err) =>{ 
            console.log(err.request.responseText)
            notify({
            title:'Upps ocurrio un error ' + err.request.status,
            text: err.request.responseText,
            type: 'error'
            });
            emit("actualizartabla",true)
            })
        }
        showModalAdvertencia.value = !showModalAdvertencia.value
        select.value = ""
      }
      function opticones_select_acciones(item){//Lista de opciones que se muestran en el menú de acciones
      let options = [
          {  value: '0', name: 'Activo'},//0
          {  value: '1', name: 'Inactivo'},//1
          {  value: '2', name: 'Eliminar'},//2
      ]
      let filtroOpciones = []
          if(item.active == true)
            filtroOpciones.push(options[1])
            filtroOpciones.push(options[2])
          if(item.active ==  false){
            filtroOpciones.push(options[0])
            filtroOpciones.push(options[2])
          }
      return filtroOpciones  //Regresamos la lista de acciones filtrada
    }
     function acciones_mapper(item){//Asignación de funciones de la lista de opciones que hay en el menú de acciones
     console.log(select.value);
     console.log(item);
     showModalAdvertencia.value = !showModalAdvertencia.value
      if(select.value == '0'){
        texto.value = "habilitar"
        infotag.value = item
      }if(select.value == '1'){
        texto.value = "deshabilitar"
        infotag.value = item
      }if(select.value == '2'){
       texto.value = "eliminar"
       infotag.value = item
      }
      select.value = ""
    }
      return{
      infotag,
      acciones_mapper,
      opticones_select_acciones,
      accion,
      showModalAdvertencia,
      texto,
      accionesTags,
      accionestags,
      options,
      select,
      selectestatus,
      cerralmodalpadre,
      opcionestag,
      }
    
  },
};
</script>
<style scoped>
.responsive-table {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 600px;
  
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
  border-color: white;
  border-bottom-color: #a1a1a1;
  border-left-color: white;
  border-right-color: white;
  background: white;
  text-align: center;
}

</style>