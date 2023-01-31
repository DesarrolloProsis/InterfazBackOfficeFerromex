<template>
  <div class="responsive-table overflow-auto">
    <table class="tftable">
      <tr class="h-10">
        <th>
          <label class="rounded-full px-10 bg-gray-200 ring-2 ring-gray-500 p-2 text-black 2xl:px-23">Nombre</label>
        </th>             
        <th>
          <label class="rounded-full px-10 bg-gray-200 ring-2 ring-gray-500 p-2 text-black 2xl:px-23">Perfil</label>
        </th>
        <th>
          <label class="rounded-full px-10 bg-gray-200 ring-2 ring-gray-500 p-2 text-black">Fecha de Movimiento</label>
        </th>
        <th>
          <label class="rounded-full px-10 bg-gray-200 ring-2 ring-gray-500 p-2 text-black 2xl:px-24">Módulo</label>
        </th>
        <th>
          <label class=" rounded-full px-10 bg-gray-200 ring-2 ring-gray-500 p-2 text-black 2xl:px-23">Acción</label>
        </th>
        <th>
          <label class=" rounded-full px-10 bg-gray-200 ring-2 ring-gray-500 p-2 text-black">Registro Original</label>
        </th>
        <th>
          <label class=" rounded-full px-10 bg-gray-200 ring-2 ring-gray-500 p-2 text-black">Registro Editado</label>
        </th>
      </tr>      
      <tr v-for="(info, index) in infoActividad" :key="index" >
        <td>{{ info.nombre }}</td>
        <td>{{ info.rol }}</td>
        <td>{{ formatDate(info.fechaMovimiento) }}</td>
        <td>{{ info.modulo }}</td>
        <td>{{ info.accion }}</td>
        <td>{{ info.registroOriginal }}</td>
        <td>{{ info.registroEditado }}</td>
      </tr>      
    </table>
  </div>
  <br />

</template>
<script>
import moment from 'moment';

export default {
  name: "TablaListaActividades",
  props: ["infoActividad"],
  components:{    
  },
  setup(){
    
    function formatDate(date) { return moment(date).format("DD-MM-YYYY HH:mm:ss") }
    return { formatDate }
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
