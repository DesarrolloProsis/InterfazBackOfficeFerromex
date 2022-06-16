<template>
  <Navbar/>
  <div class="container mx-auto px-0 mb-4">
    <h1 class="title-center font-titulo font-bold pb-4 mb-2">Mantenimiento de Tag's</h1>
  <div>
    <div class="-mt-4 mx-2 md:mx-0">
        <div class="flex flex-col  bg-ferromex rounded-lg border-gray-200 pb-0 mb-4">          
            <div class="flex-1 flex flex-row space-x-2">
              <div class="w-full inline-flex flex-2 justify-center">
                <label for="tag" class="text-white my-auto">TAG:</label>
                  <input id="tag" v-model="tag" class="my-auto bg-white flex border border-gray-200 rounded ml-2 h-6 w-40" placeholder="Buscar No. Tag" type="text" />
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
                  <input v-model="fecha" type="date" :max="hoy" class="my-auto p-1 bg-white flex border border-gray-200 rounded ml-2 h-6 w-40 "> 
              </div>
              <div class="w-full flex-1">
                <div class="h-full my-auto text-white font-md p-2 ">                      
                  <button :disabled="modalLoading" class="btn-buscar animacion" :class="{'cursor-not-allowed': modalLoading}" @click="search( tag, estatus, fecha)">Buscar</button>
                </div>
              </div>
              <div class="w-full flex-1">
                <div class="h-full my-auto text-white font-md p-2">                      
                  <button :disabled="modalLoading" class="btn-buscar animacion" :class="{'cursor-not-allowed': modalLoading}" @click="limpiar()">Todos</button>
                </div>
              </div>
              <div class="w-full flex-1">
                <div class="h-full my-auto text-white font-md p-2 w-40">                      
                  <button :disabled="modalLoading" class="btn-buscar animacion" :class="{'cursor-not-allowed': modalLoading}" @click="showModal = !showModal">Agregar TAG</button>
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
  </div>
  <Paginacion :total-pages="totalPaginas" :total="100" :current-page="currentPage" :has-more-pages="hasMorePages" @pagechanged="showMore"/>  
  <Spinner :modalLoading="modalLoading"/>
  <Modal :show="showModal" @cerrarmodal="cerralmodalpadre">
        <h1 class="text-4xl font-bold font-titulo text-center mt-4">Agregar Tag</h1>
            <div class="flex w-full justify-center gap-20 mt-10">
                <div class="flex flex-col gap-10">
                    <div>
                        <label for="">TAG</label>
                    </div>
                </div>
                <div class="flex flex-col gap-10">
                    <div>
                        <input type="text" class="border border-gray-500 rounded focus:border-blue-400 focus:outline-none" :class="{'border-red-600': validarTag}" v-model="numerotagagregar" @input="limpiarvalidacion()">
                        <span v-if="validarTag" class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                         {{validarTagTexto}}
                        </span>
                    </div>
                </div>
            </div>
            <div class="flex w-full justify-center mt-10 mb-8">
                <button class="border w-40 bg-ferromex text-white" @click="agregarTag(numerotagagregar)">Agregar TAG</button>
            </div>
  </Modal>
