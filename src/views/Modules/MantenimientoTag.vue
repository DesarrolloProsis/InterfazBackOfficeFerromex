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
                  <input v-model="fecha" type="date" class="my-auto p-1 bg-white flex border border-gray-200 rounded ml-2 h-6 w-40 "> 
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
                  <button :disabled="modalLoading" class="botonIconBuscar animacion" :class="{'cursor-not-allowed': modalLoading}">
                    Descargar
                    <fa icon="download" class="hover:text-white"/>
                  </button>
                </div>
              </div>
              </div>
        </div>
    </div>
  </div>
  <TablaMantenimientoTag :dataCruces="cruces"/>
  </div>
  <Paginacion :total-pages="totalPaginas" :total="100" :current-page="currentPage" :has-more-pages="hasMorePages" />  
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
                        <input type="text" class="border border-gray-500 rounded" v-model="numerotagagregar">
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
//import axios from "axios";
//import ServiceFiles from '../../Servicios/Files-Service'
import Paginacion from "../../components/Paginacion.vue"
import { notify } from "@kyvg/vue3-notification";
import Spinner from '../../components/Spinner.vue'
import { ref,reactive,toRefs } from 'vue'
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
    const cruces = ref([
    {
      tag: 'XXXXX',
      estatus: 'Activo',
      fecha: '2022/05/22'
    },
    {
      tag: 'XXXXX01',
      estatus: 'Activo',
      fecha: '2022/05/22'
    },
    {
      tag: 'XXXXX02',
      estatus: 'Activo',
      fecha: '2022/05/22'
    },
    {
      tag: 'XXXXX03',
      estatus: 'Activo',
      fecha: '2022/05/22'
    },
    {
      tag: 'XXXXX04',
      estatus: 'Inctivo',
      fecha: '2022/05/22'
    },
    {
      tag: 'XXXXX05',
      estatus: 'Activo',
      fecha: '2022/05/22'
    }
      

    ])
    const token = ref("")
    const formato = ref('')
    const tramo = ref('')
    const plaza = ref('')
    const page = ref(1)
    const totalPaginas = ref(0)
    const currentPage = ref(1)
    const hasMorePages = ref(true)
    const modalLoading = ref(false)
    const numRespuesta = ref(10)
    const showModal = ref(false)
    const numerotagagregar = ref('')
    const options = ref(['Activo','Inactivo'])
    const header = reactive({
      tag: "",
      estatus: undefined,
      fecha: ""
    })
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
        notify({
          title:'Sin Información',
          text:'Se debe llenar por lo menos un filtro para realizar una busqueda',
          type: 'warn'
        });
      }else{
        const ruta = encodeURI(`${API}/ferromex/mantenimientotagas/${page.value}/${numRespuesta.value}/${tag}/${estatus}/${fecha}`)
        console.log(ruta)
        modalLoading.value = false
        // axios.get(`${API}/Transacciones/BusquedaTransacciones/PaginacionCompleta/${tag}/${estatus}/${fecha}/${page.value}/${numRespuesta.value}`)
        //   .then((result)=>{
        //     console.log(result.data);
        //     if(result.data.status == "Ok" && result.data.body.length > 0){
        //       modalLoading.value = false
        //       totalPaginas.value = result.data.numberPages
        //       currentPage.value = result.data.now
        //       result.data.body.forEach((e)=>{
        //         let obj = {
        //           tag: e.noTag,
        //           estatus: e.carril,
        //           fecha: e.fecha,
        //         }
        //         cruces.value.push(obj)
        //       })
        //     }else{
        //       modalLoading.value = false
        //       notify({
        //         title:'Sin Información',
        //         text:'No se encontraron transacciones',
        //         type: 'warn'
        //       });
        //     }
        //   })
      }
    }
  //Función que limpia los input de busqueda y regresa las transacciones de la plaza sin filtros
    function limpiar(){
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
        const ruta = encodeURI(`${API}/ferromex/mantenimientotagas/${page.value}/${numRespuesta.value}/${tagruta}/${estatusruta}/${fecharuta}`)
        console.log(ruta);
      }
      //axios.get(`${API}/Transacciones/BusquedaTransacciones/PaginacionCompleta/${plaza}/null/null/${page.value}/${numRespuesta.value}`)
      // .then((result)=>{
      //   if(result.data.status == "Ok"){
      //     modalLoading.value = false
      //     totalPaginas.value = result.data.numberPages
      //     currentPage.value = result.data.now
      //     result.data.body.forEach((e)=>{
      //       let obj = {
      //         tag: e.noTag,
      //         carril: e.carril,
      //         fecha: e.fecha,
      //         medioPago: e.nombrePago,
      //         tipo: e.tipoVehiculo,
      //         tarifa: e.tarifa
      //       }
      //       cruces.value.push(obj)
      //     })
      //   }else{
      //     modalLoading.value = false
      //     notify({
      //       title:'Sin Información',
      //       text:'No ' ,
      //       type: 'warn'
      //     });
      //   }
      // })
    }
    function agregarTag(tag){
        console.log(tag)
        const tiempoTranscurrido = Date.now();
        const hoy = new Date(tiempoTranscurrido);
        console.log(hoy)
        showModal.value = false
    }
    // //Función para cambiar de página
    // function showMore(page){
    //   if((fecha.value == '' || fecha.value == null || fecha.value == undefined) && (tag.value == '' || tag.value == null || tag.value == undefined)){
    //     cruces.value = []
    //     axios.get(`${API}/Transacciones/BusquedaTransacciones/PaginacionCompleta/${plaza.value}/null/null/${page}/${numRespuesta.value}`)
    //     .then((result)=>{
    //       if(result.data.status == "Ok"){
    //         modalLoading.value = false
    //         totalPaginas.value = result.data.numberPages
    //         currentPage.value = result.data.now
    //         result.data.body.forEach((e)=>{
    //           let obj = {
    //             tag: e.noTag,
    //             carril: e.carril,
    //             fecha: e.fecha,
    //             medioPago: e.nombrePago,
    //             tipo: e.tipoVehiculo,
    //             tarifa: e.tarifa
    //           }
    //           cruces.value.push(obj)
    //         })
    //       }
    //     })
    //   }else{
    //     cruces.value = []
    //     axios.get(`${API}/Transacciones/BusquedaTransacciones/PaginacionCompleta/${plaza.value}/${fecha.value}/${tag.value}/${page}/${numRespuesta.value}`)
    //     .then((result)=>{
    //       if(result.data.status == "Ok"){
    //         modalLoading.value = false
    //         totalPaginas.value = result.data.numberPages
    //         currentPage.value = result.data.now
    //         result.data.body.forEach((e)=>{
    //           let obj = {
    //             tag: e.noTag,
    //             carril: e.carril,
    //             fecha: e.fecha,
    //             medioPago: e.nombrePago,
    //             tipo: e.tipoVehiculo,
    //             tarifa: e.tarifa
    //           }
    //           cruces.value.push(obj)
    //         })
    //       }
    //     })
    //   }
    // }                 
    // //Función que manda a llamar al servicio para descargar el archivo en el formato seleccionado
    // function downloadApi(tipo) {
    //   var myHeaders = new Headers();
    //   myHeaders.append("Authorization", "Bearer " + token.value);
    //   myHeaders.append("Content-Type", "application/json");
    //   if(plaza.value == ''){
    //     notify({
    //       title:'Sin Información',
    //       text:'No se puede exportar sin antes hacer una busqueda',
    //       type: 'warn'
    //     });
    //   }else{
    //     //Sin filtros solo Plaza
    //     if(fecha.value == null && tag.value == null && plaza.value != ''){
    //       if (tipo == "csv") {
    //         ServiceFiles.xml_hhtp_request(`${API}/Transacciones/Download/Csv/${plaza.value}/null/null`, 'transacciones.csv')
    //       } 
    //       else if (tipo == "excel") {        
    //         ServiceFiles.xml_hhtp_request(`${API}/Transacciones/Download/Excel/${plaza.value}/null/null`, 'transacciones.xlsx')            
    //       } 
    //       else if (tipo == "txt") {
    //         ServiceFiles.xml_hhtp_request(`${API}/Transacciones/Download/txt/${plaza.value}/null/null`, 'transacciones.txt')
    //       }
    //     }//Filtro de Tag y Plaza
    //     else if(tag.value != null && fecha.value == null && plaza.value != ''){
    //       if (tipo == "csv") {
    //         ServiceFiles.xml_hhtp_request(`${API}/Transacciones/Download/Csv/${plaza.value}/${tag.value}/null`, 'transacciones.csv')
    //       } 
    //       else if (tipo == "excel") {        
    //         ServiceFiles.xml_hhtp_request(`${API}/Transacciones/Download/Excel/${plaza.value}/${tag.value}/null`, 'transacciones.xlsx')            
    //       } 
    //       else if (tipo == "txt") {
    //         ServiceFiles.xml_hhtp_request(`${API}/Transacciones/Download/txt/${plaza.value}/${tag.value}/null`, 'transacciones.txt')
    //       }
    //     }//Filtro de Fecha y Plaza
    //     else if(fecha.value != null && tag.value == null && plaza.value != ''){
    //       if (tipo == "csv") {
    //         ServiceFiles.xml_hhtp_request(`${API}/Transacciones/Download/Csv/${plaza.value}/null/${fecha.value}`, 'transacciones.csv')
    //       } 
    //       else if (tipo == "excel") {        
    //         ServiceFiles.xml_hhtp_request(`${API}/Transacciones/Download/Excel/${plaza.value}/null/${fecha.value}`, 'transacciones.xlsx')            
    //       } 
    //       else if (tipo == "txt") {
    //         ServiceFiles.xml_hhtp_request(`${API}/Transacciones/Download/txt/${plaza.value}/null/${fecha.value}`, 'transacciones.txt')
    //       }
    //     }//Todos los filtros
    //     else{
    //       if (tipo == "csv") {
    //         ServiceFiles.xml_hhtp_request(`${API}/Transacciones/Download/Csv/${plaza.value}/${tag.value}/${fecha.value}`, 'transacciones.csv')
    //       } 
    //       else if (tipo == "excel") {        
    //         ServiceFiles.xml_hhtp_request(`${API}/Transacciones/Download/Excel/${plaza.value}/${tag.value}/${fecha.value}`, 'transacciones.xlsx')            
    //       } 
    //       else if (tipo == "txt") {
    //         ServiceFiles.xml_hhtp_request(`${API}/Transacciones/Download/txt/${plaza.value}/${tag.value}/${fecha.value}`, 'transacciones.txt')
    //       }
    //     }
    //   }
    // }

    return{ 
      cerralmodalpadre,
      numerotagagregar,
      ...toRefs(header),
      search, 
      limpiar,
      //showMore, 
      //recibir_tramo_plaza, 
      //downloadApi,
      options, 
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