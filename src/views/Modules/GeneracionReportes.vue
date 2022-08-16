<template>
    <Navbar/>
    <h1 class="title font-bold font-titulo">Reportes Intermodal</h1>
    <div class="container mx-auto px-auto px-48 pt-10 my-32">
        <div class="flex flex-wrap ">
            <button class="p-7 -mt-12 w-1/3" @click="abrirmodaloperativos()">
                    <div class="rounded-lg  animacion flex flex-col bg-ferromex border-2 border-gray-900" >
                    <div>
                            <img class="img" src="@/assets/Menu/capacidad-de-almacenamiento.png" />
                        </div>
                        <div class="text-center py-5 font-titulo font-bold text-white ">
                            <h1>Operativos</h1>
                        </div>
                    </div>
            </button>
            <ModuloGeneracionReportes
                v-for="(modulo, index) in modulos"
                :key="index"
                :nombre="modulo.nombre"
                :img_src="modulo.img_src"
                :ruta="modulo.ruta"
                :mostrar="carriles"
                :color="modulo.color"
            ></ModuloGeneracionReportes>
            <button class="p-7 -mt-12 w-1/3" @click="abrirmodalconcentradoferromex">
                    <div class="rounded-lg  animacion flex flex-col bg-ferromex border-2 border-gray-900" >
                    <div>
                            <img class="img" src="@/assets/Menu/almacenamiento-de-base-de-datos.png" />
                        </div>
                        <div class="text-center py-5 font-titulo font-bold text-white ">
                            <h1>Auditoria Intermodal</h1>
                        </div>
                    </div>
            </button>
        </div>
    </div>
    <Footer/>
    <Modal :show="showModal" @cerrarmodal="cerramodalconcentradoferromex">
        <h1 class="text-4xl font-bold font-titulo text-center mt-4">Auditoria Intermodal</h1>
            <div class="flex w-full justify-center gap-20 mt-10">
                <div class="flex flex-col gap-10">
                    <div>
                        <label for="">Dia</label>
                    </div>
                    <div>
                        <label for="">Año/Mes</label>
                    </div>
                    <div>
                        <label for="">Semana</label>
                    </div>
                </div>
                <div class="flex flex-col gap-10">
                    <div>
                        <input type="date" class="input" v-model="concentradoferromex.diascfe" @change="bloquearinputs()">
                    </div>
                    <div>
                        <input type="month" class="input" v-model="concentradoferromex.mesescfe" :disabled="bloquear" :class="{'cursor-not-allowed' : bloquear}" @change="bloquearinputs()">
                    </div>
                    <div>
                        <input type="week" class="input" v-model="concentradoferromex.semanacfe" :disabled="bloquear" :class="{'cursor-not-allowed' : bloquear}" @change="bloquearinputs()">
                    </div>
                    
                </div>
            </div>
            <div class="flex flex-col w-full items-center justify-center mt-10 mb-8">
                <div>
                    <button class="border w-40 bg-ferromex text-white ferromex-color" :class="{'cursor-not-allowed' : bloquearbutton}" @click="concentradoFerromexver(concentradoferromex.diascfe,concentradoferromex.mesescfe,concentradoferromex.semanacfe)">Vista previa</button>
                    <button class="border w-40 bg-ferromex text-white ferromex-color" :class="{'cursor-not-allowed' : bloquearbutton}" @click="concentradoFerromexdescargar(concentradoferromex.diascfe,concentradoferromex.mesescfe,concentradoferromex.semanacfe)">Descargar Reporte</button>
                </div>
            </div>
    </Modal>
    <Modal :show="showModalReporteDia" @cerrarmodal="cerramodaloperativos">
        <h1 class="text-4xl font-bold font-titulo text-center mt-4">Reporte Dia</h1>
            <div class="flex w-full justify-center gap-20 mt-10">
                <div class="flex flex-col gap-10">
                    <div>
                        <label for="">Plaza de Cobro</label>
                    </div>
                    <div>
                        <label for="">Fecha*</label>
                    </div>
                    <div>
                        <label for="">ViA</label>
                    </div>
                    <div>
                        <label>Tipo de Reporte</label>
                    </div> 
                </div>
                <div class="flex flex-col gap-10">
                    <div>
                        <label for="">Manzanillo</label>
                    </div>
                    <div>
                        <input type="date" class="input" v-model="fecha">
                    </div>
                    <div>
                        <select v-model="carril" class="flex-none text-black rounded" name="select" placeholder="Selecciona">
                            <option :value="undefined">Seleccione ViA</option>
                            <option v-for="(ca ,index) in carriles" :key="index" :value="ca.id">
                            {{ ca.Carril }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <select class="input" v-model="reportecf"  placeholder="XXXXX">
                        <option value="undefined" disabled>Seleccione una opción</option>
                        <option value="1">Operativo Detalle</option>
                        <option value="2">Opertativo Concentrado</option>
                        <option value="3">Ambos</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="flex flex-col w-full items-center justify-center mt-10 mb-8">
                <div>
                    <button class="border w-40 bg-ferromex text-white ferromex-color" :class="{'cursor-not-allowed' : bloquearbutton}" @click="concentradoFerromexver(concentradoferromex.diascfe,concentradoferromex.mesescfe,concentradoferromex.semanacfe)">Vista previa</button>
                    <button class="border w-40 bg-ferromex text-white ferromex-color" :class="{'cursor-not-allowed' : bloquearbutton}" @click="concentradoFerromexdescargar(concentradoferromex.diascfe,concentradoferromex.mesescfe,concentradoferromex.semanacfe)">Descargar Reporte</button>
                </div>
            </div>
    </Modal>
</template>
<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION
import { ref,reactive,inject,onMounted,toRefs } from 'vue'
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer";
import Modal from "../../components/Modal.vue"
import ServiceFiles from '../../Servicios/Files-Service'
import { notify } from "@kyvg/vue3-notification";

import ModuloGeneracionReportes from "../../components/Modulo-generacionreportes";
export default {
    components: {
        Navbar,
        Footer,
        ModuloGeneracionReportes,
        Modal
    },
    setup() {
        const axios = inject('axios')
        const modulos = ref([
                {
                    img_src: "Menu/monitoreo-servicios.png",
                    nombre: "Cruces Telepeaje",
                    ruta: "/inicio/Cruces",
                    color: "red"
                }])
        const carriles = ref([])
        const showModal = ref(false)
        const showModalReporteDia = ref(false)
        const bloquear = ref(false)
        const bloquearbutton = ref(true)
        const nombrearchivo = ref("")
        const concentradoferromex = reactive({
            diascfe: '',
            mesescfe: '',
            semanacfe: ''
        })
        const reportedia = reactive({
            carril: undefined,
            fecha:''
        })
    onMounted( ()=> 
        carrilesExistentes()
    )
    function carrilesExistentes (){//Función que trae todos los carriles existentes
        const ruta = (encodeURI(`${API}/ferromex/carriles`))//Constante que guarda la ruta encriptada para la consulta en el API
        axios.get(ruta)//Hacemos una petición http al API con la ruta previamente encriptada
            .then((result) => {//Si el endpoint responde de manera correcta
            console.log(result);
            carriles.value = result.data //Asignamos los valores de la respuesta del endpoint para mostrarlos en el header para los filtros
        }).catch((error) => {//Si el endpoint tiene un error en la respuesta
            console.log(error.request.response);//Mostramos en consola el error
        })
    }
        function abrirmodalconcentradoferromex(){
            showModal.value = !showModal.value //Cambia el valor de la variable que muestra el modal 
            bloquear.value = false //Cambiamos la variable a falso para desbloquear los inputs que esten bloqueados
            limpiarconcentradoferromex() //Llamamos la funcion para limpiar los campos correspondientes
        }
        function abrirmodaloperativos(){
            showModalReporteDia.value = !showModalReporteDia.value //Cambia el valor de la variable que muestra el modal 
        }
        //Declaracion de cierre de modales 
        const cerramodalconcentradoferromex = (modal) => {
            console.log(modal)
            showModal.value = modal
            limpiarconcentradoferromex()
        }
        //Declaracion de cierre de modales 
        const cerramodaloperativos = (modal) => {
            console.log(modal)
            showModalReporteDia.value = modal
        }
        //Funcion para limpiar los campos del modal cruces totales
        function limpiarconcentradoferromex(){
            concentradoferromex.diascfe = ''
            concentradoferromex.mesescfe = ''
            concentradoferromex.semanacfe = ''
            bloquearbutton.value = true
        }
        //Funcion para bloquear los inputs de mes y semana en caso de ser seleccionado el de dia
        function bloquearinputs(){
            bloquear.value = true // bloqueamos los campos
            bloquearbutton.value = false
        }
        function concentradoFerromexver(dias,meses,semana){
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
                    text:'Para ver un reporte se necesita seleccionar un parametro',
                    type: 'error'
                });
            }else{
                const ruta = encodeURI(`${API}/Ferromex/Download/pdf/concentradosferromex/${urldias}/${urlmeses}/${urlsemana}`)
                console.log(ruta)
                ServiceFiles.xml_hhtp_request(ruta)
                //cerramodalconcentradoferromex(false)
            }
            }
        function concentradoFerromexdescargar(dias,meses,semana){
            let urldias = ""
            let urlmeses = ""
            let urlsemana = ""
            nombrearchivo.value = ""
            if(dias == ''){
                urldias = " "
            }else if(dias != ''){
                urldias = dias
                nombrearchivo.value = dias + ' AuditoriaIntermodal.pdf'
            }
            if(meses == ''){
                urlmeses = " "
            }else if(meses != ''){
                urlmeses = meses
                nombrearchivo.value = meses +' AuditoriaIntermodal.pdf'
            }
            if(semana == ''){
                urlsemana = " "
            }else if(semana != ''){
                urlsemana = semana
                nombrearchivo.value = semana + ' AuditoriaIntermodal.pdf'
            }
            if(urldias == " " && urlmeses == " " && urlsemana == " "){
                notify({
                    title:'Sin parametros',
                    text:'Para descargar un reporte se necesita seleccionar un parametro',
                    type: 'error'
                });
            }else{
                const ruta = encodeURI(`${API}/Ferromex/Download/pdf/concentradosferromex/${urldias}/${urlmeses}/${urlsemana}`)
                console.log(ruta)
                ServiceFiles.descargararchivo(ruta,nombrearchivo.value)
                //cerramodalconcentradoferromex(false)
            }
        }
        return {
            modulos,
            carriles, 
            showModal,
            showModalReporteDia,
            bloquear,
            cerramodalconcentradoferromex,
            cerramodaloperativos,
            limpiarconcentradoferromex,
            bloquearinputs,
            abrirmodalconcentradoferromex,
            abrirmodaloperativos,
            ...toRefs(reportedia),
            carrilesExistentes,
            concentradoFerromexdescargar,
            concentradoferromex,
            bloquearbutton,
            nombrearchivo,
            concentradoFerromexver,
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
.border {
    border: 1px solid #ffffff;
    border-radius: 150px;
    -webkit-box-shadow: 5px 5px 14px -5px rgba(0, 0, 0, 0.44);
    box-shadow: 5px 5px 14px -5px rgba(0, 0, 0, 0.44);
}
.img {
    display: block;
    margin: auto;
    width: 200px;
    height: 200px;
    background-color: transparent;
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
