<template>
    <Navbar/>
    <h1 class="title font-bold font-titulo my-8 2xl:my-24">Cruces</h1>
    <div class="container mx-auto px-auto px-48 pt-10">
        <div class="flex flex-wrap">
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
                            <h1>Cruces Ferromex</h1>
                        </div>
                    </div>
            </button>
        </div>
    </div>
    <Footer/>
    <Modal :show="showModal" @cerrarmodal="cerralmodalcrucestotales">
        <h1 class="text-4xl font-bold font-titulo text-center mt-4">Cruces Totales</h1>
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
                        <input type="date" v-model="dias" class="input" @change="bloquearinputs()">
                    </div>
                    <div>
                        <input type="month" v-model="meses" class="input" :disabled="bloquear" :class="{'cursor-not-allowed' : bloquear}">
                    </div>
                    <div>
                        <input type="week" v-model="semana" class="input" :disabled="bloquear" :class="{'cursor-not-allowed' : bloquear}">
                    </div>
                    
                </div>
            </div>
            <div class="flex w-full justify-center mt-10 mb-8">
                <button class="border w-40 bg-ferromex text-white ferromex-color" @click="generarreportetotal()">Generar Reporte</button>
            </div>
    </Modal>
    <Modal :show="showModalTurno" @cerrarmodal="cerramodalcruceferromex">
        <h1 class="text-4xl font-bold font-titulo text-center mt-4">Cruces Ferromex</h1>
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
                        <input type="date" class="input" @change="bloquearinputs()" v-model="diascf">
                    </div>
                    <div>
                        <input type="month" class="input" :disabled="bloquear" :class="{'cursor-not-allowed' : bloquear}" v-model="mesescf">
                    </div>
                    <div>
                        <input type="week" class="input" :disabled="bloquear" :class="{'cursor-not-allowed' : bloquear}" v-model="semanacf">
                    </div>
                    
                </div>
            </div>
            <div class="flex w-full justify-center mt-10 mb-8">
                <button class="border w-40 bg-ferromex text-white ferromex-color" >Generar Reporte</button>
            </div>
    </Modal>
</template>
<script>
//import Servicio from '../../Servicios/Token-Services';
//import jwt_decode from "jwt-decode";
import { ref,reactive,toRefs } from 'vue'
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer";
import Modal from "../../components/Modal.vue"

export default {
    components: {
        Navbar,
        Footer,
        Modal
    },
    setup(){
        const showModal = ref(false)
        const showModalTurno = ref(false)
        const modulos = ref([])
        const bloquear = ref(false)
        const crucestotales = reactive({
            dias: '',
            meses: '',
            semana: ''
        })
        const crucesferromex = reactive({
            diascf:'',
            mesescf: '',
            semanacf:''
        })
        //Declaracion de los modulos que se van a mostrar en pantalla
        modulos.value = [
            {
                img_src: "Menu/capacidad-de-almacenamiento.png",
                nombre: "Cajero",
                ruta: "/inicio/bitacora-antifraude",
                color: "red"
            },
            {
                img_src: "Menu/monitoreo-servicios.png",
                nombre: "Turno",
                ruta: "/inicio/bitacora-listas",
                color: "red"
            },
        ]
        //Funcion para abrir el modal de cruces totales
        function abrirmodalcrucestotales(){
            showModal.value = !showModal.value //Cambia el valor de la variable que muestra el modal 
            bloquear.value = false //Cambiamos la variable a falso para desbloquear los inputs que esten bloqueados
            limpiarcrucestotales() //Llamamos la funcion para limpiar los campos correspondientes
        }
        //Declaracion de cierre de modales 
        const cerralmodalcrucestotales = (modal) => {
            console.log(modal)
            showModal.value = modal
            limpiarcrucestotales()
        }
        const cerramodalcruceferromex = (modal) => {
            console.log(modal)
            showModalTurno.value = modal
            limpiarcrucesferromex()
        }
        //Funcion para bloquear los inputs de mes y semana en caso de ser seleccionado el de dia
        function bloquearinputs(){
            bloquear.value = true // bloqueamos los campos
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
            bloquear.value = false //Cambiamos la variable a falso para desbloquear los inputs que esten bloqueados
            limpiarcrucesferromex() //Llamamos la funcion para limpiar los campos correspondientes
        }
         //Funcion para limpiar los campos del modal cruces ferromex
        function limpiarcrucesferromex(){
            crucesferromex.diascf = '' //Limpiamos el campo de dia
            crucesferromex.mesescf= '' //Limpiamos el campo de meses
            crucesferromex.semanacf= '' //Limpiamos el campo de semana
        }
        //Funcion para generar reporte cruces totales
        function generarreportetotal(){
            if(crucestotales.dias != ''){
                console.log('Generar reporte de dia');
                console.log(crucestotales.dias);
            }else if( crucestotales.meses != ''){
                console.log('Generar reporte de meses');
                console.log(crucestotales.meses);
            }
            else if(crucestotales.semana != ''){
                console.log('generar reportes de semana');
                console.log(crucestotales.semana);
            } 
        }

        //Declaracion de las variables para usar en la pantalla
        return {
        modulos,
        showModal,
        showModalTurno,
        bloquearinputs,
        bloquear,
        abrirmodalcrucestotales,
        abrirmodalcrucesferromex,
        limpiarcrucestotales,
        limpiarcrucesferromex,
        generarreportetotal,
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