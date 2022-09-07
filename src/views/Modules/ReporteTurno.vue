<template>
<Navbar/>
<div class="grid justify-items-center p-16 2xl:p-40">
<div class="bg-white w-96 h-96 rounded-lg shadow-md 2xl:w-80 2xl:h-74">
    <h1 class="text-4xl font-bold font-titulo text-center p-2 2xl:text-6xl 2xl:p-4">Reporte Turno</h1>
  <div class="flex w-full justify-center mt-4 gap-8 2xl:gap-20 2xl:mt-10">
    <div class="flex flex-col gap-14 2xl:gap-14">
        <div>
            <label for="">Plaza de Cobro</label>
        </div>
        <div>
            <label for="">Turno</label>
        </div>
        <div>
            <label for="">Fecha</label>
        </div>
        <div>
          <label>Tipo de Reporte*</label>
        </div>
    </div>
    <div class="flex flex-col gap-14 2xl:gap-14">
         <div>
            <label for="">Mazanillo</label>
        </div>
        <div>
            <select class="input" v-model="cajero.turno"  placeholder="XXXXX">
              <option value="undefined" disabled>Seleccione un turno</option>
              <option value="1">Turno 1</option>
              <option value="2">Turno 2</option>
              <option value="3">Turno 3</option>
            </select>
        </div>
        <div>
            <input type="date" class="input" v-model="cajero.fecha" :max="hoy">
        </div>
        <div>
            <select class="input" v-model="cajero.reporte"  placeholder="XXXXX">
              <option value="undefined" disabled>Seleccione una opción</option>
              <option value="1">Concentrado</option>
              <option value="2">Transacciones</option>
              <option value="3">Ambos</option>
            </select>
      </div>
    </div>
  </div>
  <div class="flex w-full justify-center p-14 ">
      <div>
          <button class="border w-40 bg-ferromex text-white ferromex-color" :class="{'cursor-not-allowed' : bloquearbutton}" @click="generareportever(cajero.turno,cajero.fecha,cajero.reporte)">Vista previa</button>
          <button class="border w-40 bg-ferromex text-white ferromex-color" :class="{'cursor-not-allowed' : bloquearbutton}" @click="generareportedescargar(cajero.turno,cajero.fecha,cajero.reporte)">Descargar Reporte</button>
      </div>
  </div>
</div>

</div>
 
<Footer/>
</template>

<script>
//const API = process.env.VUE_APP_URL_API_PRODUCCION
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer";
import { notify } from "@kyvg/vue3-notification";
import { reactive, ref,onMounted } from 'vue';

export default {
components: {
        Navbar,
        Footer
    },
setup(){

  const cajero = reactive({
    turno: undefined,
    fecha: "",
    reporte: undefined 
  })
  const hoy = ref('')
  const bloquearbutton = ref(false)
  onMounted(()=>{
        hoy.value = new Date().toISOString().split("T")[0];
  })
  const rutapdf = ref('')
  function generareportever(idturno,fechareporte,reporte){
    if((idturno == undefined && fechareporte == undefined) || idturno == undefined || fechareporte == undefined || reporte== undefined){
    notify({
            title:'Sin parametros',
            text:'Para generar un reporte debes llenar los parametros necesarios' ,
            type: 'error'
    });
    }else{
    //Generamos la ruta que hara la llamada a la generacion de los reportes
    if(reporte == "1"){
      //ServiceFiles.xml_hhtp_request(`${API}/Ferromex/Download/pdf/reporteOperativo/reporteTurno/concentrado/${idturno}/${fechareporte}`)
    }else if(reporte == "2"){
      //ServiceFiles.xml_hhtp_request(`${API}/Ferromex/Download/pdf/reporteOperativo/reporteTurno/transacciones/${idturno}/${fechareporte}`)
    }else if(reporte == "3"){
      //ServiceFiles.xml_hhtp_request(`${API}/Ferromex/Download/pdf/reporteOperativo/reporteTurno/concentrado/${idturno}/${fechareporte}`)
      //ServiceFiles.xml_hhtp_request(`${API}/Ferromex/Download/pdf/reporteOperativo/reporteTurno/transacciones/${idturno}/${fechareporte}`)
    }
    
  
    
  }
  }
  function generareportedescargar(idturno,fechareporte,reporte){
    if((idturno == undefined && fechareporte == undefined) || idturno == undefined || fechareporte == undefined){
     notify({
            title:'Sin parametros',
            text:'Para generar un reporte debes llenar los parametros necesarios' ,
            type: 'error'
     });
    }else{
    //Generamos la ruta que hara la llamada a la generacion de los reportes
    if(reporte == "1"){
      //ServiceFiles.descargararchivo(`${API}/Ferromex/Download/pdf/reporteOperativo/reporteTurno/concentrado/${idturno}/${fechareporte}`,fechareporte + ' ConcentradoTurno.pdf')
    }else if(reporte == "2"){
      //ServiceFiles.descargararchivo(`${API}/Ferromex/Download/pdf/reporteOperativo/reporteTurno/transacciones/${idturno}/${fechareporte}`,fechareporte + ' TransaccionesTurno.pdf')
    }else if(reporte == "3"){
      //ServiceFiles.descargararchivo(`${API}/Ferromex/Download/pdf/reporteOperativo/reporteTurno/concentrado/${idturno}/${fechareporte}`,fechareporte + ' ConcentradoTurno.pdf')
      //ServiceFiles.descargararchivo(`${API}/Ferromex/Download/pdf/reporteOperativo/reporteTurno/transacciones/${idturno}/${fechareporte}`,fechareporte + ' TransaccionesTurno.pdf')
    }
  }
  }
return {generareportever,generareportedescargar,cajero,hoy,rutapdf,bloquearbutton}
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
</style>