<template>
  <Navbar/>
  <div class="container mx-auto">
    <h1 class="title-center font-titulo font-bold pb-4">Registro de Información de Telepeaje</h1>
    <div class="flex flex-wrap ferromex-color p-1 rounded-lg">
      <div class="flex-none my-auto text-white font-md p-2 ml-20 md:ml-1">
        Fecha:<input v-model="fecha" type="date" class="rounded text-black ml-2 md:w-10 xl:w-44" />
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        TAG:<input v-model="tag" type="text" class="rounded text-black ml-2 md:w-10 xl:w-44" />
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        Carril:
        <select v-model="carril" class="flex-none filter-style color-black rounded" name="select" placeholder="Selecciona">
          <option :value="undefined">Seleccione un Carril</option>
          <option v-for="(carril ,index) in carriles" :key="index" :value="carril.id">{{carril.carril}}</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        Cuerpo:
        <select v-model="cuerpo" class="text-gray-800 w-16 rounded">
          <option value="uno">A</option>
          <option value="dos">B</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-39 md:ml-10">
        <button @click="buscar(fecha,tag,carril,cuerpo)" class="btn-buscar animacion">Buscar</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        <button @click="todos()" class="btn-buscar animacion">Todos</button>
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
  <div class="">
    <Paginacion :total-pages="totalPaginas" :total="100" :current-page="paginaActual" :has-more-pages="hasMorePages" @pagechanged="showMore"/>
  </div>
  <!-- MODAL CARGANDO -->
  <Spinner :modalLoading="modalLoading"/>
  <Footer/>
