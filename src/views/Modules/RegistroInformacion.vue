<template>
  <Navbar/>
  <div class="container mx-auto">
    <h1 class="title-center font-titulo font-bold pb-4">Registro de Información de Telepeaje</h1>
    <div class="flex flex-wrap ferromex-color p-1 rounded-lg">
      <div class="flex-none my-auto text-white font-md p-2 ml-20 md:ml-1">
        Fecha:<input v-model="fecha" type="date" class="rounded ml-2 md:w-10" />
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        TAG:<input v-model="tag" type="text" class="rounded ml-2 md:w-10" />
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        Carril:
        <select v-model="carril" class="text-gray-800 w-16 rounded">
          <option value="tres">A1</option>
          <option value="seis">A2</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        Cuerpo:
        <select v-model="carril" class="text-gray-800 w-16 rounded">
          <option value="tres">A</option>
          <option value="seis">B</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-39 md:ml-10">
        <button @click="buscar()" class="btn-buscar animacion">Buscar</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        <button @click="buscar()" class="btn-buscar animacion">Todos</button>
      </div>
      <div class="flex-none my-auto ml-right text-white">
        <select v-model="tiempo" @change="tiempos(tiempo)" class="text-gray-800 w-55 rounded">
          <option value="" disabled>Tiempo de Actualización</option>
          <option value="tres">3 min</option>
          <option value="seis">6 min</option>
          <option value="nueve">9 min</option>
          <option value="quince">15 min</option>
          <option value="treinta">30 min</option>
        </select>
      </div>
    </div>
    <TablaInformacionTelepeaje :dataCruces="cruces"/>
    <p class="mt-10">Próxima actualización en {{ contador.slice(3)  }}</p>
  </div>
  <div class="mt-20 -mb-14">
    <Paginacion :total-pages="totalPaginas" :total="100" :current-page="currentPage" :has-more-pages="hasMorePages" @pagechanged="showMore"/>
  </div>
  <Footer/>
</template>
<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION

import TablaInformacionTelepeaje from "../../components/Tabla-RegistroInformacion.vue";
import Paginacion from "../../components/Paginacion.vue"
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer";
import { notify } from "@kyvg/vue3-notification";
import { onMounted, ref } from 'vue'
import axios from "axios";
import moment from 'moment'
export default {
  name: "RegistroInformacion",
  components: { TablaInformacionTelepeaje, Navbar, Footer, Paginacion},
  setup() {
    const tramo = ref('')
    const plaza = ref(null)
    const carril = ref(null)
    const cruces = ref([])
    const tiempo = ref('')
    const contador = ref(0)
    const seconds = ref(180)
    const formato  = ref('')
    const expires_in = ref(0)
    const interval =ref('')
    //Paginacion
    const totalPaginas = ref(0) //variable que indica el número total de páginas por resultado
    const currentPage = ref(1) //variable que indica la página en la que estás dentro de la paginación, en la primer carga siempre es la página 1
    const hasMorePages = ref(true) //variable para poder cambiar de páginas con los botones
    const numRespuesta = ref(10)//Variable que indica el número de respuestas por página

    contador.value = moment.utc(seconds.value).format('HH:mm:ss');
    expires_in.value = seconds.value;

    function setInterval_() { //Funcion que genera la cuenta regresiva para la actualización en automatico
      interval.value = setInterval(() => {
        if(expires_in.value === 1){
          expires_in.value = seconds.value
          actualizar(plaza.value,carril.value)         
        }
        else {
          expires_in.value -= 1;
          contador.value = moment.utc(expires_in.value * 1000).subtract(1, 'seconds').format('HH:mm:ss');                                       
        }
      }, 1000)
    }
    function actualizar(plaza,carril){ //Función que va a actualizar de manera automatica la buqueda de la información con base del tiempo seleccionado
      if(plaza != undefined && carril != undefined){
        cruces.value = []
        axios.get(`${API}/Transacciones/Last20Transaccions/${plaza}/${carril}`)
        .then((result)=>{
          result.data.body.forEach((e) =>{
            let obj = {
              carril: e.carril,
              clase: e.claseCajero,
              fecha: e.fechaDeCruce,
              tag: e.idTag
            }
            cruces.value.push(obj)
          })
        })
      }else if(plaza != undefined && carril == undefined){
        let crl = null
        cruces.value = []
        axios.get(`${API}/Transacciones/Last20Transaccions/${plaza}/${crl}`)
        .then((result)=>{
          result.data.body.forEach((e) =>{
            let obj = {
              carril: e.carril,
              clase: e.claseCajero,
              fecha: e.fechaDeCruce,
              tag: e.idTag
            }
            cruces.value.push(obj)
          })
        })
      }
    }
    function buscar(){ //Función que realiza la busqueda en la base con un evento click
      notify({
        title:'Sin Información',
        text:'No se encontraron transacciones',
        type: 'warn'
      });
    }
    function tiempos(minutos){ //función donde se indica los segundos para poder reiniciar la busqueda dependiendo de la opción seleccionada
      if(minutos == 'tres'){
        seconds.value = 180
        expires_in.value = seconds.value
      }else if(minutos == 'seis'){
        seconds.value = 360
        expires_in.value = seconds.value
      }else if(minutos == 'nueve'){
        seconds.value = 540
        expires_in.value = seconds.value
      }else if(minutos == 'quince'){
        seconds.value = 900
        expires_in.value = seconds.value
      }else if(minutos == 'treinta'){
        seconds.value = 1800
        expires_in.value = seconds.value
      }
    }
    onMounted(setInterval_)

    return { setInterval_, actualizar, buscar, tiempos, tramo, plaza, carril, cruces, tiempo, contador, seconds, formato, expires_in, interval, totalPaginas, currentPage, hasMorePages, numRespuesta}
}
}
</script>
<style scoped>
.title-center {
  text-align: center;
  font-size: 25px;
  padding-top: 20px;
}
.ml-right {
  display: block;
  margin-left: auto;
  margin-right: 10px;
}
.filter-style {
  color: white;
  font-size: 16px;
  margin-left: 40px;
}
.filter-style input {
  margin-left: 20px;
  color: black;
  border: 1px solid black;
  padding: 0px 5px;
}
@media (max-width: 769px) {
  .filter-style {
    padding-top: 5px;
    padding-bottom: 15px;
  }
}
</style>