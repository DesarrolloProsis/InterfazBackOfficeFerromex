<template>
<div class="responsive-table">
  <!-- <table class="tftable"> -->
  <table class="tftable">
    <tr class="h-10">
      <th class="md:w-10">
        <label class="rounded-full text-lg px-28 bg-gray-200 ring-2 ring-gray-500 p-2">Fecha</label>
      </th>
      <th class="md:w-10">
        <label class="rounded-full text-lg px-28 bg-gray-200 ring-2 ring-gray-500 p-2">Hora</label>
      </th>
      <th class="md:w-10">
        <label class="rounded-full text-lg px-28 bg-gray-200 ring-2 ring-gray-500 p-2">Tag</label>
      </th>
      <th class="md:w-10">
        <label class="rounded-full text-lg px-28 bg-gray-200 ring-2 ring-gray-500 p-2">Carril</label>
      </th>
      <th class="md:w-10">
        <label class="rounded-full text-lg px-28 bg-gray-200 ring-2 ring-gray-500 p-2">Tarifa</label>
      </th>
    </tr>
    <tr v-for="(cruce, index) in dataCruces" :key="index">
      <td>{{ moment(cruce.fecha).format("YYYY-MM-DD  HH:mm:ss a") }}</td>
      <td>{{ cruce.carril }}</td>
      <td>{{ cruce.carril }}</td>
      <td>{{ cruce.tag }}</td>
      <td>{{ cruce.clase }}</td>
    </tr>
  </table>
</div>
</template>


<script>
import moment from 'moment'
export default {
  name: "Tabla",
  props: ["dataCruces"],
  created: function () {
    this.moment = moment;
  },
};
</script>
<style scoped>
.responsive-table {
  padding-top: 20px;
  overflow-x: auto;
  overflow-y: auto;
  max-height: 600px;

}

.tftable {
  font-size: 12px;
  color: #333333;
  width: 100%;
}

.tftable th {
  font-size: 14px;
  background-color: #ffffff;
  border-width: 5px;
  padding: 8px;
  border-style: solid;
  border-color: white;
  color: black;
  font-weight: 400;
  text-align: center;
  border-radius: 35px;
  margin: 3px;
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
