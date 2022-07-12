<template>
  <Navbar/>
  <h1 class="title font-bold font-titulo">Gestión de Usuarios</h1>
  <div class="container mx-auto px-auto pb-20 pt-0 md:px-48 md:pt-1 md:my-32 ">
    <div class="flex flex-wrap">
      <ModuloConfiguracion
        v-for="(modulo, index) in modulos"
        :key="index"
        :nombre="modulo.nombre"
        :img_src="modulo.img_src"
        :ruta="modulo.ruta"
      ></ModuloConfiguracion>
    </div>
  </div>
  <Footer/>
</template>
<script>
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer";
import { ref } from 'vue'
import ModuloConfiguracion from "../../components/Modulo-configuracion";
export default {
  components: {
    Navbar,
    Footer,
    ModuloConfiguracion,
  },
  setup() {
    const modulos = ref([ //Modulos de los perfiles
        {
          img_src: "Configuracion/lista-roles.png",
          nombre: "Perfiles de Usuario",
          ruta: "/gestion-usuarios/administracion-perfiles",
        },
        {
          img_src: "Configuracion/lista-usuarios.png",
          nombre: "Lista de Usuarios",
          ruta: "/gestion-usuarios/lista-usuarios",
        },
      ])
    
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
