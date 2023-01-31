<template>
    <Navbar/>
    <h1 class="title font-bold font-titulo">Reportes Operativos</h1>
    <div class="container mx-auto px-auto px-48 pt-10 my-32">
        <div class="flex flex-wrap">
            <router-link to="/inicio/ReportesCajero" class="p-7 -mt-12 w-1/2">
                    <div class="rounded-lg  animacion flex flex-col bg-ferromex border-2 border-gray-900" >
                        <div class="text-center">
                            <fa icon="dollar-sign" class="text-white h-32 p-2"/>
                        </div>
                        <div class="text-center py-5 font-titulo font-bold text-white">
                            <h1>Cajero</h1>
                        </div>
                    </div>
            </router-link>
            <router-link to="/inicio/ReportesTurno" class="p-7 -mt-12 w-1/2">
                    <div class="rounded-lg  animacion flex flex-col bg-ferromex border-2 border-gray-900" >
                        <div class="text-center">
                            <fa icon="calendar-check" class="text-white h-32 p-2"/>
                        </div>
                        <div class="text-center py-5 font-titulo font-bold text-white ">
                            <h1>Turno</h1>
                        </div>
                    </div>
            </router-link>
        </div>
    </div>
    <Footer/>
</template>
<script>
//import Servicio from '../../Servicios/Token-Services';
//import jwt_decode from "jwt-decode";
import { ref } from 'vue'
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer";


export default {
    components: {
        Navbar,
        Footer,
    },
    setup(){
       
        const modulos = ref([])

        
        // //if(Servicio.getCookie("Token")){
        // if(Servicio.obtenerToken()){
        //     //let info = jwt_decode(Servicio.getCookie("Token"))
        //     let info = Servicio.obtenerInfoUser()
        //     carriles.value = info['Monitoreo Carriles']
        // }
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
        return {modulos}
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