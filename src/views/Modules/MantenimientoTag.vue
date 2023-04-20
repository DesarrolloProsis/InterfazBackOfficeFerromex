<template>
  <Navbar/>
  <div class="container mx-auto px-0 mb-4">
    <h1 class="title-center font-titulo font-bold pb-4 mb-2">Gestión de Tags</h1>
  <div>
    <div class="-mt-4 mx-2 md:mx-0">
        <div class="flex flex-col  bg-ferromex rounded-lg border-gray-200 pb-0 mb-4">          
            <div class="flex-1 flex flex-row space-x-2">
              <div class="w-full inline-flex flex-2 justify-center">
                <select v-model="tipo" class="text-gray-800 w-32 rounded h-6 my-auto">
                  <option value="A">TAG</option>
                  <option value="B">No Economico</option>
                  <option value="C">No Placa</option>
                </select>
                  <input id="tag" v-model.trim ="tag" class="my-auto bg-white flex border border-gray-200 rounded ml-2 h-6 w-40" placeholder="Buscar" type="text" />
              </div>
              <div class="w-full inline-flex flex-2 justify-center">
                <label for="tag" class="text-white my-auto">Estatus:</label>
                  <select v-model="estatus"  class="my-auto text-sm bg-white flex border border-gray-200 rounded ml-2 h-6 w-40">
                    <option :value="undefined">Seleccione una opción</option>
                    <option v-for="(option ,index) in options" :key="index" :value="option">{{option}}</option>
                  </select>
              </div>
              <div class="w-full inline-flex flex-2 justify-center">
                <label for="tag" class="text-white my-auto">Fecha:</label>
                  <input v-model="fecha" type="date" :max="hoy" class="my-auto p-1 bg-white flex border border-gray-200 rounded ml-2 h-6 w-40"> 
              </div>
            <div class="w-full inline-flex flex-2 justify-center">
                <label for="tag" class="text-white my-auto">Resultados:</label>
                <select v-model="numRespuesta" class="text-center my-auto bg-white flex border border-gray-200 rounded ml-2 h-6 w-20" @change="searchchange(tag, estatus, fecha,tipo)">
                  <option value="10">10</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                </select>
              </div>
              <div class="w-full flex-1">
                <div class="h-full my-auto text-white font-md p-2 ">                      
                  <button :disabled="modalLoading" class="btn-buscar animacion" :class="{'cursor-not-allowed': modalLoading}" @click="search( tag, estatus, fecha,tipo)">Buscar</button>
                </div>
              </div>
              <div class="w-full flex-1">
                <div class="h-full my-auto text-white font-md p-2">                      
                  <button :disabled="modalLoading" class="btn-buscar animacion" :class="{'cursor-not-allowed': modalLoading}" @click="limpiar()">Todos</button>
                </div>
              </div>
              <div class="w-full flex-1">
                <div class="h-full my-auto text-white font-md p-2 w-40">                      
                  <button :disabled="modalLoading" class="btn-buscar animacion" :class="{'cursor-not-allowed': modalLoading}" @click="abrirmodal()">Agregar TAG</button>
                </div>
              </div>
              <div class="w-full flex-2">
                <div class="h-full my-auto text-white font-md p-2">                      
                  <button :disabled="modalLoading" class="botonIconBuscar animacion" :class="{'cursor-not-allowed': modalLoading}" @click="downloadApi(tag,estatus,fecha)">
                    Descargar
                    <fa icon="download" class="hover:text-white"/>
                  </button>
                </div>
              </div>
              </div>
        </div>
    </div>
  </div>
  <TablaMantenimientoTag :dataCruces="cruces" @actualizartabla="actualizarLista"/>
  <Paginacion :total-pages="totalPaginas" :total="100" :current-page="currentPage" :has-more-pages="hasMorePages" @pagechanged="showMore"/> 
  </div>
  <Spinner :modalLoading="modalLoading"/>
  <Spinner :modalLoading="loading"/>
  <Modal :show="showModal" @cerrarmodal="cerralmodalpadre">
        <h1 class="text-4xl font-bold font-titulo text-center mt-4">Agregar Tag</h1>
            <div class="flex w-full justify-center gap-20 mt-10">
                <div class="flex flex-col gap-16">
                    <div>
                        <label for="" class="p-2">TAG</label>
                    </div>
                      <div>
                        <label for="" class="p-2">Numero de Placa</label>
                    </div>
                      <div>
                        <label for="" class="p-2">Numero Economico</label>
                    </div>
                </div>
                <div class="flex flex-col gap-10">
                    <div>
                        <!-- <input type="text" class="input" :class="{'border-red-600': validarTag}" v-model="numerotagagregar" @input="limpiarvalidacion()"> -->
                        <Multiselect
                          v-model="numerotagagregar"
                          :max="1"
                          :caret="false"
                          :close-on-select="true"
                          :searchable="true"
                          :create-option="true"
                          :options="tagsprecargados"
                        />
                        <span v-if="validarTag" class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                        {{validarTagTexto}}
                        </span>
                    </div>
                    <div>
                        <input type="text" class="relative mx-auto w-full p-2 flex items-center justify-end box-border border border-gray-300 rounded bg-white text-base leading-snug outline-none" :class="{'border-red-600': validarTag}" v-model="numeroplaca" @input="limpiarvalidacion()">
                        <span v-if="validarPlaca" class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                        {{validarPlacaTexto}}
                        </span>
                    </div>
                    <div>
                        <input type="text" class="relative mx-auto w-full p-2 flex items-center justify-end box-border border border-gray-300 rounded bg-white text-base leading-snug outline-none" :class="{'border-red-600': validarTag}" v-model="numeroeconomico" @input="limpiarvalidacion()">
                        <span v-if="validarNoEconomico" class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                        {{validarNoEconomicoTexto}}
                        </span>
                    </div>
                </div>
            </div>
            <div class="flex w-full justify-center mt-10 mb-8">
                <button class="rounded-lg w-18 bg-ferromex text-white p-10" @click="agregarTag(numerotagagregar,numeroplaca,numeroeconomico)">Agregar TAG</button>
            </div>
  </Modal>
