<template>
    <Navbar/>
    <h1 class="title font-bold font-titulo 2xl:my-36">Generación de Reportes</h1>
    <div class="container mx-auto px-auto px-48 pt-10 2xl:-my-20">
        <div class="flex flex-wrap ">
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
                            <h1>Concentrados Ferromex</h1>
                        </div>
                    </div>
            </button>
        </div>
    </div>
    <Footer/>
    <Modal :show="showModal" @cerrarmodal="cerramodalconcentradoferromex">
        <h1 class="text-4xl font-bold font-titulo text-center mt-4">Concentrado Ferromex</h1>
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
                        <input type="month" class="input" v-model="concentradoferromex.mesescfe" :disabled="bloquear" :class="{'cursor-not-allowed' : bloquear}">
                    </div>
                    <div>
                        <input type="week" class="input" v-model="concentradoferromex.semanacfe" :disabled="bloquear" :class="{'cursor-not-allowed' : bloquear}">
                    </div>
                    
                </div>
            </div>
            <div class="flex w-full justify-center mt-10 mb-8">
                <button class="border w-40 bg-ferromex text-white ferromex-color">Generar Reporte</button>
            </div>
    </Modal>
</template>
<script>
import Servicio from '../../Servicios/Token-Services';
//import jwt_decode from "jwt-decode";
import { ref,reactive } from 'vue'
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer";
import Modal from "../../components/Modal.vue"

import ModuloGeneracionReportes from "../../components/Modulo-generacionreportes";
export default {
    components: {
        Navbar,
        Footer,
        ModuloGeneracionReportes,
        Modal
    },
    setup() {
        const modulos = ref([])
        const carriles = ref(true)
        const showModal = ref(false)
        const bloquear = ref(false)
        const concentradoferromex = reactive({
            diascfe: '',
            mesescfe: '',
            semanacfe: ''
        })
        function abrirmodalconcentradoferromex(){
            showModal.value = !showModal.value //Cambia el valor de la variable que muestra el modal 
            bloquear.value = false //Cambiamos la variable a falso para desbloquear los inputs que esten bloqueados
            limpiarconcentradoferromex() //Llamamos la funcion para limpiar los campos correspondientes
        }
        //Declaracion de cierre de modales 
        const cerramodalconcentradoferromex = (modal) => {
            console.log(modal)
            showModal.value = modal
            limpiarconcentradoferromex()
        }
        //Funcion para limpiar los campos del modal cruces totales
        function limpiarconcentradoferromex(){
            concentradoferromex.diascfe = ''
            concentradoferromex.mesescfe = ''
            concentradoferromex.semanacfe = ''
        }
        //Funcion para bloquear los inputs de mes y semana en caso de ser seleccionado el de dia
        function bloquearinputs(){
            bloquear.value = true // bloqueamos los campos
        }
        //if(Servicio.getCookie("Token")){
        if(Servicio.obtenerToken()){
            //let info = jwt_decode(Servicio.getCookie("Token"))
            let info = Servicio.obtenerInfoUser()
            carriles.value = info['Monitoreo Carriles']
        }
        if(carriles.value == 'false'){
            modulos.value = [
                {
                    img_src: "Menu/bitacoras.png",
                    nombre: "Reportes Operativos",
                    ruta: "/inicio/bitacora-antifraude",
                    color: "red"
                },
                {
                    img_src: "Menu/bitacoras.png",
                    nombre: "Cruces Ferromex",
                    ruta: "/inicio/monitoreo-servicios",
                    color: "red"
                },
                {
                    img_src: "Menu/bitacoras.png",
                    nombre: "Bitácora De Accesos",
                    ruta: "/inicio/bitacora-accesos",
                    color: "red"
                },
            ]
        }else{
            modulos.value = [
                /* {
                    img_src: "Menu/bitacoras.png",
                    nombre: "Bitácora De Alarmas",
                    ruta: "/inicio/monitoreo-carriles/bitacora-alarmas",
                    color: "green"
                }, */
                {
                    img_src: "Menu/capacidad-de-almacenamiento.png",
                    nombre: "Reportes Operativos",
                    ruta: "/inicio/Reportes-Operativos",
                    color: "red"
                },
                {
                    img_src: "Menu/monitoreo-servicios.png",
                    nombre: "Cruces Ferromex",
                    ruta: "/inicio/Cruces",
                    color: "red"
                }
            ]    
        }

        return {
            modulos,
            carriles, 
            showModal,
            bloquear,
            cerramodalconcentradoferromex,
            limpiarconcentradoferromex,
            bloquearinputs,
            abrirmodalconcentradoferromex,
            concentradoferromex
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
