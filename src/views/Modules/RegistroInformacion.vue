<template>
  <Navbar/>
  <div class="container mx-auto">
    <h1 class="title-center font-titulo font-bold pb-4">Transacciones Intermodal</h1>
    <div class="flex flex-wrap ferromex-color p-1 rounded-lg">
      <div class="flex-none my-auto text-white font-md p-2 ml-20 md:ml-1">
        Fecha:<input v-model="fecha" type="date" class="rounded text-black ml-2 md:w-10 xl:w-32" />
      </div>
      <div class="flex-none my-auto text-white text-center font-md p-2">
        <select v-model="tipo" class="text-gray-800 w-32 rounded">
          <option value="A">TAG</option>
          <option value="B">No Economico</option>
          <option value="C">No Placa</option>
        </select>
        <input v-model.trim="tag" type="text" class="rounded text-black ml-2 md:w-10 xl:w-32" />
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        ViA:
        <select v-model="carril" class="flex-none text-black rounded" name="select" placeholder="Selecciona">
          <option :value="undefined">Seleccione ViA</option>
          <option v-for="(carril ,index) in carriles" :key="index" :value="carril.id">
              {{ carril.Carril }}
          </option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        Cuerpo: 
        <select v-model="cuerpo" class="text-gray-800 w-16 rounded">
          <option value="A">Cuerpo A</option>
          <option value="B">Cuerpo B</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        Clase:
        <select v-model="clase" class="flex-none text-black rounded" name="select" placeholder="Selecciona">
          <option :value="undefined">Seleccione Clase</option>
          <option v-for="(clase ,index) in clases" :key="index" :value="clase.clase">
              {{ clase.clase }}
          </option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        Resultados:
        <select v-model="numRespuesta" class="text-gray-800 w-16 rounded" @change="buscarchange(fecha,tag,carril,cuerpo,tipo,clase)">
          <option value="10">10</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        <button @click="buscar(fecha,tag,carril,cuerpo,tipo,clase)" class="btn-buscar animacion">Buscar</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ">
        <button @click="todos()" class="btn-buscar animacion">Todos</button>
      </div>
      <div class="flex-none my-auto ml-14 text-white w-10">
        <select v-model="tiempo" @change="tiempos(tiempo)" class="text-gray-800 w-24 -ml-14 rounded">
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
  <div>
    <Paginacion :total-pages="totalPaginas" :total="100" :current-page="paginaActual" :has-more-pages="hasMorePages" @pagechanged="cambiarPagina"/>
  </div>
  <!-- MODAL CARGANDO -->
  <Spinner :modalLoading="modalLoading"/>
  <Footer/>
