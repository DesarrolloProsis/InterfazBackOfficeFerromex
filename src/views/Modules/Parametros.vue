<template>
  <Navbar/>
  <div class="justify-content-center">
    <h1 class="title font-bold font-titulo my-8">Parámetros</h1>
    <div class="container mx-auto px-auto px-48 pt-10 my-32">
        <div class="flex flex-wrap">
            <ModulosComp
            v-for="(modulo, index) in modules"
            :key="index"
            :imagen="modulo.image"
            :ruta="modulo.route"
            :nombre="modulo.nameModule"
            :exitSubModulo="exitSubModulo"
            ></ModulosComp>
        </div>
    </div>
  </div>
  
  <Footer></Footer>
</template>

<script>
const API = process.env.VUE_APP_URL_API_PRODUCCION //constante que hace referencia a la ip donde está montada el API, se utiliza para hacer peticiones
import Navbar from "../../components/Navbar.vue"; //Importamos el componnete Navbar para mostrar en la vista
import ModulosComp from "../../components/Moldulo-menu.vue"; //Importamos el componente de Menú para poder poner cada uno de los modulos que tiene el rol
import Footer from "../../components/Footer.vue";//Importamos el footer para mostrar en la vista
import Servicio from '@/Servicios/Token-Services'; //Importamos el Servicio de Toke, para obtener información del usuario con base en el token
import { ref, inject } from 'vue' //Importamos onMounted para recibir una respuesta de una llamada cuando se monta el modulo, y ref para hacer referencia al tipo de dato que estamos utilizando y volvemos reactiva la constante
import ModulesService from '@/Servicios/Modules-Service'
import { useRoute } from 'vue-router'
export default {
  components: {
    Navbar,
    ModulosComp,
    Footer
  },
  setup(){      
    const axios = inject('axios')
    const decoded = Servicio.obtenerInfoUser() //variable que obtiene la información del usuario
    const route = useRoute()
    const modules = ref([]) //Constante que va a almacenar el array de modulos que se van a mostrar
    axios.get(`${API}/Ferromex/modules?roleName=${decoded.role}`) //enpoint que trae los modulos que puede ver el rol del usuario
    .then((result) => {        
      let  { subModulos } = ModulesService.GetMolduleAndSubModule(result.data.content)  
      modules.value = subModulos.filter(x => x.parentModule == route.params.id)      
    })
    .catch((err)=>{console.log(err);})

    
    return {modules}
  }
};
</script>
<style scoped>
.full-height {
  height: calc(100vh - 85px);
  min-height: 700px;
  margin-bottom: 10px;
}
@media (max-width: 765px) {
  .full-height {
    height: 100%;
    margin-bottom: 80px;
  }
}
</style>
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