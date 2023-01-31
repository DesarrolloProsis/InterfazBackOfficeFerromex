<template>
  <Navbar/>
  <h1 class="title font-bold font-titulo">Gestión de Usuarios</h1>
    
<div class="container mx-auto p-10">
    <div class="flex mt-28">
      <ModuloConfiguracion      
        v-for="(modulo, index) in modulos"
        :key="index"
        :nombre="modulo.nameModule"
        :img_src="modulo.image"
        :ruta="modulo.route"
        :exitSubModulo="exitSubModulo"
      ></ModuloConfiguracion>
    </div>
  </div>
  <Footer/>
</template>
<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer";
import { ref, inject } from 'vue'
import ModuloConfiguracion from "../../components/Modulo-configuracion";
import ModulesService from '@/Servicios/Modules-Service'
import TokenService from '@/Servicios/Token-Services'
import { useRoute } from 'vue-router'
export default {
  components: {
    Navbar,
    Footer,
    ModuloConfiguracion,
  },
  setup() {
         
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