</template>
<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION //Constante que almacena la cadena de conexión con el API
import TablaInformacionTelepeaje from "../../components/Tabla-RegistroInformacion.vue";//Componente tabla, que almacena todos los valores de los cruces
import Paginacion from "../../components/Paginacion.vue"//Componente que tiene la paginación
import Navbar from "../../components/Navbar.vue";//Importamos el componente navbar
import Footer from "../../components/Footer";//Importamos el componente Footer
import { notify } from "@kyvg/vue3-notification";//Componente para poder hacer las notificaciones
import { onMounted, ref, reactive, toRefs, onUnmounted,inject } from 'vue'//Importamos componente de vue que nos van a permitir montar funciones par acargas iniciales, hooks para constantes que se vuelvan reactivas
import moment from 'moment'
import Spinner from '../../components/Spinner.vue'
export default {
  name: "RegistroInformacion",
  components: { TablaInformacionTelepeaje, Navbar, Footer, Paginacion, Spinner},
  setup() {
    const axios = inject('axios')
    const tipo = ref('A')
    const modalLoading = ref(false) //Constante que permite abrir el spinner de las pantalla de carga
    const cruces = ref([])//Constante que almacena los cruces para mostrar en la tabla
    const tiempo = ref('') //Constante que almacena el tiempo seleccionado para actualizar la tabla
    const contador = ref(0) //Constante que almacena el contador por segundos para la actualización de la tabla
    const seconds = ref(180) //Constante que almacena los segundos para actualizar la tabla
    const expires_in = ref(0) //Constante que nos indica en cuanto tiempo expira el contados
    const interval = ref('')//Constante que almacena un intervalo de tiempo, que va a disminuir el contador
    const header = reactive({ fecha:"", tag: "", carril: "", cuerpo: "" })//Constante que almacena los valores de los header insertados para hacer los filtros correspondientes
    const carriles = ref([])//Constante que almacena los carriles para hacer el filtro en el header
    const totalPaginas = ref(0) //variable que indica el número total de páginas por resultado
    const paginaActual = ref(1) //variable que indica la página en la que estás dentro de la paginación, en la primer carga siempre es la página 1
    const hasMorePages = ref(true) //variable para poder cambiar de páginas con los botones
    const numRespuesta = ref(10)//Variable que indica el número de respuestas por página
    const clase = ref('');
    const clases = ref([]);

    contador.value = moment.utc(seconds.value).format('HH:mm:ss');//Damos formato para el contador, nos mostrará unicamente los minutos y segundos
    expires_in.value = seconds.value;//Asignamos el valor de los segundos que queremos que descienda desde un inicio
    onMounted(setInterval_, todos(),carrilesExistentes())//Montamos las funciones que queremos que se incialicen cuando se monte la vista
    
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
    function carrilesExistentes (){//Función que trae todos los carriles existentes
      const ruta = (encodeURI(`${API}/ferromex/carriles`))//Constante que guarda la ruta encriptada para la consulta en el API
      axios.get(ruta)//Hacemos una petición http al API con la ruta previamente encriptada
      .then((result) => {//Si el endpoint responde de manera correcta
        let resultado = []
            resultado = result.data
            //resultado.sort()
            resultado.sort(function (a, b) {
                if (a.id > b.id) {
                    return 1;
                }
                if (a.id < b.id) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
        carriles.value = resultado //Asignamos los valores de la respuesta del endpoint para mostrarlos en el header para los filtros
      }).catch((error) => {//Si el endpoint tiene un error en la respuesta
        console.log(error.request.response);//Mostramos en consola el error
      })
      const rutaclases = (encodeURI(`${API}/Ferromex/clases`))
      axios.get(rutaclases)
        .then((result) =>{
          clases.value = result.data
        })
        .catch(
          (error)=> console.log(error)
        )
      }
    
    function todos (){ //Función que trae todos los cruces, y limpia los header
      modalLoading.value = true//Activamos la bandera que nos muestra el spinner de la pantalla de carga
      header.fecha = ''//Limpiamos los filtros del header
      header.tag = '';
      header.carril = '';
      header.cuerpo = '';
      tipo.value = 'A';
      clase.value = '';
      numRespuesta.value = 10
      let fechaRuta = ' ';//Creamos literales con un espacio en blanco, que nos va a servir para enviarlo en la ruta encriptada
      let tagRuta = ' ';
      let carrilRuta = ' ';
      let cuerpoRuta = ' ';
      let NoEconomicoRuta = ' ';
      let NoPlacaRuta = ' ';
      let claseRuta = ' ';
      const ruta = (encodeURI(`${API}/ferromex/registroInformacion/1/${numRespuesta.value}/${fechaRuta}/${tagRuta}/${carrilRuta}/${cuerpoRuta}/${NoPlacaRuta}/${NoEconomicoRuta}/${claseRuta}`))//Constante almacena la ruta encriptada para hacer la petición al API
      axios.get(ruta)//Hacemos la petición https al API con la ruta encriptada anteriormente
      .then((result) => {//Si el endpoint tiene una respuesta correcta
        cruces.value = result.data.cruces//Asignamos el valor de los resultados del endpoint para mostrarlos en la tabla
        totalPaginas.value = result.data.paginas_totales//Asignamos el valor del número de páginas totales para la paginación
        paginaActual.value = result.data.pagina_actual//Asignamos el valor de la página actual, para saber en que página estamos en el componente de páginación
        modalLoading.value = false//Desactivamos la bandera que muestra el spinner de la pantalla de carga
      })
      .catch((error) => {//Si el endpoint contiene un error en la respuesta
        console.log(error.request.response);//Mostramos en la consola el erros que nos muestra el endpoitn
        modalLoading.value = false//Desactivamos la bandera que muestra el spinner de la pantalla de carga
      })
    }
    function buscar(fecha,tag,carril,cuerpo,tipo,clase){ //Función que realiza la busqueda en la base con un evento click
      modalLoading.value = true
      if(fecha == '')//Hacemos la validaciones necesarias para poder agregar el espacio vacio es que no se ha escrito o seleccionado un dato en los filtros
        fecha = ' '
      if(tag == '')
        tag = ' '
      if(carril == '')
        carril = ' '
      if(cuerpo == '')
        cuerpo = ' '
      if(clase == '')
        clase = ' '
      if(fecha == ' ' && tag == ' ' && carril == ' ' && cuerpo == ' ' && clase == ' ')//Hacemos la validación para saber si no se escribió o seleccionó nada en los filtros
      {
        notify({//Notificación en la que indicamos que no se ha insertado ningún dato para buscar
          title:'Sin Información',
          text:'No hay datos para realizar la busqueda',
          type: 'warn'
        });
        modalLoading.value = false
      }else{
        let NoPlaca = ""
        let NoEconomico = ""
        let tagenviar = ""
        if(tag != ' '){
          paginaActual.value = 1;
          if(tipo == 'A'){
            tagenviar = tag
            NoPlaca = " ";
            NoEconomico = " "
          }else if(tipo == 'B'){
            tagenviar = " "
            NoPlaca = " ";
            NoEconomico = tag
          }else if(tipo == 'C'){
            tagenviar = " "
            NoPlaca = tag;
            NoEconomico = " "
          }
        }else{
          tagenviar = " "
          NoPlaca = " "
          NoEconomico = " "
        }
        const ruta = (encodeURI(`${API}/ferromex/registroInformacion/${paginaActual.value}/${numRespuesta.value}/${fecha}/${tagenviar}/${carril}/${cuerpo}/${NoPlaca}/${NoEconomico}/${clase}`))//Constante que almacena la ruta encriptada para hacer la petición al API
        axios.get(ruta)//Realizamos la petición http al API
        .then((result) => {//Si el endpoint tiene una respuesta correcta
          cruces.value = result.data.cruces//Asignamos los valores del resultado a la constrante que se va a mostrar en la tabla
          totalPaginas.value = result.data.paginas_totales//Asignamos el valor de las páginas totales para saber el limite de páginas en el componente de paginación
          paginaActual.value = result.data.pagina_actual//Asignamos el valor de la página actual para enviarlo al componente de paginación
          modalLoading.value = false
        }).catch((error) => {//Si el endpoint tiene un error en la respuesta
          console.log(error.request.response);
        })
      }
    }
    function buscarchange(fecha, tag, carril, cuerpo,tipo,clase){ //Función que realiza la busqueda en la base con un evento click
      paginaActual.value = 1;
      modalLoading.value = true
      if(fecha == '')//Hacemos la validaciones necesarias para poder agregar el espacio vacio es que no se ha escrito o seleccionado un dato en los filtros
        {
          fecha = ' '
        }
      if(tag == ''){
        tag = ' '
        }
      if(carril == ''){
        carril = ' '
      }
      if(cuerpo == ''){
        cuerpo = ' '
      }
      if(clase == ''){
        clase = ' '
      }
        let NoPlaca = "";
        let NoEconomico = "";
        let tagenviar = ""
        if(tag != ' '){
          if(tipo == 'A'){
            tagenviar = tag
            NoPlaca = " ";
            NoEconomico = " "
          }else if(tipo == 'B'){
            tagenviar = " "
            NoPlaca = " ";
            NoEconomico = tag
          }else if(tipo == 'C'){
            tagenviar = " "
            NoPlaca = tag;
            NoEconomico = " "
          }
        }else{
          tagenviar = " "
          NoPlaca = " ";
          NoEconomico = " "
        }
      const ruta = (encodeURI(`${API}/ferromex/registroInformacion/${paginaActual.value}/${numRespuesta.value}/${fecha}/${tagenviar}/${carril}/${cuerpo}/${NoPlaca}/${NoEconomico}/${clase}`))//Constante que almacena la ruta encriptada para hacer la petición al API
      axios.get(ruta)//Realizamos la petición http al API
        .then((result) => {//Si el endpoint tiene una respuesta correcta
          cruces.value = result.data.cruces//Asignamos los valores del resultado a la constrante que se va a mostrar en la tabla
          totalPaginas.value = result.data.paginas_totales//Asignamos el valor de las páginas totales para saber el limite de páginas en el componente de paginación
          paginaActual.value = result.data.pagina_actual//Asignamos el valor de la página actual para enviarlo al componente de paginación
          modalLoading.value = false
        }).catch((error) => {//Si el endpoint tiene un error en la respuesta
          console.log(error.request.response);
        })
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
    function cambiarPagina (page){//Función que nos permite realizar el cambio de pagina mediante el componente de paginación
      modalLoading.value = true
      let fechaVacia = header.fecha
      if(header.fecha == '')//Hacemos la validaciones necesarias para poder agregar el espacio vacio es que no se ha escrito o seleccionado un dato en los filtros
        fechaVacia = ' '
      if(header.tag == '')
        header.tag = ' '
      if(header.carril == '')
        header.carril = ' '
      if(header.cuerpo == '')
        header.cuerpo = ' '
      let claseRuta;
      if(clase.value == ''){
        claseRuta = ' '
      }else{
        claseRuta = clase.value
      }
      let NoPlaca = "";
      let NoEconomico = "";
      let tagenviar = ""  
      if(header.tag != ' '){
        if(tipo.value == 'A'){
          tagenviar = header.tag
          NoPlaca = " ";
          NoEconomico = " "
        }else if(tipo.value == 'B'){
          tagenviar = " "
          NoPlaca = " ";
          NoEconomico = header.tag
        }else if(tipo.value == 'C'){
          tagenviar = " "
          NoPlaca = header.tag;
          NoEconomico = " "
        }
      }else{
        tagenviar = " "
        NoPlaca = " ";
        NoEconomico = " "
      }
      const ruta = (encodeURI(`${API}/ferromex/registroInformacion/${page}/${numRespuesta.value}/${fechaVacia}/${tagenviar}/${header.carril}/${header.cuerpo}/${NoPlaca}/${NoEconomico}/${claseRuta}`))//Constante que almacena la ruta encriptada para hacer la petición al API
      axios.get(ruta)
      .then((result) => {//Si el endpoint contiene una respuesta correcta
        cruces.value = result.data.cruces//Asignamos el valor de los resultados del endpoint para mostrarlos en la tabla
        totalPaginas.value = result.data.paginas_totales//Asignamos el valor de las páginas totales para saber el limite de páginas en el componente de paginación
        paginaActual.value = result.data.pagina_actual//Asignamos el valor de la página actual para enviarlo al componente de paginación
        modalLoading.value = false
      }).catch((error) => {//Si el endpoint contiene un error en la respuesta
        console.log(error.request.response);
      })  
    }
    function stopInterval(){//Función que detiene le intervalo, para que no se esté llamanmdo aunque salgas de la vbista
      clearInterval(interval.value)//ClearInterval, limpia el intervalo, lo vuelte 0 para que nunca se repita
    }
    onUnmounted(stopInterval)//Ejecuta la función cuando se desmonta el componente

    return { 
      header, 
      carriles,
      clases, 
      modalLoading,
      tipo, 
      cambiarPagina, 
      buscar,
      clase,
      buscarchange, 
      setInterval_, 
      tiempos, 
      todos, 
      ...toRefs(header), 
      carrilesExistentes,
      stopInterval,
      cruces, 
      contador, 
      tiempo, 
      totalPaginas, 
      paginaActual, 
      hasMorePages, 
      numRespuesta
      }
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