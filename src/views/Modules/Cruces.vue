<template>
    <Navbar/>
    <h1 class="title font-bold font-titulo my-8">Cruces Telepeaje</h1>
    <div class="container mx-auto px-auto px-48 my-32 pt-10">
        <div class="flex flex-wrap justify-center">
            <ModuloGeneracionReportes
                v-for="(modulo, index) in modulos"
                :key="index"
                :nombre="modulo.nameModule"
                :img_src="modulo.image"
                :ruta="modulo.route"
                :exitSubModulo="exitSubModulo"                        
                @abrir-modal-cruces-totales="abrirmodalcrucestotales"
                @abrir-modal-cruces-ferromex="abrirmodalcrucesferromex"
            ></ModuloGeneracionReportes>
        </div> 
    </div>
    <Footer/>
    <Modal :show="showModal" @cerrarmodal="cerralmodalcrucestotales">
        <h1 class="text-4xl font-bold font-titulo text-center mt-4">Cruces Totales</h1>
            <div class="flex w-full justify-center gap-20 mt-10">
                <div class="flex flex-col gap-10">
                    <div>
                        <label for="">Dia*</label>
                    </div>
                    <div>
                        <label for="">Año/Mes*</label>
                    </div>
                    <div>
                        <label for="">Semana*</label>
                    </div>
                </div>
                <div class="flex flex-col gap-10">
                    <div>
                        <input type="date" v-model="dias" :max="hoy" class="input" :disabled="bloqueardia" :class="{'cursor-not-allowed' : bloqueardia}" @change="bloquearinputdias()">
                    </div>
                    <div>
                        <input type="month" v-model="meses" class="input" :disabled="bloquearmes" :class="{'cursor-not-allowed' : bloquearmes}" @change="bloquearinputmes()">
                    </div>
                    <div>
                        <input type="week" v-model="semana" class="input" :disabled="bloquearsemana" :class="{'cursor-not-allowed' : bloquearsemana}" @change="bloquearinputsemana()">
                    </div>
                </div>
            </div>
            <div class="flex w-full justify-center mt-10 mb-8">
                <div>
                    <button class="rounded-lg w-18 bg-ferromex text-white p-10" @click="generarreportetotalver(dias,meses,semana)">Vista previa</button>
                    <button class="rounded-lg w-18 bg-ferromex text-white p-10 ml-6" @click="generarreportetotaldescargar(dias,meses,semana)">Descargar Reporte</button>
                </div>
            </div>
            <h1 class="text-xl font-bold font-titulo text-center mt-2">* Campo Obligatorio</h1>
            <h1 class="text-xl font-bold font-titulo text-center mt-2 mb-4">Solo se puede seleccionar ya sea dia,año/mes o semana</h1>
    </Modal>
    <Modal :show="showModalTurno" @cerrarmodal="cerramodalcruceferromex">
        <h1 class="text-4xl font-bold font-titulo text-center mt-4">Cruces Intermodal</h1>
            <div class="flex w-full justify-center gap-20 mt-10">
                <div class="flex flex-col gap-11">
                    <div>
                        <label for="">Dia<b class="font-bold">*</b></label>
                    </div>
                    <div>
                        <label for="">Año/Mes*</label>
                    </div>
                    <div>
                        <label for="">Semana*</label>
                    </div>
                    <div>
                        <select v-model="tipo" class="input">
                            <option value="A">TAG</option>
                            <option value="B">No Economico</option>
                            <option value="C">No Placa</option>
                        </select>
                    </div>
                    <div>
                        <label>Tipo de Reporte*</label>
                    </div>  
                </div>
                <div class="flex flex-col gap-10">
                    <div>
                        <input type="date" class="input" :max="hoy" :disabled="bloqueardia" :class="{'cursor-not-allowed' : bloqueardia}"  v-model="diascf" @change="bloquearinputdias()">
                    </div>
                    <div>
                        <input type="month" class="input" :disabled="bloquearmes" :class="{'cursor-not-allowed' : bloquearmes}" v-model="mesescf" @change="bloquearinputmes()">
                    </div>
                    <div>
                        <input type="week" class="input"  :disabled="bloquearsemana" :class="{'cursor-not-allowed' : bloquearsemana}" v-model="semanacf" @change="bloquearinputsemana()">
                    </div>
                    <div>
                        <input id="tag" v-model.trim="tag" class="input" placeholder="Buscar" type="text" />
                    </div>
                    <div>
                        <select class="input" v-model="reportecf"  placeholder="XXXXX">
                        <option value="undefined" disabled>Seleccione una opción</option>
                        <option value="1">Descuento Detalles Amarre</option>
                        <option value="2">Descuento Amarre Resumen</option>
                        <option v-if="!check_vista_previa_button(diascf,mesescf,semanacf)" value="3">Ambos</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="flex w-full justify-center mt-10 mb-8">
                <div>
                    <button class="rounded-lg w-18 text-white p-10 bg-ferromex"  @click="generarreportecruceferromexver(diascf,mesescf,semanacf,reportecf,tipo,tag)">Vista previa</button>
                    <button class="rounded-lg w-18 bg-ferromex text-white p-10 ml-6"  @click="generarreportecruceferromexdescargar(diascf,mesescf,semanacf,reportecf,tipo,tag)">Descargar Reporte</button>
                </div>
            </div>
            <h1 class="text-xl font-bold font-titulo text-center mt-2">* Campo Obligatorio</h1>
            <h1 class="text-xl font-bold font-titulo text-center mt-2 mb-4">Solo se puede seleccionar ya sea dia,año/mes o semana</h1>
    </Modal>
    <Spinner :modalLoading="loading"/>