</template>
<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION //Constante que almacena la cadena de conexión con el API
import TablaInformacionTelepeaje from "../../components/Tabla-RegistroInformacion.vue";//Componente tabla, que almacena todos los valores de los cruces
import Paginacion from "../../components/Paginacion.vue"//Componente que tiene la paginación
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer";
import { notify } from "@kyvg/vue3-notification";//Componente para poder hacer las notificaciones
import { onMounted, ref, reactive, toRefs, onUnmounted } from 'vue'
import axios from "axios";
import moment from 'moment'
import Spinner from '../../components/Spinner.vue'
export default {
  name: "RegistroInformacion",
  components: { TablaInformacionTelepeaje, Navbar, Footer, Paginacion, Spinner},
  setup() {

    const modalLoading = ref(false) //Constante que permite abrir el spinner de las pantalla de carga
    const cruces = ref([])//Constante que almacena los cruces para mostrar en la tabla
    const tiempo = ref('') //Constante que almacena el tiempo seleccionado para actualizar la tabla
    const contador = ref(0) //Constante que almacena el contador por segundos para la actualización de la tabla
    const seconds = ref(10) //Constante que almacena los segundos para actualizar la tabla
    const expires_in = ref(0) //Constante que nos indica en cuanto tiempo expira el contados
    const interval = ref('')//Constante que almacena un intervalo de tiempo, que va a disminuir el contador
    const header = reactive({ fecha:"", tag: "", carril: "", cuerpo: "" })//Constante que almacena los valores de los header insertados para hacer los filtros correspondientes
    const carriles = ref([ //Constante que almacena los carriles para hacer el filtro en el header
      {'id':5, 'carril': 'C01'},
      {'id':6, 'carril':'C03'},
      {'id':7, 'carril':'C05'},
      {'id':8, 'carril':'C07'},
      {'id':9, 'carril':'C09'},
      {'id':10, 'carril':'C11'},
      {'id':11, 'carril':'C02'},
      {'id':12, 'carril':'C04'},
      {'id':13, 'carril':'C06'},
      {'id':14, 'carril':'C08'},
      {'id':15, 'carril':'C10'},
      ])
    const totalPaginas = ref(0) //variable que indica el número total de páginas por resultado
    const paginaActual = ref(1) //variable que indica la página en la que estás dentro de la paginación, en la primer carga siempre es la página 1
    const hasMorePages = ref(true) //variable para poder cambiar de páginas con los botones
    const numRespuesta = ref(10)//Variable que indica el número de respuestas por página

    contador.value = moment.utc(seconds.value).format('HH:mm:ss');
    expires_in.value = seconds.value;
    onMounted(setInterval_)
    
    function setInterval_() { //Funcion que genera la cuenta regresiva para la actualización en automatico
      interval.value = setInterval(() => {//se genera una función de tipo setInterval
        if(expires_in.value === 1){//Si el número es 1, quiere decir que ya es el último segundo
          expires_in.value = seconds.value //Se cambia el valor, a que tenga por defaul el valor de seconds en este caso 180
          if(header.fecha != ''|| header.tag != '' || header.carril != '' || header.cuerpo != ''){//Si el header esta vacio mandamos a llamr a la función buscar
            buscar(header.fecha, header.tag, header.carril, header.cuerpo)
          } 
          else{//Si no llamamos a todos
            todos()
          }
        }
        else {//Si no es el último segundo
          expires_in.value -= 1;//Le resta un segundo al contador para saber cuando expira
          contador.value = moment.utc(expires_in.value * 1000).subtract(1, 'seconds').format('HH:mm:ss');//Damos el formato de minutos y segundos al contador para mostrarlo en la interfaz
        }
      }, 1000)//Esto se repite cada segundo
    }
    function todos (){ //Función que trae todos los cruces, y limpia los header
      modalLoading.value = true
      header.fecha = ''
      header.tag = ''
      header.carril = ''
      header.cuerpo = ''
      let fechaRuta = ' '
      let tagRuta = ' '
      let carrilRuta = ' '
      let cuerpoRuta = ' '
      const ruta = (encodeURI(`${API}/ferromex/registroInformacion/${paginaActual.value}/${numRespuesta.value}/${fechaRuta}/${tagRuta}/${carrilRuta}/${cuerpoRuta}`))
      axios.get(ruta)
      .then((result) => {
        console.log(result);
        modalLoading.value = false
      })
      .catch((error) => {
        console.log(error);
        modalLoading.value = false
      })
      console.log(ruta);
      modalLoading.value = false
    }
    function buscar(fecha, tag, carril, cuerpo){ //Función que realiza la busqueda en la base con un evento click
      modalLoading.value = true
      if(fecha == '')
        fecha = ' '
      if(tag == '')
        tag = ' '
      if(carril == '')
        carril = ' '
      if(cuerpo == '')
        cuerpo = ' '
      if(fecha == ' ' && tag == ' ' && carril == ' ' && cuerpo == ' ')
      {
        notify({//Notificación en la que indicamos que no se ha insertado ningún dato para buscar
          title:'Sin Información',
          text:'No hay datos para realizar la busqueda',
          type: 'warn'
        });
        modalLoading.value = false
      }else{
        const ruta = (encodeURI(`${API}/ferromex/registroInformacion/${paginaActual.value}/${numRespuesta.value}/${fecha}/${tag}/${carril}/${cuerpo}`))
        console.log(ruta);
        modalLoading.value = false
      }
    }
    function tiempos(minutos){ //función donde se indica los segundos para poder reiniciar la busqueda dependiendo de la opción seleccionada
      if(minutos == 'tres'){
        seconds.value = 10
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
    function showMore (){}
    function stopInterval(){//Función que detiene le intervalo, para que no se esté llamanmdo aunque salgas de la vbista
      clearInterval(interval.value)//ClearInterval, limpia el intervalo, lo vuelte 0 para que nunca se repita
    }
    onUnmounted(stopInterval)//Ejecuta la función cuando se desmonta el componente

    return { header, carriles, modalLoading, showMore, buscar, setInterval_, tiempos, todos, ...toRefs(header), stopInterval, cruces, contador, tiempo, totalPaginas, paginaActual, hasMorePages, numRespuesta}
}
}
</script>
<style scoped>
.color-black {
  color: black !important;
}
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