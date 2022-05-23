<template>
    <Navbar/>
    <h1 class="title font-bold font-titulo">Reportes Operativos</h1>
    <div class="container mx-auto px-auto pt-0 md:px-48 md:pt-10 ">
        <div class="flex flex-wrap">
            <div class="w-full p-7 -mt-12 md:w-1/3" :class="{'ml-20': mostrar == 'false'}">
                    <div class="rounded-lg  animacion flex flex-col bg-ferromex border-2 border-gray-900" >
                        <div class="text-center">
                            <fa icon="calendar-day" class="text-white h-32"/>
                        </div>
                        <div class="text-center py-5 font-titulo font-bold text-white">
                            <h1>Transacciones Detalle Dia</h1>
                        </div>
                    </div>
            </div>
            <div class="w-full p-7 -mt-12 md:w-1/3" :class="{'ml-20': mostrar == 'false'}">
                    <div class="rounded-lg  animacion flex flex-col bg-ferromex border-2 border-gray-900" >
                        <div class="text-center">
                            <fa icon="calendar-week" class="text-white h-32"/>
                        </div>
                        <div class="text-center py-5 font-titulo font-bold text-white ">
                            <h1>Transacciones Detalle Semana</h1>
                        </div>
                    </div>
            </div>
            <div class="w-full p-7 -mt-12 md:w-1/3" :class="{'ml-20': mostrar == 'false'}">
                    <div class="rounded-lg  animacion flex flex-col bg-ferromex border-2 border-gray-900" >
                        <div class="text-center">
                            <fa icon="calendar-days" class="text-white h-32"/>
                        </div>
                        <div class="text-center py-5 font-titulo font-bold text-white">
                            <h1>Transacciones Detalle Mes</h1>
                        </div>
                    </div>
            </div>
        </div>
    </div>
    <Footer/>
</template>
<script>
import Servicio from '../../Servicios/Token-Services';
//import jwt_decode from "jwt-decode";
import { ref } from 'vue'
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer";

export default {
    components: {
        Navbar,
        Footer,
    },
    setup() {
        const modulos = ref([])
        const carriles = ref(true)
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
                    nombre: "Transacciones Detalle Dia",
                    ruta: "/inicio/bitacora-antifraude",
                    color: "red"
                },
                {
                    img_src: "Menu/bitacoras.png",
                    nombre: "Transacciones Detalle Semana",
                    ruta: "/inicio/monitoreo-servicios",
                    color: "red"
                },
                {
                    img_src: "Menu/bitacoras.png",
                    nombre: "Transacciones Detalle Mes",
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
                    nombre: "Transacciones Detalle Dia",
                    ruta: "/inicio/bitacora-antifraude",
                    color: "red"
                },
                {
                    img_src: "Menu/monitoreo-servicios.png",
                    nombre: "Transacciones Detalle Semana",
                    ruta: "/inicio/bitacora-listas",
                    color: "red"
                },
                {
                    img_src: "Menu/almacenamiento-de-base-de-datos.png",
                    nombre: "Transacciones Detalle Mes",
                    ruta: "/inicio/bitacora-accesos",
                    color: "red"
                }
            ]    
        }

        return {modulos, carriles}
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