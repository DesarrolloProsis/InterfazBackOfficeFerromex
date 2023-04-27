<template>
    <footer class="fixed inset-x-0 bottom-0">        
        <div class="w-full h-10 px-1 ferromex-color">                
            <div class="inline-flex justify-around py-3 w-full" >
                <p class="text-white text-xs 2xl:text-sm 4k:text-2xl">{{ rol }}</p>
                <p class="text-white text-xs hidden md:contents 2xl:text-sm 4k:text-2xl">
                    BOSQUE DE CIRUELOS NO. 99. COL. BOSQUES DE LAS LOMAS, MÉXICO D.F.,C.P 117000
                </p>
                <p class="text-white text-xs 2xl:text-sm 4k:text-2xl">V1.4.2</p>
            </div>                                
        </div>        
    </footer>
</template>
<script>
import Servicio from '../Servicios/Token-Services';//Se importa el servicio que nos permite tener la información del token
import { onMounted,ref } from 'vue'//se importa onMounted para que haga una devolución de una llamada que se hará al montar el componente
export default{
    setup(){
        const rol = ref('')//Constante que alamacena el nombre de usuario
        function obtenerInfo() {//Función que obtine los datos del usuario
            let info = Servicio.obtenerInfoUser()//Literal que almacena la información del token
            rol.value = info.role  //asignamos el nombre del usuario en la constante para mostarlo
        }
        onMounted(obtenerInfo) //Montamos la función obtenerInfo para poder tener la respuesta cuando se monta el componente
    
        return { rol, obtenerInfo }
    }
}
</script>