<Footer/>
</template>
<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION
import TablaMantenimientoTag from "../../components/Tabla-ManteniminetoTags.vue";
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer";
import axios from "axios";
import ServiceFiles from '../../Servicios/Files-Service'
import Paginacion from "../../components/Paginacion.vue"
import { notify } from "@kyvg/vue3-notification";
import Spinner from '../../components/Spinner.vue'
import { ref,reactive,toRefs,onMounted } from 'vue'
import Modal from "../../components/Modal.vue"
export default {
  name: "BusquedaCruces",
  components: {
    TablaMantenimientoTag,
    Navbar,
    Footer,   
    Paginacion,
    Spinner,
    Modal
  },
  setup() {
    const cruces = ref([])
    const token = ref("")
    const formato = ref('')
    const tramo = ref('')
    const plaza = ref('')
    const page = ref(1)
    const hoy = ref('')
    const totalPaginas = ref(0)
    const currentPage = ref(1)
    const hasMorePages = ref(true)
    const modalLoading = ref(true)
    const numRespuesta = ref(9)
    const showModal = ref(false)
    const numerotagagregar = ref('')
    const options = ref(['Activo','Inactivo'])
    const actualizar = ref(false)
    const validarTag = ref(false)
    const validarTagTexto = ref(false)
    const header = reactive({
      tag: "",
      estatus: undefined,
      fecha: ""
    })
    onMounted(()=>{
        hoy.value = new Date().toISOString().split("T")[0];
        cargatags()
    })
    //Funcion para la primera carga del modal
    async function cargatags(){
      modalLoading.value = true
      cruces.value = []
      let tagruta = " "
        let estatusruta = " "
        let fecharuta = " "
        const ruta = encodeURI(`${API}/Ferromex/mantenimientotags/${page.value}/${numRespuesta.value}/${tagruta}/${estatusruta}/${fecharuta}`)
        console.log(ruta);
        axios.get(ruta)
        .then((result)=>{
        console.log(result)
        if(result.status == 200){
          modalLoading.value = false
          totalPaginas.value = result.data.paginas_totales
          console.log(totalPaginas.value)
          currentPage.value = result.data.pagina_actual
          console.log(totalPaginas.value)
          result.data.tags.forEach((e)=>{
            let obj = {
              tag: e.tag,
              insertionDate : e.insertionDate,
              active: e.active
            }
            cruces.value.push(obj)
          })
       }else{
          modalLoading.value = false
          notify({
            title:'Sin Información',
            text:'No hay registro de tags actualmente' ,
            type: 'warn'
          });
        }
        }).catch((error) =>
        {console.log(error)}
        )
    }
    //Funcion para limipiar la validacion del input del tag
    function limpiarvalidacion() {
      validarTag.value = false
      validarTagTexto.value = ''
    }
    //Emit para saber si se cierra el modal
    const cerralmodalpadre = (modal) => {
      console.log(modal)
      showModal.value = modal
      numerotagagregar.value = ''
      console.log(showModal.value)
    }
    //Función que busca las transacciones en la plaza, con o sin filtros
    function search(tag, estatus, fecha){
      modalLoading.value = true
      cruces.value = []
      console.log(estatus)
      if(tag == ""){
        tag = " "
      }
      if(estatus == undefined){
        estatus = " "
      }
      if(fecha == ""){
        fecha = " "
      }
      console.log(tag,estatus,fecha)
      if(tag == ' ' && estatus == ' ' && fecha == ' '){
        modalLoading.value = false
        cargatags()
        notify({
          title:'Sin Información',
          text:'Se debe llenar por lo menos un filtro para realizar una busqueda',
          type: 'warn'
        });
      }else{
        let estatusurl = ""
        let fechaurl = fecha
        if(fecha != " "){
          fechaurl = new Date(fecha).toISOString()
        }
        if(estatus == "Activo"){
          estatusurl = "true"
        }else if(estatus == "Inactivo"){
          estatusurl = "false"
        }else if(estatus == " "){
          estatusurl = " "
        }
        const ruta = encodeURI(`${API}/ferromex/mantenimientotags/${page.value}/${numRespuesta.value}/${tag}/${estatusurl}/${fechaurl}`)
        console.log(ruta)
        modalLoading.value = false
        axios.get(ruta)
        .then((result)=>{
          console.log(result);
            console.log(result.data);
            if(result.status == 200){
              modalLoading.value = false
              totalPaginas.value = result.data.paginas_totales
              currentPage.value = result.data.pagina_actual
              result.data.tags.forEach((e)=>{
                let obj = {
                  tag: e.tag,
                  insertionDate : e.insertionDate,
                  active: e.active
                }
                cruces.value.push(obj)
              })
            if(cruces.value.length == 0){
              notify({
              title:'Sin Información',
              text:'No existen registros con los criterios de tu busqueda' ,
              type: 'warn'
            });
            }
            }else{
              modalLoading.value = false
              notify({
                title:'Sin Información',
                text:'No se encontraron transacciones',
                type: 'warn'
              });
            }
          })
      }
    }
  //Función que limpia los input de busqueda y regresa las transacciones de la plaza sin filtros
    function limpiar(){
      modalLoading.value = true
      if(header.tag == " " && header.estatus == undefined && header.fecha == " "){
         notify({
            title:'Sin Información',
            text:'No puedes limpiar los parametro estan vacios' ,
            type: 'warn'
         });
      }else{
        cruces.value = []
        header.tag = ""
        header.estatus = undefined
        header.fecha = ""
        let tagruta = " "
        let estatusruta = " "
        let fecharuta = " "
        const ruta = encodeURI(`${API}/Ferromex/mantenimientotags/${page.value}/${numRespuesta.value}/${tagruta}/${estatusruta}/${fecharuta}`)
        axios.get(ruta)
        .then((result)=>{
          console.log(result)
        if(result.status == 200){
          modalLoading.value = false
          totalPaginas.value = result.data.paginas_totales
          console.log(totalPaginas.value)
          currentPage.value = result.data.pagina_actual
          console.log(totalPaginas.value)
          result.data.tags.forEach((e)=>{
            let obj = {
              tag: e.tag,
              insertionDate : e.insertionDate,
              active: e.active
            }
            cruces.value.push(obj)
          })
       }else{
          modalLoading.value = false
          notify({
            title:'Sin Información',
            text:'No hay registro de tags actualmente' ,
            type: 'warn'
          });
        }
        }).catch((error)=>{console.log(error)})
        console.log(ruta);
      }
    }
    function agregarTag(tag){
        console.log(tag)
        if(tag == ""){
          validarTag.value = true
          validarTagTexto.value = 'El campo del tag no puede ir vacio'
        }else{
          const tiempoTranscurrido = Date.now();
          const hoy = new Date(tiempoTranscurrido).toISOString();
          console.log(hoy)
          const tagcompleto = {
            "tag": tag.toUpperCase(),
            "insertionDate": hoy,
            "active": true
          }
          const ruta = encodeURI(`${API}/Ferromex/agregartag`)
          axios.post(ruta,tagcompleto)
          .then((res) =>{
            console.log(res)
            notify({
              title:'TAG AGREGADO EXITOSAMENTE',
              text:'El tag se agrego de forma correcta' ,
              type: 'success'
            });
            numerotagagregar.value = ''
            cargatags(header.tag,header.estatus,header.fecha )
          }).catch((err) =>{
            console.log(err)
          })
          showModal.value = false
        }
    }
    // //Función para cambiar de página
    function showMore(page){
      cruces.value = []
      if(header.fecha == '' && header.tag == '' && header.estatus == undefined){
        let tagruta = " "
        let estatusruta = " "
        let fecharuta = " "
        const ruta = encodeURI(`${API}/Ferromex/mantenimientotags/${page}/${numRespuesta.value}/${tagruta}/${estatusruta}/${fecharuta}`)
        axios.get(ruta)
        .then((result)=>{
          if(result.status == 200){
            modalLoading.value = false
              totalPaginas.value = result.data.paginas_totales
              currentPage.value = result.data.pagina_actual
              result.data.tags.forEach((e)=>{
                let obj = {
                  tag: e.tag,
                  insertionDate : e.insertionDate,
                  active: e.active
                }
                cruces.value.push(obj)
          })
          }
        })
      }
      else{
        let estatusurl = ""
        let fechaurl = header.fecha
        let tagurl = ""
        if(header.fecha != ""){
          fechaurl = new Date(header.fecha).toISOString()
        }else if(header.fecha == ""){
          fechaurl = " "
        }
        if(header.estatus == "Activo"){
          estatusurl = "true"
        }else if(header.estatus == "Inactivo"){
          estatusurl = "false"
        }else if(header.estatus == undefined){
          estatusurl = " "
        }
        if(header.tag == ""){
          tagurl = " "
        }else if(header.tag != ""){
          tagurl = header.tag
        }
       const ruta = encodeURI(`${API}/ferromex/mantenimientotags/${page}/${numRespuesta.value}/${tagurl}/${estatusurl}/${fechaurl}`)
        console.log(ruta)
        modalLoading.value = false
        axios.get(ruta)
        .then((result)=>{
          console.log(result);
            console.log(result.data);
            if(result.status == 200){
              modalLoading.value = false
              totalPaginas.value = result.data.paginas_totales
              currentPage.value = result.data.pagina_actual
              result.data.tags.forEach((e)=>{
                let obj = {
                  tag: e.tag,
                  insertionDate : e.insertionDate,
                  active: e.active
                }
                cruces.value.push(obj)
              })
          }
        })
      }
    }
    //Funcion para actualizar datos de la tabla()
    function actualizarLista(ac) {
      actualizar.value = ac
      console.log(actualizar.value);
      if(actualizar.value){
        cargatags()
      }
    }                 
    // //Función que manda a llamar al servicio para descargar el archivo en el formato seleccionado
    function downloadApi(tag,estatus,fecha) {
      if(tag == ""){
        tag = " "
      }
      if(estatus == undefined){
        estatus = " "
      }
      if(fecha == ""){
        fecha = " "
      }
      console.log(tag,estatus,fecha)
      if(tag == ' ' && estatus == ' ' && fecha == ' '){
        const ruta = encodeURI(`${API}/ferromex/Download/pdf/mantenimientotags/${tag}/${estatus}/${fecha}`)
        ServiceFiles.xml_hhtp_request(ruta, 'reportemantenimientotags.pdf')
      }else{
        let estatusurl = ""
        let fechaurl = fecha
        if(fecha != " "){
          fechaurl = new Date(fecha).toISOString()
        }
        if(estatus == "Activo"){
          estatusurl = "true"
        }else if(estatus == "Inactivo"){
          estatusurl = "false"
        }else if(estatus == " "){
          estatusurl = " "
        }
        const ruta = encodeURI(`${API}/ferromex/Download/pdf/mantenimientotags/${tag}/${estatusurl}/${fechaurl}`)
        console.log(ruta)
        ServiceFiles.xml_hhtp_request(ruta, 'reportemantenimientotags.pdf')
      }
    }

    return{ 
      cerralmodalpadre,
      numerotagagregar,
      ...toRefs(header),
      search, 
      limpiar,
      cargatags,
      showMore,
      actualizarLista,
      limpiarvalidacion, 
      actualizar,
      validarTag,
      validarTagTexto,
      downloadApi,
      options,
      hoy, 
      cruces, 
      token,  
      formato, 
      tramo, 
      plaza, 
      page, 
      totalPaginas, 
      currentPage, 
      hasMorePages, 
      modalLoading,
      showModal,
      agregarTag
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