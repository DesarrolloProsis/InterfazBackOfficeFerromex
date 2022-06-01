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
        <td><select class="input">
          <option>Activar</option>
          <option>Deshabilitar</option>
          <option>Eliminar</option>
        </select></td>
      </tr>
    </table>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: "TablaBusquedaCruces",
  props: ["dataCruces"],
  created: function () {
    this.moment = moment;
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