</template>
<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION
import { ref,reactive,toRefs,onMounted } from 'vue'
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer";
import Modal from "../../components/Modal.vue";
import ModuloGeneracionReportes from "../../components/Modulo-generacionreportes.vue";
import { file }  from '../../Servicios/Files-Service'
import { notify } from "@kyvg/vue3-notification";
import Spinner from '../../components/Spinner.vue'
import ModulesService from '@/Servicios/Modules-Service'
import TokenService from '@/Servicios/Token-Services'
import { useRoute } from 'vue-router'
import { inject } from 'vue'
import moment from 'moment';

export default {
    components: {
        Navbar,
        Footer,
        Modal,
        Spinner,
        ModuloGeneracionReportes
    },
    setup(){
        const { xml_hhtp_request,loading } = file();
        const showModal = ref(false)
        const showModalTurno = ref(false)        
        const bloqueardia = ref(false)
        const bloquearsemana = ref(false)
        const bloquearmes = ref(false)
        const hoy = ref('')
        const semana = ref('')
        const nombrearchivo = ref('')
        const crucestotales = reactive({
            dias: '',
            meses: '',
            semana: '',
            reporte:undefined
        })
        const crucesferromex = reactive({
            diascf:'',
            mesescf: '',
            semanacf:'',
            tipo:'A',
            tag:'',
            reportecf:undefined
        })

        const modulos = ref([])
        const axios = inject('axios')
        const route = useRoute()
        const decoded = TokenService.obtenerInfoUser()

        axios.get(`${API}/Ferromex/modules?roleName=${decoded.role}`) //enpoint que trae los modulos que puede ver el rol del usuario
        .then((result) => {        
            let  { subModulos } = ModulesService.GetMolduleAndSubModule(result.data.content)         
            modulos.value = subModulos.filter(x => x.parentModule == route.params.id)                
        })
        .catch((err)=>{console.log(err);})
        
        onMounted(()=>{
            hoy.value = new Date().toISOString().split("T")[0];
            let now = new Date();
            let año = now.getFullYear()
            let onejan = new Date(now.getFullYear(), 0, 1);
            let week = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
            semana.value = año + "-" + "W" + (week - 1)
        })         
        //Funcion para abrir el modal de cruces totales
        function abrirmodalcrucestotales(){
            showModal.value = !showModal.value //Cambia el valor de la variable que muestra el modal 
            bloqueardia.value = false //Cambiamos la variable a falso para desbloquear los inputs que esten bloqueados
            bloquearsemana.value = false //Cambiamos la variable a falso para desbloquear los inputs que esten bloqueados
            bloquearmes.value = false //Cambiamos la variable a falso para desbloquear los inputs que esten bloqueados
            limpiarcrucestotales() //Llamamos la funcion para limpiar los campos correspondientes
        }
        //Declaracion de cierre de modales 
        const cerralmodalcrucestotales = (modal) => {
            showModal.value = modal
            limpiarcrucestotales()
        }
        const cerramodalcruceferromex = (modal) => {
            showModalTurno.value = modal
            limpiarcrucesferromex()
        }
        //Funcion para bloquear los inputs de mes y semana en caso de ser seleccionado el de dia
        function bloquearinputdias(){
            bloquearsemana.value = true // bloqueamos los campos
            bloquearmes.value = true
        }
        //Funcion para bloquear los inputs de mes y semana en caso de ser seleccionado el de dia
        function bloquearinputsemana(){
            bloqueardia.value = true // bloqueamos los campos
            bloquearmes.value = true
        }
        //Funcion para bloquear los inputs de mes y semana en caso de ser seleccionado el de dia
        function bloquearinputmes(){
            bloquearsemana.value = true // bloqueamos los campos
            bloqueardia.value = true
        }
        //Funcion para limpiar los campos del modal cruces totales
        function limpiarcrucestotales(){
            crucestotales.dias = '' //Limpiamos el campo de dia
            crucestotales.meses= '' //Limpiamos el campo de meses
            crucestotales.semana= '' //Limpiamos el campo de semana
        }
         //Funcion para abrir el modal de cruces ferromex
        function abrirmodalcrucesferromex(){
            showModalTurno.value = !showModalTurno.value //Cambia el valor de la variable que muestra el modal 
            bloqueardia.value = false //Cambiamos la variable a falso para desbloquear los inputs que esten bloqueados
            bloquearsemana.value = false //Cambiamos la variable a falso para desbloquear los inputs que esten bloqueados
            bloquearmes.value = false //Cambiamos la variable a falso para desbloquear los inputs que esten bloqueados
            limpiarcrucesferromex() //Llamamos la funcion para limpiar los campos correspondientes
        }
         //Funcion para limpiar los campos del modal cruces ferromex
        function limpiarcrucesferromex(){
            crucesferromex.diascf = '' //Limpiamos el campo de dia
            crucesferromex.mesescf= '' //Limpiamos el campo de meses
            crucesferromex.semanacf= '' //Limpiamos el campo de semana
            crucesferromex.reportecf = undefined
            crucesferromex.tipo ='A'
            crucesferromex.tag =''

        }
        //Funcion para generar reporte cruces totales
        function  taskReporteTotalPdfDownload(fechaTest, vistaPrevia, i) {
            setTimeout(function() {
                let urlWhitSpace = " "      
                let ruta = encodeURI(`${API}/Ferromex/Download/pdf/crucestotales/reporteCruces/${fechaTest}/${urlWhitSpace}/${urlWhitSpace}`)                                   
                vistaPrevia == 1 
                    ? xml_hhtp_request(ruta,vistaPrevia)    
                    : xml_hhtp_request(ruta,vistaPrevia, fechaTest + ' CrucesTotales.pdf')     
            }, 2000 * i);
        }        
        function generarreportetotalver(dia,mes,semana){                         
            if(dia == "" && mes == "" && semana == ""){
                notify({
                    title:'Sin parametros',
                    text:'Para generar un reporte se necesita seleccionar un parametro',
                    type: 'error'
                });
            }
            if(dia != ''){                                                  
                taskReporteTotalPdfDownload(dia, 1, 0)   
            }
            if(mes != ''){                                
                let diasMes = moment(mes, "YYYY-MM").daysInMonth()                                                            
                for(let i = 0;  i < diasMes; i++){                                                           
                    taskReporteTotalPdfDownload(moment(mes, 'YYYY-MM').add(i, 'days').format('YYYY-MM-DD'), 1, i)
                }  
            }
            if(semana != ''){                                               
                for(let i = 0;  i <= 6; i++){   
                    let diaSemanaInicio = moment(semana.split('-')[0]).add(semana.split('W')[1], 'weeks').startOf('isoweek')                                                                                      
                    taskReporteTotalPdfDownload(diaSemanaInicio.add(i, 'days').format('YYYY-MM-DD'), 1, i)              
                }                
            }       
        }        
        function generarreportetotaldescargar(dia,mes,semana){   
                    
            if(dia == " " && mes == " " && semana == " "){
                notify({
                    title:'Sin parametros',
                    text:'Para generar un reporte se necesita seleccionar un parametro',
                    type: 'error'
                });
            }

            if(dia != ''){                                
                taskReporteTotalPdfDownload(dia, 2, 0)                        
            }
            if(mes != ''){                                
                let diasMes = moment(mes, "YYYY-MM").daysInMonth()                                                            
                for(let i = 0;  i < diasMes; i++){                                                                                      
                    taskReporteTotalPdfDownload(moment(mes, "YYYY-MM").add(i, 'days').format('YYYY-MM-DD'), 2, i)
                }  
            }
            if(semana != ''){                

                for(let i = 0;  i <= 6; i++){   
                    let diaSemanaInicio = moment(semana.split('-')[0]).add(semana.split('W')[1], 'weeks').startOf('isoweek')                                                                        
                    taskReporteTotalPdfDownload(diaSemanaInicio.add(i, 'days').format('YYYY-MM-DD'), 2, i)              
                }   
            }    
        }
        function taskCrucesTotalesPdfDownload(dia, tag, tipoReporte, tipoABC, vistaPrevia, i){
            setTimeout(() => {
                let selectTipoPdf = function(){  
                    if(tag != ""){              
                        if(tipoABC == 'A'){
                            return { tagRuta: tag, numeroplaca: " ", numeroeconomico: " " }
                        }
                        else if(tipoABC == 'B'){
                            return { tagRuta: " ", numeroplaca: " ", numeroeconomico: tag }               
                        }
                        else if(tipoABC == 'C'){
                            return { tagRuta: " ", numeroplaca: tag, numeroeconomico: " " }
                        }
                    }
                    return { tagRuta: " ", numeroplaca: " ", numeroeconomico: " " }
                }

                let urlWhitSpace = " "               
                let { tagRuta, numeroplaca, numeroeconomico } = selectTipoPdf()                     
                let rutadescuentolletalle = encodeURI(`${API}/Ferromex/Download/pdf/crucesferromex/descuentodetallesamarre/${dia}/${urlWhitSpace}/${urlWhitSpace}/${tagRuta}/${numeroplaca}/${numeroeconomico}`)
                let rutadescuentoamerreresumen = encodeURI(`${API}/Ferromex/Download/pdf/crucesferromex/descuentoamarreresumen/${dia}/${urlWhitSpace}/${urlWhitSpace}/${tagRuta}/${numeroplaca}/${numeroeconomico}`)
                if(tipoReporte == "1"){
                    vistaPrevia == 1 
                        ? xml_hhtp_request(rutadescuentolletalle,vistaPrevia)
                        : xml_hhtp_request(rutadescuentolletalle,vistaPrevia, 'descuentodetallesamarre' + dia + '.pdf')
                }
                else if( tipoReporte == "2"){                
                    vistaPrevia == 1 
                        ? xml_hhtp_request(rutadescuentoamerreresumen,vistaPrevia)
                        : xml_hhtp_request(rutadescuentoamerreresumen,vistaPrevia, 'descuentoamarreresumen' + dia + '.pdf')
                }
                else if(tipoReporte == "3"){
                    
                    vistaPrevia == 1 
                        ? xml_hhtp_request(rutadescuentoamerreresumen,vistaPrevia)
                        : xml_hhtp_request(rutadescuentoamerreresumen,vistaPrevia, 'descuentodetallesamarre' + dia + '.pdf')

                    vistaPrevia == 1 
                        ? xml_hhtp_request(rutadescuentolletalle,vistaPrevia)
                        : xml_hhtp_request(rutadescuentolletalle,vistaPrevia, 'descuentoamarreresumen' + dia + '.pdf')                                        
                }
            }, 2000 * i);    
        }
        function generarreportecruceferromexver(dia,mes,semana,reporte,tipoABC,tag){

            if(dia == "" && mes == "" && semana == "" && tag == "" || reporte == undefined){
                notify({
                    title:'Sin parametros',
                    text:'Para generar un reporte se necesita seleccionar un parametro' ,
                    type: 'error'
                });
            }

            if(dia != ''){                                                                    
                taskCrucesTotalesPdfDownload(dia, tag, reporte, tipoABC, 1, 0)                                
            }
            if(mes != ''){
            let diasMes = moment(mes, "YYYY-MM").daysInMonth()                                                            
                for(let i = 0;  i < diasMes; i++){                                                                                    
                    taskCrucesTotalesPdfDownload(moment(mes, "YYYY-MM").add(i, 'days').format('YYYY-MM-DD'), tag, reporte, tipoABC, 1, i)    
                }                    
            }
            if(semana != ''){
                let diaSemanaInicio = moment(semana.split('-')[0]).add(semana.split('W')[1], 'weeks').startOf('isoweek')
                for(let i = 0;  i <= 6; i++){                                                                
                    taskCrucesTotalesPdfDownload(diaSemanaInicio.add(i, 'days').format('YYYY-MM-DD'), tag, reporte, tipoABC, 1, i)  
                }  
            }
                                  
        }
        function generarreportecruceferromexdescargar(dia,mes,semana,reporte,tipoABC,tag){

            if(dia == "" && mes == "" && semana == "" && tag == "" || reporte == undefined){
                notify({
                    title:'Sin parametros',
                    text:'Para generar un reporte se necesita seleccionar un parametro' ,
                    type: 'error'
                });
            }

            if(dia != ''){                                                                             
                taskCrucesTotalesPdfDownload(dia, tag, reporte, tipoABC, 2, 0)                                
            }
            if(mes != ''){
                let diasMes = moment(mes, "YYYY-MM").daysInMonth()                                                            
                for(let i = 0;  i < diasMes; i++){                                                     
                    taskCrucesTotalesPdfDownload(moment(mes, "YYYY-MM").add(i, 'days').format('YYYY-MM-DD'), tag, reporte, tipoABC, 2, i)    
                }                     
            }
            if(semana != ''){
                let diaSemanaInicio = moment(semana.split('-')[0]).add(semana.split('W')[1], 'weeks').startOf('isoweek')
                for(let i = 0;  i <= 6; i++){                                                                        
                    taskCrucesTotalesPdfDownload(diaSemanaInicio.add(i, 'days').format('YYYY-MM-DD'), tag, reporte, tipoABC, 2, i)  
                }  
            }            
        }
        function check_vista_previa_button(dia,mes,semana){
            //diascf,mesescf,semanacf
            if(dia != "") return false
            if(mes != "") return true
            if(semana != "") return true

        }

        //Declaracion de las variables para usar en la pantalla
        return {
            modulos,
            showModal,
            loading,
            showModalTurno,
            hoy,
            semana,
            check_vista_previa_button,
            bloquearinputdias,
            bloquearinputsemana,
            bloquearinputmes,
            bloqueardia,
            bloquearsemana,// bloqueamos los campos
            bloquearmes,
            nombrearchivo,
            abrirmodalcrucestotales,
            abrirmodalcrucesferromex,
            limpiarcrucestotales,
            limpiarcrucesferromex,
            generarreportetotalver,
            generarreportetotaldescargar,
            generarreportecruceferromexver,
            generarreportecruceferromexdescargar,
            cerralmodalcrucestotales,
            cerramodalcruceferromex,
            ...toRefs(crucestotales),
            ...toRefs(crucesferromex)
        }
    }
}
</script>
<style scoped>
.title {
    text-align: center;
    font-size: 55px;
    padding-top: 20px;
}
@media (max-width: 750px) {
    .title {
        font-size: 20px;
        padding-bottom: 20px;
    }
}
</style>
<style scoped>
.img {
    display: block;
    margin: auto;
    width: 200px;
    height: 200px;
    background-color: transparent;
}
.bg-ferromex {
    background-color: #BB2028;
    padding: 10px 5px;
}

.bg-ferromex-disable {
    background-color: grey;
    padding: 10px 5px;
}
</style>