<Footer/>
</template>
<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION
import TablaMantenimientoTag from "../../components/Tabla-ManteniminetoTags.vue";
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer";
import { file }  from '../../Servicios/Files-Service'
import Paginacion from "../../components/Paginacion.vue"
import { notify } from "@kyvg/vue3-notification";
import Spinner from '../../components/Spinner.vue'
import { ref,reactive,toRefs,onMounted,inject } from 'vue'
import Modal from "../../components/Modal.vue"
import Multiselect from '@vueform/multiselect'
export default {
  name: "BusquedaCruces",
  components: {
    TablaMantenimientoTag,
    Navbar,
    Footer,   
    Paginacion,
    Spinner,
    Modal,
    Multiselect
  },
  setup() {
    const axios = inject('axios')
    const { xml_hhtp_request,loading } = file();
    const tipo = ref('A');
    const cruces = ref([]) //Variable para llenar la tabla de tags
    const page = ref(1) //Variable que maneja la paginacion para que se le indique desde donde iniciar
    const hoy = ref('') //Variable que se utiliza para dar a los inputs date el maximo dia a seleccionar que es el dia de hoy 
    const totalPaginas = ref(0) //Variable en donde almacenaremos el total de paginas para la paginacion 
    const currentPage = ref(1) //Variable que indica la pagina actual 
    const hasMorePages = ref(true) //Varible que ocupa la paginacion para indicarle qu epuede avanzar entre pagina
    const modalLoading = ref(false) //Variable que muestra el sppiner de carga
    const numRespuesta = ref(10) //Variable de numero de resultados que espera la paginacion
    const showModal = ref(false) //Varible del modal de agregar tag
    const numerotagagregar = ref([]) //Variable del input tag a agregar
    const tagsprecargados = ref([])
    const numeroplaca = ref('')
    const numeroeconomico = ref('')
    const options = ref(['Activo','Inactivo']) //Declaracion de las opciones del select de options 
    const actualizar = ref(false) //variable apra actualizar la tabla
    const validarTag = ref(false) //Variable que maneja la validacion del input del tag
    const validarTagTexto = ref(false) //Varible que maneja el texto a mostrar de la validacion del tag
    const header = reactive({ // Variable que controla el header de la tabla para la busqueda de tags
      tag: "",
      estatus: undefined,
      fecha: ""
    })
    const validarNoEconomico = ref(false) //Variable que maneja la validacion del input del tag
    const validarNoEconomicoTexto = ref(false) //Varible que maneja el texto a mostrar de la validacion del tag
    const validarPlaca = ref(false) //Variable que maneja la validacion del input del tag
    const validarPlacaTexto = ref(false) //Varible que maneja el texto a mostrar de la validacion del tag
    //DEclaracion del metodo onMounted que se ocuapa para montar los resultados de los tags
    onMounted(()=>{
        hoy.value = new Date().toISOString().split("T")[0]; //Asignamos el valor de la fecha del dia de hoy
        cargatags() //Cargamos todos los tags actuales hasta la fecha
    })
    //Funcion para la primera carga de todos los modales 
    async function cargatags(){ //Abrimos la funcion
      modalLoading.value = true //Abrimos el Spinner
      cruces.value = [] //Declaramos en vacio el arreglo que tendra todos los tags
      let tagruta = " "//Declaramos la variable con un espacio vacio para que el urlencode lo detecte y genere un %20
        let estatusruta = " "//Declaramos la variable con un espacio vacio para que el urlencode lo detecte y genere un %20
        let fecharuta = " "//Declaramos la variable con un espacio vacio para que el urlencode lo detecte y genere un %20
        let noPlacaRuta = " "
        let noEconomico = " "
        const ruta = encodeURI(`${API}/Ferromex/mantenimientotags/${page.value}/${numRespuesta.value}/${tagruta}/${estatusruta}/${fecharuta}/${noPlacaRuta}/${noEconomico}`)//Declaramos la ruta a consummir
        axios.get(ruta)//Mandamos a llamar la ruta a consumir
        .then((result)=>{
        if(result.status == 200){ //En caso de que la respuesta sea correcta
          modalLoading.value = false//Quitamos el spinner
          totalPaginas.value = result.data.paginas_totales //Asignamos el numero total de paginas
          currentPage.value = result.data.pagina_actual //Asignamos la pagina actual
          cruces.value = result.data.tags
      }else{
          modalLoading.value = false //Quitamos el spinner
          notify({ //Arrojamos una notificacion de que no hay registros en caso de ser falso
            title:'Sin Información',
            text:'No hay registro de tags actualmente' ,
            type: 'warn'
          });
        }
        }).catch((error) =>
        {
          notify({//Enviamos una notificacion
          title:'Upps ocurrio un error ' + error.request.status, //mostramos el numero del error en el titulo
          text: error.request.responseText, //Mostramos el error ocurrido
          type: 'error' //Declaramos el tipo de notificacion que buscamos
          });
        })
    }
    const abrirmodal = () => {
      showModal.value = !showModal.value
      const tag = ' '
      const ruta = encodeURI(`${API}/ferromex/ViaPassTags/${tag}`) //Ciframos la url para mandarla en el axios
        axios.get(ruta) //Mandamos a llamar el axios
        .then((result)=>{
            let cargatags =  result.data.content
            cargatags.forEach(element => {
              let active = false;
              if(element.active == false){
                active = true
              }
              tagsprecargados.value.push({value: element, label: element.tag,disabled: active,idViatags: element.idViatags })
            });
          }).catch((error)=>{
            console.log(error);
            notify({ //NOtificamos que no encontramos Tags
                title:'Sin Información',
                text:'No se encontraron tags',
                type: 'warn'
              });
          })
    }
    //Funcion para limipiar la validacion del input del tag
    function limpiarvalidacion() {
      validarTag.value = false //Volvemos falsa la bandera que lleva el control del tag
      validarTagTexto.value = '' //Limpiamos el texto a mostrar de la validacion 
      validarPlaca.value = false //Volvemos falsa la bandera que lleva el control del tag
      validarPlacaTexto.value = '' //Limpiamos el texto a mostrar de la validacion 
      validarNoEconomico.value = false //Volvemos falsa la bandera que lleva el control del tag
      validarNoEconomicoTexto.value = '' //Limpiamos el texto a mostrar de la validacion 
    }
    //Emit para saber si se cierra el modal
    const cerralmodalpadre = (modal) => {
      showModal.value = modal //Cerramos el modal de agrgar tag
      numerotagagregar.value = [] //Limpiamos el input de agregar tag
      numeroeconomico.value = ''
      numeroplaca.value = ''
      tagsprecargados.value = []
      limpiarvalidacion()
    }
    //Función que busca los tags
    function search(tag, estatus, fecha,tipo){
      modalLoading.value = true //Abrimos el spinner
      cruces.value = [] // Declaramos el arreglo en vacio
      if(tag == ""){ //Validamos si el campo llega vacio le damos un espacio en blanco 
        tag = " "
      }
      if(estatus == undefined){ //Validamos si el campo llega vacio le damos un espacio en blanco
        estatus = " "
      }
      if(fecha == ""){ //Validamos si el campo llega vacio le damos un espacio en blanco
        fecha = " "
      }
      if(tag == ' ' && estatus == ' ' && fecha == ' '){ //En caso de que todos los campos lleguen vacios
        modalLoading.value = false // Cerramoes el spinner
        cargatags() //Cargamos todos los tags
        notify({ //Enviamos una notificacion en la que especificamos que no podemos hacer una busqueda sin parametros
          title:'Sin Información',
          text:'Se debe llenar por lo menos un filtro para realizar una busqueda',
          type: 'warn'
        });
      }else{ //En caso de que eso sea falso 
        let estatusurl = "" //Declaramos varibles que iran en la url final
        let numeroeconomico = ""
        let numeroplaca = ""
        let tagRuta = ""
        let fechaurl = fecha //Declaramos varibles que iran en la url final
        if(fecha != " "){ //si la fecha es diferente a un espacio en blanco 
          fechaurl = new Date(fecha).toISOString() //Le damos formato para que lo reciba el back
        }
        if(estatus == "Activo"){ // Si el estatus viene como activo
          estatusurl = "true" //En la varible de la url la enviamos como true
        }else if(estatus == "Inactivo"){ // Si el estatus viene como inactivo
          estatusurl = "false" //En la varible de la url la enviamos como false
        }else if(estatus == " "){ // Si el estatus viene como vacio
          estatusurl = " " //En la varible de la url la enviamos como espacio en blanco
        }
        if(tag != ' '){
          if(tipo == 'A'){
            tagRuta = tag
            numeroplaca = " "
            numeroeconomico = " "
          }else if(tipo == 'B'){
            tagRuta = " "
            numeroplaca = " "
            numeroeconomico = tag
          }else if(tipo == 'C'){
            tagRuta = " "
            numeroplaca = tag
            numeroeconomico = " "
          }
        }else{
          tagRuta = " "
          numeroplaca = " "
          numeroeconomico = " "
        }
        const ruta = encodeURI(`${API}/ferromex/mantenimientotags/${page.value}/${numRespuesta.value}/${tagRuta}/${estatusurl}/${fechaurl}/${numeroplaca}/${numeroeconomico}`) //Ciframos la url para mandarla en el axios
        modalLoading.value = false //Cerramos el spiiner
        axios.get(ruta) //Mandamos a llamar el axios
        .then((result)=>{
            if(result.status == 200){ //Si recibimos un estatus 200 
              modalLoading.value = false //Quitamos spiiner
              totalPaginas.value = result.data.paginas_totales  //asignamos valor al numero total de paginas
              currentPage.value = result.data.pagina_actual //Asignamos valor a la pagina actual
              cruces.value = result.data.tags
            if(cruces.value.length == 0){//Si el tamaño del arreglo que no contiene los tags es igual a cero
              notify({ //Notificamos que no existen casos ni coincidencias
              title:'Sin Información',
              text:'No existen registros con los criterios de tu busqueda' ,
              type: 'warn'
            });
            }
            }else{ //Si esto es falso
              modalLoading.value = false //Cerramos Spinner
              notify({ //NOtificamos que no encontramos Tags
                title:'Sin Información',
                text:'No se encontraron tags',
                type: 'warn'
              });
            }
          })
      }
    }
    function searchchange(tag, estatus, fecha,tipo){
      modalLoading.value = true //Abrimos el spinner
      cruces.value = [] // Declaramos el arreglo en vacio
      if(tag == ""){ //Validamos si el campo llega vacio le damos un espacio en blanco 
        tag = " "
      }
      if(estatus == undefined){ //Validamos si el campo llega vacio le damos un espacio en blanco
        estatus = " "
      }
      if(fecha == ""){ //Validamos si el campo llega vacio le damos un espacio en blanco
        fecha = " "
      }
      let estatusurl = "" //Declaramos varibles que iran en la url final
      let fechaurl = fecha //Declaramos varibles que iran en la url final
      let numeroeconomico = ""
      let numeroplaca = ""
      let tagRuta = ""
      if(fecha != " "){ //si la fecha es diferente a un espacio en blanco 
        fechaurl = new Date(fecha).toISOString() //Le damos formato para que lo reciba el back
      }
      if(estatus == "Activo"){ // Si el estatus viene como activo
        estatusurl = "true" //En la varible de la url la enviamos como true
      }else if(estatus == "Inactivo"){ // Si el estatus viene como inactivo
        estatusurl = "false" //En la varible de la url la enviamos como false
      }else if(estatus == " "){ // Si el estatus viene como vacio
        estatusurl = " " //En la varible de la url la enviamos como espacio en blanco
      }
      if(tag != ' '){
        page.value = 1; 
        if(tipo == 'A'){
          tagRuta = tag
          numeroplaca = " "
          numeroeconomico = " "
        }else if(tipo == 'B'){
          tagRuta = " "
          numeroplaca = " "
          numeroeconomico = tag
        }else if(tipo == 'C'){
          tagRuta = " "
          numeroplaca = tag
          numeroeconomico = " "
        }
      }else{
        tagRuta = " "
        numeroplaca = " "
        numeroeconomico = " "
      }
      const ruta = encodeURI(`${API}/ferromex/mantenimientotags/${page.value}/${numRespuesta.value}/${tagRuta}/${estatusurl}/${fechaurl}/${numeroplaca}/${numeroeconomico}`) //Ciframos la url para mandarla en el axios
      modalLoading.value = false //Cerramos el spiiner
      axios.get(ruta) //Mandamos a llamar el axios
        .then((result)=>{
          if(result.status == 200){ //Si recibimos un estatus 200 
            modalLoading.value = false //Quitamos spiiner
            totalPaginas.value = result.data.paginas_totales  //asignamos valor al numero total de paginas
            currentPage.value = result.data.pagina_actual //Asignamos valor a la pagina actual
            cruces.value = result.data.tags
            if(cruces.value.length == 0){//Si el tamaño del arreglo que no contiene los tags es igual a cero
              notify({ //Notificamos que no existen casos ni coincidencias
              title:'Sin Información',
              text:'No existen registros con los criterios de tu busqueda' ,
              type: 'warn'
            });
            }
            }else{ //Si esto es falso
              modalLoading.value = false //Cerramos Spinner
              notify({ //NOtificamos que no encontramos Tags
                title:'Sin Información',
                text:'No se encontraron tags',
                type: 'warn'
              });
            }
          }).catch((error)=>{
            console.log(error);
          })
      
    }
  //Función que limpia los input de busqueda y regresa las transacciones de la plaza sin filtros
    function limpiar(){
      modalLoading.value = true// Abrimos spinner
      if(header.tag == " " && header.estatus == undefined && header.fecha == " "){//si los datos vienen como inician
         notify({ //Notificamos que no se puede buscar si los parametros estan vacios
            title:'Sin Información',
            text:'No puedes limpiar los parametros si estan vacios' ,
            type: 'warn'
        });
      }else{
        cruces.value = [] //Limpiamos el arreglo que contendra los datos
        tipo.value = 'A'
        header.tag = "" //Inicializamos la variable a su valor original
        header.estatus = undefined //Inicializamos la variable a su valor original
        header.fecha = "" //Inicializamos la variable a su valor original
        let tagruta = " " //Usamos una varible para que podamos poner el espacio en blanco
        let estatusruta = " " //Usamos una varible para que podamos poner el espacio en blanco
        let fecharuta = " " //Usamos una varible para que podamos poner el espacio en blanco
        let noEconomico = " "
        let noPlaca = " "
        numRespuesta.value = 10;
        const ruta = encodeURI(`${API}/Ferromex/mantenimientotags/${page.value}/${numRespuesta.value}/${tagruta}/${estatusruta}/${fecharuta}/${noPlaca}/${noEconomico}`) //Codificamos la ruta que llevara el axios
        axios.get(ruta) //Disparamos la ruta
        .then((result)=>{
        if(result.status == 200){ //Si recibimos un estatus 200 
          modalLoading.value = false //Quitamos spiiner
          totalPaginas.value = result.data.paginas_totales //Asignamos el numero total de paginas
          currentPage.value = result.data.pagina_actual //Asignamos la pagina actual
          cruces.value = result.data.tags
        }else{
          modalLoading.value = false //Cerramos Spinner
          notify({ //Notificamos que no encontramos Tags
            title:'Sin Información',
            text:'No hay registro de tags actualmente' ,
            type: 'warn'
          });
        }
        }).catch((error)=>{
          notify({//Enviamos una notificacion
          title:'Upps ocurrio un error ' + error.request.status, //mostramos el numero del error en el titulo
          text: error.request.responseText, //Mostramos el error ocurrido
          type: 'error' //Declaramos el tipo de notificacion que buscamos
          });
        })
      }
    }
    //Funcion para agregar tag 
    function agregarTag(tag,np,ne){
      console.log(tag);
      if(tag.length == 0 || np == "" || ne == "") {
        if(tag.length == 0){ //Comprobamos si el tag viene vacio
          validarTag.value = true //Si es asi declaramos en true nuestra bandera para mostrar el span 
          validarTagTexto.value = 'El Tag no puede ir vacio' //Incluimos el texto del span o por que se esta dando el error
        }
        if(np == ""){ //Comprobamos si el tag viene vacio
          validarPlaca.value = true //Si es asi declaramos en true nuestra bandera para mostrar el span 
          validarPlacaTexto.value = 'El campo Numero de placa no puede ir vacio' //Incluimos el texto del span o por que se esta dando el error
        }
        if(ne == ""){ //Comprobamos si el tag viene vacio
          validarNoEconomico.value = true //Si es asi declaramos en true nuestra bandera para mostrar el span 
          validarNoEconomicoTexto.value = 'El campo Numero Economico no puede ir vacio' //Incluimos el texto del span o por que se esta dando el error
        }
      }else{ // Si es falso procederemos a dar de alta el tag
          const tiempoTranscurrido = Date.now(); //Conseguimos la fecha y hora del dia de hoy
          const hoy = new Date(tiempoTranscurrido).toISOString(); //Damos formato iso 86001
          const tagcompleto = { // Creamos objeto para enviar el tag completo 
            "tag": tag.tag.toUpperCase(), //volvemos a mayusculas todo el contenido de este texto
            "insertionDate": hoy, //Asignamos la fecha y hora ya con su formato
            "active": true, //Mandamos por default el valor de activo
            "vehiclePlate": np,
            "idUser": "string",
            "economicNumber": ne,
            "IDVIATags": tag.idViatags
          }
          const ruta = encodeURI(`${API}/Ferromex/agregartag`) // codificamos la ruta para que tenga el formato URL
          axios.post(ruta,tagcompleto) //Mandamos a llamar el endpoint
          .then(() =>{
            notify({//Notificamos que se agrego de manera correcta el tag
              title:'TAG AGREGADO EXITOSAMENTE',
              text:'El tag se agrego de forma correcta' ,
              type: 'success'
            });
            numerotagagregar.value = [] //Limpiamos el input
            numeroplaca.value = ''
            numeroeconomico.value = ''
            cargatags()//Mandamos a llamar a la funcion de la carga de todos los tags
          }).catch((error) =>{
            console.log(error);
            notify({//Enviamos una notificacion
            title:'Upps ocurrio un error ' + error.request.status, //mostramos el numero del error en el titulo
            text: error.request.responseText, //Mostramos el error ocurrido
            type: 'error' //Declaramos el tipo de notificacion que buscamos
            });
          })
          showModal.value = false //Cerramos el modal
        }
    }
    // //Función para cambiar de página
    function showMore(page){
      cruces.value = [] //Limpiamos el arreglo de los tags
      if(header.fecha == '' && header.tag == '' && header.estatus == undefined){  //Si los campos vienen predeterminados
        let tagruta = " " //Asignamos el valor de un espacio blanco para la ruta a consumir
        let estatusruta = " " //Asignamos el valor de un espacio blanco para la ruta a consumir
        let fecharuta = " " //Asignamos el valor de un espacio blanco para la ruta a consumir
        let noEconomico = " "
        let noPlaca = " "
        const ruta = encodeURI(`${API}/Ferromex/mantenimientotags/${page}/${numRespuesta.value}/${tagruta}/${estatusruta}/${fecharuta}/${noPlaca}/${noEconomico}`) //Codificamos la ruta 
        axios.get(ruta) //Llamamos el end point 
        .then((result)=>{
          if(result.status == 200){ //Si obtenemos una respuesta positiva
            modalLoading.value = false //Quitamos spinner
              totalPaginas.value = result.data.paginas_totales //Asignamos el numero total de paginas
              currentPage.value = result.data.pagina_actual //Asignamos la pagina actual
              cruces.value = result.data.tags
          }
        })
      }
      else{
        let estatusurl = "" //Declaramos varibles que iran en la url final
        let fechaurl = header.fecha //Declaramos varibles que iran en la url final
        let tagurl = "" //Declaramos varibles que iran en la url final
        let numeroplaca = ""
        let numeroeconomico = ""
        if(header.fecha != ""){ //si la fecha es diferente a un espacio en blanco 
          fechaurl = new Date(header.fecha).toISOString() //Le damos formato para que lo reciba el back
        }else if(header.fecha == ""){ 
          fechaurl = " "
        }
        if(header.estatus == "Activo"){ // Si el estatus viene como activo
          estatusurl = "true"//En la varible de la url la enviamos como true
        }else if(header.estatus == "Inactivo"){ // Si el estatus viene como inactivo
          estatusurl = "false" //En la varible de la url la enviamos como false
        }else if(header.estatus == undefined){// Si el estatus viene como indefinido
          estatusurl = " " //En la varible de la url la enviamos con el espacio en blanco
        }
        if(header.tag == ""){ // Si el tag viene como vacio
          tagurl = " " //Asignamos un valor en blanco
          numeroplaca = " "
          numeroeconomico = " "
        }else if(header.tag != ' '){
        if(tipo.value == 'A'){
          tagurl = header.tag
          numeroplaca = " "
          numeroeconomico = " "
        }else if(tipo.value == 'B'){
          tagurl = " "
          numeroplaca = " "
          numeroeconomico = header.tag
        }else if(tipo.value == 'C'){
          tagurl = " "
          numeroplaca = header.tag
          numeroeconomico = " "
        }
        }
       const ruta = encodeURI(`${API}/ferromex/mantenimientotags/${page}/${numRespuesta.value}/${tagurl}/${estatusurl}/${fechaurl}/${numeroplaca}/${numeroeconomico}`) //Codificamos la url para el end point
        modalLoading.value = false //cerramos el spinner
        axios.get(ruta) //Mandamos a llamar el End point
        .then((result)=>{
            if(result.status == 200){
              modalLoading.value = false //Quitmaos spinner
              totalPaginas.value = result.data.paginas_totales //Asignamos el numero total de paginas
              currentPage.value = result.data.pagina_actual //Asignamos la pagina actual
              cruces.value = result.data.tags
          }
        })
      }
    }
    //Funcion para actualizar datos de la tabla()
    function actualizarLista(ac) {
      actualizar.value = ac //REsivimos parametro del emit
      if(actualizar.value){ // si es verdadero
        cargatags() //Lamamos a la funcionde cargar tags
      }
    }                 
    // //Función que manda a llamar al servicio para descargar el archivo en el formato seleccionado
    function downloadApi(tag,estatus,fecha) {
      if(estatus == undefined){//Si el parametro lo recibimos indefinido
        estatus = " "//Damos el valor en un espacio en blanco
      }
      if(fecha == ""){//Si el parametro lo recibimos fecha
        fecha = " "//Damos el valor en un espacio en blanco
      }
      let tagurl = "" //Declaramos varibles que iran en la url final
      let numeroplaca = ""
      let numeroeconomico = ""
      if(tag == ""){ // Si el tag viene como vacio
          tagurl = " " //Asignamos un valor en blanco
          numeroplaca = " "
          numeroeconomico = " "
        }else if(tag != ' '){
        if(tipo.value == 'A'){
          tagurl = header.tag
          numeroplaca = " "
          numeroeconomico = " "
        }else if(tipo.value == 'B'){
          tagurl = " "
          numeroplaca = " "
          numeroeconomico = header.tag
        }else if(tipo.value == 'C'){
          tagurl = " "
          numeroplaca = header.tag
          numeroeconomico = " "
        }
      }
      if(tag == ' ' && estatus == ' ' && fecha == ' '){
        const ruta = encodeURI(`${API}/Ferromex/Download/pdf/mantenimientotags/${tagurl}/${estatus}/${fecha}/${numeroplaca}/${numeroeconomico}`)//Ruta codificado
        xml_hhtp_request(ruta,2,'reportemantenimientotags.pdf')//Mandamos a llamar el servicio 
      }else{ //En caso de ser falso
        let estatusurl = "" //Declaramos variables para la url final
        let fechaurl = fecha //Declaramos variables para la url final
        if(fecha != " "){ //si la fecha es diferente a un espacio en blanco 
          fechaurl = new Date(fecha).toISOString() //Damos formato iso 86001
        }
        if(estatus == "Activo"){ // Si el estatus viene como activo
          estatusurl = "true" //La variable final viene en true
        }else if(estatus == "Inactivo"){// Si el estatus viene como Inactivo
          estatusurl = "false" //La variable final viene en false
        }else if(estatus == " "){// Si el estatus viene como vacio
          estatusurl = " "//La varible final lleva un espacio en blaco
        }
        const ruta = encodeURI(`${API}/Ferromex/Download/pdf/mantenimientotags/${tagurl}/${estatusurl}/${fechaurl}/${numeroplaca}/${numeroeconomico}`)//Ruta codificado
        xml_hhtp_request(ruta,2, 'reportemantenimientotags.pdf')//Mandamos a llamar el servicio 
      }
    }

    return{ 
      cerralmodalpadre,
      loading,
      numerotagagregar,
      numeroplaca,
      numeroeconomico,
      ...toRefs(header),
      search, 
      limpiar,
      cargatags,
      showMore,
      tipo,
      numRespuesta,
      actualizarLista,
      limpiarvalidacion, 
      actualizar,
      validarTag,
      validarTagTexto,
      downloadApi,
      options,
      hoy, 
      cruces, 
      page, 
      totalPaginas, 
      currentPage, 
      hasMorePages, 
      modalLoading,
      showModal,
      tagsprecargados,
      abrirmodal,
      agregarTag,
      searchchange,
      validarNoEconomico,
      validarNoEconomicoTexto, 
      validarPlaca,
      validarPlacaTexto, 
      }
  }
}
</script>
<style global>
@keyframes example {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
<style scoped>
.inp-icon {
  background: url("~@/assets/search.png") no-repeat 100%;
  background-size: 16px;
}

.pb-100 {
  padding-bottom: 100px;
}

.title-center {
  text-align: center;
  font-size: 25px;
  padding-top: 20px;
}

.bg-ferromex {
  background-color: #BB2028;
  padding: 10px 5px;
}

.ml-right {
  display: block;
  margin-left: auto;
  margin-right: 10px;
}
.btn-carriles {
  background-color: #017296;
  color: white;
  font-size: 15px;
  height: 100%;
  padding: 0px 5px;
  border: 1px solid black;
  border-radius: 5px;
}

.btn-buscar:focus {
  outline: 0;
}

.btn-carriles:focus {
  outline: 0;
}

.color-black {
  color: black !important;
}

.color-black:focus {
  outline: 0;
}

@media (max-width: 769px) {
  .btn-carriles {
    background-color: #017296;
    color: white;
    font-size: 15px;
    padding: 10px 5px;
    border: 1px solid black;
    border-radius: 5px;
  }
}
</style>