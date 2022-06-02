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
      <tr v-for="(cruces, index) in dataCruces" :key="index">
        <td>{{cruces.tag}}</td>
        <td>{{cruces.estatus}}</td>
        <td>{{moment(cruces.fecha).format("YYYY-MM-DD  HH:mm:ss a")}}</td>
        <td><select class="input" v-model="accionestags" @change="accionesTags(accionestags,cruces)">
          <option value="1">Activar</option>
          <option value="2">Deshabilitar</option>
          <option value="3">Eliminar</option>
        </select></td>
      </tr>
    </table>
  </div>
  <Modal :show="showModalAdvertencia">
        <h1 class="text-5xl font-bold font-titulo text-center ">Advertencia</h1>
          <div class="w-full flex justify-center mt-4">
                <fa icon="triangle-exclamation" class="h-20 text-yellow-400"/>
          </div>
          <div class="w-full flex justify-center mt-4 text-xl font-medium text-center">
                <p class="">Estas a punto de <label :class="{'text-green-400':accionestags === '1','text-yellow-400' :accionestags === '2','text-red-600' :accionestags === '3',  }">{{texto}}</label> este tag estas seguro?</p>
          </div>
          <div class="w-full flex justify-center space-x-28 mt-6 mb-6">
            <button class="botonIconOk animacion">Aceptar</button>
            <button class="btn-buscar animacion">Cancelar</button>
          </div>
            
  </Modal>
</template>
<script>
import moment from 'moment'
import { ref } from 'vue'
import Modal from "../components/Modal.vue"
export default {
  name: "TablaBusquedaCruces",
  components: {
    Modal
  },
  props: ["dataCruces"],
  created: function () {
    this.moment = moment;
  },
  setup(){
    //Declaracion de variable
      const showModalAdvertencia = ref(false)
      const texto = ref('')
      const accionestags = ref('')
    //Funcion para identificar la accion del usuario en el tag
    function accionesTags(accionestags,cruces) {
        showModalAdvertencia.value = !showModalAdvertencia.value
        console.log(accionestags)
        console.log(cruces);
        if(accionestags == '1'){
          texto.value = "habilitar"
          accionestags.value = ""
        }
        else if(accionestags == '2'){
          texto.value = "deshabilitar"
          accionestags.value = ""
        }
        else if(accionestags == '3'){
          texto.value = "eliminar"
          accionestags.value = ""
        }
        
      }
      return{showModalAdvertencia,texto,accionesTags,accionestags}
    
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