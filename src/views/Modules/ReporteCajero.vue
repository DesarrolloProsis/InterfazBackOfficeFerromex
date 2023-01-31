<!-- <template>
<Navbar/>
<div class="grid justify-items-center p-18 mt-6 2xl:p-36">
<div class="bg-white w-96 h-69 rounded-lg shadow-md 2xl:w-80 2xl:h-80">
  <h1 class="text-4xl font-bold font-titulo text-center p-2 2xl:text-6xl 2xl:p-4">Reporte Cajero</h1>
  <div class="flex w-full justify-center mt-4 gap-8 2xl:gap-20 2xl:mt-10">
    <div class="flex flex-col gap-14 2xl:gap-20">
        <div>
            <label for="">Plaza de Cobro</label>
        </div>
        <div>
            <label for="">N°Cajero*</label>
        </div>
        <div>
            <label for="">Turno*</label>
        </div>
        <div>
            <label for="">Fecha*</label>
        </div>
        
    </div>
    <div class="flex flex-col gap-14 2xl:gap-20">
         <div>
            <label for="">Mazanillo</label>
        </div>
        <div>
            <input type="text" placeholder="XXXXX" class="input" v-model="numerocajero"/>
        </div>
        <div>
            <select class="input" v-model="turno"  placeholder="XXXXX">
              <option value="undefined" disabled>Seleccione un turno</option>
              <option value="1">Turno 1</option>
              <option value="2">Turno 2</option>
              <option value="3">Turno 3</option>
            </select>
        </div>
        <div>
            <input type="date" class="input" v-model="fecha" :max="hoy">
        </div>
    </div>
  </div>
  <div class="flex w-full justify-center p-14 2xl:p-20">
      <button class="border w-40 bg-ferromex text-white" @click="generareporte(numerocajero,turno,fecha)">Generar Reporte</button>
  </div>
</div>
</div>
   <Modal :show="showModal" @cerrarmodal="cerralmodalpadre">
        <h1 class="text-4xl font-bold font-titulo text-center mt-4">Seleccione las bolsas</h1>
            <div class="w-full justify-center p-10 ">
      <table class="tftable w-full">
      <tr class="h-10 w-full bg-gray-200 text-center">
        <th>
          <label class="text-black px-4 2xl:px-16">Fecha Inicio</label>
        </th>
        <th>
          <label class="text-black px-4 2xl:px-10">Fecha Fin</label>
        </th>
        <th>
          <label class="text-black px-4 2xl:px-10">ViA</label>
        </th>
        <th>
          <label class="text-black px-4 2xl:px-12">Bolsa</label>
        </th>
        <th>
          <label class="text-black px-4 2xl:px-10">Acciones</label>
        </th>
      </tr>
      <template v-if="bolsas.length">
         <tr class="text-center w-full text-sm" v-for="(bolsa, index) in bolsas" :key="index">
        <td>{{moment.utc(bolsa.fechaInicio).local().format("YYYY-MM-DD HH:mm:ss a")}}</td>
        <td>{{moment.utc(bolsa.fechaFin).local().format("YYYY-MM-DD HH:mm:ss a")}}</td>
        <td>{{bolsa.carrilBolsa}}</td>
        <td>{{bolsa.bolsa}}</td>
        <td>
          <button class="rounded-lg w-18 bg-ferromex text-white p-10" @click="generarbolsa(bolsa.idBolsa)">Generar </button>
        </td>
       </tr>
      </template>
      <template v-else>
      <tr>
        <td class="w-full text-center text-red-500 m-10" colspan="9">                                    
        <div class="mt-8 mb-8">Sin Informacion</div>
        </td>
        </tr> 
    </template>
    </table>
            </div>
    </Modal> 
<Footer/>
</template>

<script>
//const API = process.env.VUE_APP_URL_API_PRODUCCION
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer";
import Modal from "../../components/Modal.vue"
import { notify } from "@kyvg/vue3-notification";
import { reactive, ref,onMounted, toRefs,inject } from 'vue'
//import ServiceFiles from '../../Servicios/Files-Service'
import moment from 'moment'
export default {
components: {
        Navbar,
        Footer,
         Modal,
    },
created: function () {
    this.moment = moment;
},
setup(){
  const axios = inject('axios')
  const showModal = ref(false)
  const cajero = reactive({
    numerocajero: "",
    turno: undefined,
    fecha: "" 
  })
  const hoy = ref('')
  const bolsas = ref([])
  const vnocajero = ref(false)
  const vturno = ref(false)
  const vfecha = ref(false)
  onMounted(()=>{
        hoy.value = new Date().toISOString().split("T")[0];
  })
  function generareporte(nocajero,idturno,fechareporte){
    console.log(nocajero,idturno,fechareporte);
    if(nocajero == "" && idturno == undefined && fechareporte == ""){
     notify({
            title:'Sin parametros',
            text:'Para generar las bolsas requieres llenar todos los campos' ,
            type: 'error'
     });
    }else{
      //Generamos la ruta que hara la llamada a las bolsas
    //const ruta = encodeURI(`${API}/Ferromex/reportecajero/bolsascajero/${nocajero}/${idturno}/${fechareporte}`)
    //axios.get(ruta)
    //En el then se deben llenar las las bolsas pertenecientes
    .then((res)=>{
      console.log(res)
      showModal.value = true
      bolsas.value = res.data.content;
      console.log(bolsas.value)
    })
    //Capturamos error por si lo hay por parte de la peticion
    .catch((error)=>{console.log(error)})
    
    }
    
  }
  //Emit para saber si se cierra el modal
    const cerralmodalpadre = (modal) => {
      showModal.value = modal
      bolsas.value = []
    }
  //Funcion que genera los reportes
    function generarbolsa(idbolsa){
      //ServiceFiles.xml_hhtp_request(`${API}/Ferromex/Download/pdf/reporteOperativo/reporteCajero/concentrado/${idbolsa}`, 'CajeroContrado.pdf'); //Con el servicio importado mandamos la ruta y el nombre
      //ServiceFiles.xml_hhtp_request(`${API}/Ferromex/Download/pdf/reporteOperativo/reporteCajero/transacciones/${idbolsa}`, 'TransaccionesCajero.pdf');//Con el servicio importado mandamos la ruta y el nombre
      //Devolvemos los valores a su valor por default
      bolsas.value = [];
      showModal.value = false
      cajero.numerocajero = ""
      cajero.turno = undefined
      cajero.fecha = ""  
    }
return {showModal,generareporte,cerralmodalpadre,generarbolsa,bolsas,hoy,vnocajero,vturno,vfecha,...toRefs(cajero)}
}
}
</script>

<style scoped>
.border {
    border: 1px solid #ffffff;
    border-radius: 150px;
    -webkit-box-shadow: 5px 5px 14px -5px rgba(0, 0, 0, 0.44);
    box-shadow: 5px 5px 14px -5px rgba(0, 0, 0, 0.44);
}
.border h1 {
    text-align: center;
    padding-top: 15px;
}
.bg-ferromex {
  background-color: #BB2028;
  padding: 10px 5px;
}
</style> -->