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
        <!-- <div class="flex flex-wrap">
            <button class=" p-7 -mt-12 w-1/2" @click="abrirmodalcrucestotales()">
                    <div class="rounded-lg  animacion flex flex-col bg-ferromex border-2 border-gray-900" >
                        <div class="text-center">
                            <fa icon="calendar-check" class="text-white h-32 p-2"/>
                        </div>
                        <div class="text-center py-5 font-titulo font-bold text-white">
                            <h1>Cruces Totales</h1>
                        </div>
                    </div>
            </button>
            <button class="p-7 -mt-12 w-1/2" @click="abrirmodalcrucesferromex()">
                    <div class="rounded-lg  animacion flex flex-col bg-ferromex border-2 border-gray-900" >
                        <div class="text-center">
                            <fa icon="calendar-day" class="text-white h-32 p-2"/>
                        </div>
                        <div class="text-center py-5 font-titulo font-bold text-white ">
                            <h1>Cruces Intermodal</h1>
                        </div>
                    </div>
            </button>
        </div> -->
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
                        <option value="3">Ambos</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="flex w-full justify-center mt-10 mb-8">
                <div>
                    <button class="rounded-lg w-18 bg-ferromex text-white p-10"  @click="generarreportecruceferromexver(diascf,mesescf,semanacf,reportecf,tipo,tag)">Vista previa</button>
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
//import Servicio from '../../Servicios/Token-Services';
//import jwt_decode from "jwt-decode";
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
          let  { subModulos } = ModulesService.test(result.data.content)      
          console.log(subModulos)      
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
        function generarreportetotalver(dias,meses,semana){
            let urldias = ""
            let urlmeses = ""
            let urlsemana = ""
            if(dias == ''){
            urldias = " "
            }else if(dias != ''){
                urldias = dias
            }
            if(meses == ''){
                urlmeses = " "
            }else if(meses != ''){
                urlmeses = meses
            }
            if(semana == ''){
                urlsemana = " "
            }else if(semana != ''){
                urlsemana = semana
            }
            if(urldias == " " && urlmeses == " " && urlsemana == " "){
                notify({
                    title:'Sin parametros',
                    text:'Para generar un reporte se necesita seleccionar un parametro',
                    type: 'error'
                });
            }else{
                const ruta = encodeURI(`${API}/Ferromex/Download/pdf/crucestotales/reporteCruces/${urldias}/${urlmeses}/${urlsemana}`)
                xml_hhtp_request(ruta,1)
            }
        }
        function generarreportetotaldescargar(dias,meses,semana){
            let urldias = ""
            let urlmeses = ""
            let urlsemana = ""
            nombrearchivo.value = ""
            if(dias == ''){
                urldias = " "
            }else if(dias != ''){
                urldias = dias
                nombrearchivo.value = dias + ' CrucesTotales.pdf'
            }
            if(meses == ''){
                urlmeses = " "
            }else if(meses != ''){
                urlmeses = meses
                nombrearchivo.value = meses + ' CrucesTotales.pdf'
            }
            if(semana == ''){
                urlsemana = " "
            }else if(semana != ''){
                urlsemana = semana
                nombrearchivo.value = semana + ' CrucesTotales.pdf'
            }
            if(urldias == " " && urlmeses == " " && urlsemana == " "){
                notify({
                    title:'Sin parametros',
                    text:'Para generar un reporte se necesita seleccionar un parametro',
                    type: 'error'
                });
            }else{
                const ruta = encodeURI(`${API}/Ferromex/Download/pdf/crucestotales/reporteCruces/${urldias}/${urlmeses}/${urlsemana}`)
                xml_hhtp_request(ruta,2,nombrearchivo.value)
            }
        }
        function generarreportecruceferromexver(dias,meses,semana,reporte,tipo,tag){
            let urldias = ""
            let urlmeses = ""
            let urlsemana = ""
            let urltag = ""
            if(dias == ''){
                urldias = " "
            }else if(dias != ''){
                urldias = dias
            }
            if(meses == ''){
                urlmeses = " "
            }else if(meses != ''){
                urlmeses = meses
            }
            if(semana == ''){
                urlsemana = " "
            }else if(semana != ''){
                urlsemana = semana
            }
            if(tag == ''){
                urltag = ' '
            }else if(tag != ''){
                urltag = tag
            }
            if(urldias == " " && urlmeses == " " && urlsemana == " " && urltag == " " || reporte == undefined){
                notify({
                    title:'Sin parametros',
                    text:'Para generar un reporte se necesita seleccionar un parametro' ,
                    type: 'error'
                });
            }else{
            let numeroplaca = "";
            let numeroeconomico = "";
            let tagRuta = ""
            if(urltag != ' '){
                    if(tipo == 'A'){
                        tagRuta = urltag
                        numeroplaca = " "
                        numeroeconomico = " "
                    }else if(tipo == 'B'){
                        tagRuta = " "
                        numeroplaca = " "
                        numeroeconomico = urltag
                    }else if(tipo == 'C'){
                        tagRuta = " "
                        numeroplaca = urltag
                        numeroeconomico = " "
                    }
                }else if(urltag == ' '){
                    tagRuta = " "
                    numeroplaca = " "
                    numeroeconomico = " "
                }
                const rutadescuentolletalle = encodeURI(`${API}/Ferromex/Download/pdf/crucesferromex/descuentodetallesamarre/${urldias}/${urlmeses}/${urlsemana}/${tagRuta}/${numeroplaca}/${numeroeconomico}`)
                const rutadescuentoamerreresumen = encodeURI(`${API}/Ferromex/Download/pdf/crucesferromex/descuentoamarreresumen/${urldias}/${urlmeses}/${urlsemana}/${tagRuta}/${numeroplaca}/${numeroeconomico}`)
                if(reporte == "1"){
                    xml_hhtp_request(rutadescuentolletalle,1)
                }else if( reporte == "2"){
                    xml_hhtp_request(rutadescuentoamerreresumen,1)
                }else if( reporte == "3"){
                    xml_hhtp_request(rutadescuentolletalle,1)
                    xml_hhtp_request(rutadescuentoamerreresumen,1)
                }
                //cerramodalcruceferromex(false)
            }
        }
        function generarreportecruceferromexdescargar(dias,meses,semana,reporte,tipo,tag){
            let urldias = ""
            let urlmeses = ""
            let urlsemana = ""
            let urltag = ""
            if(dias == ''){
                urldias = " "
            }else if(dias != ''){
                urldias = dias
                nombrearchivo.value = dias + ' CrucesIntermodal.pdf'
            }
            if(meses == ''){
                urlmeses = " "
            }else if(meses != ''){
                urlmeses = meses
                nombrearchivo.value = meses + ' CrucesIntermodal.pdf'
            }
            if(semana == ''){
                urlsemana = " "
            }else if(semana != ''){
                urlsemana = semana
                nombrearchivo.value = semana + ' CrucesIntermodal.pdf'
            }
            if(tag == ''){
                urltag = ' '
            }else if(tag != ''){
                urltag = tag
            }
            if(urldias == " " && urlmeses == " " && urlsemana == " "){
                notify({
                    title:'Sin parametros',
                    text:'Para generar un reporte se necesita seleccionar un parametro' ,
                    type: 'error'
                });
            }else{
            let numeroplaca = "";
            let numeroeconomico = "";
            let tagRuta = ""
                if(urltag != ' '){
                    if(tipo == 'A'){
                        tagRuta = urltag
                        numeroplaca = " "
                        numeroeconomico = " "
                    }else if(tipo == 'B'){
                        tagRuta = " "
                        numeroplaca = " "
                        numeroeconomico = urltag
                    }else if(tipo == 'C'){
                        tagRuta = " "
                        numeroplaca = urltag
                        numeroeconomico = " "
                    }
                }else{
                    tagRuta = " "
                    numeroplaca = " "
                    numeroeconomico = " "
                }
            const rutadescuentolletalle = encodeURI(`${API}/Ferromex/Download/pdf/crucesferromex/descuentodetallesamarre/${urldias}/${urlmeses}/${urlsemana}/${tagRuta}/${numeroplaca}/${numeroeconomico}`)
            const rutadescuentoamerreresumen = encodeURI(`${API}/Ferromex/Download/pdf/crucesferromex/descuentoamarreresumen/${urldias}/${urlmeses}/${urlsemana}/${tagRuta}/${numeroplaca}/${numeroeconomico}`)
                if(reporte == "1"){
                    xml_hhtp_request(rutadescuentolletalle,2,'descuentodetalle' + hoy.value + '.pdf')
                }else if( reporte == "2"){
                    xml_hhtp_request(rutadescuentoamerreresumen,2,'descuentoamarreresumen' + hoy.value + '.pdf')
                }else if( reporte == "3"){
                    xml_hhtp_request(rutadescuentolletalle,2,'descuentodetalle' + hoy.value + '.pdf')
                    xml_hhtp_request(rutadescuentoamerreresumen,2,'descuentoamarreresumen' + hoy.value + '.pdf')
                }
                //cerramodalcruceferromex(false)
            }
        }

        //Declaracion de las variables para usar en la pantalla
        return {
        modulos,
        showModal,
        loading,
        showModalTurno,
        hoy,
        semana,
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
</style>