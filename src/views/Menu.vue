<template>
  <Navbar></Navbar>
  <div class="">
    <div class="mt-6 grid grid-cols-2 gap-4 place-items-center 2xl:mt-24 2xl:gap-10">
    <ModulosComp
      v-for="(modulo, index) in modulos"
      :key="index"
      :titulo="modulo.titulo"
      :imagen="modulo.imagen"
      :ruta="modulo.ruta"
      :nombre="modulo.nombre"
      :isInactive="modulo.isInactive"
    ></ModulosComp>
  </div>
  </div>
  
  <Footer></Footer>
</template>

<script>
import Navbar from "../components/Navbar";
import ModulosComp from "../components/Moldulo-menu";
import Footer from "../components/Footer";
export default {
  components: {
    Navbar,
    ModulosComp,
    Footer,
  },
  data() {
    return {
      modulos: [
        {
          titulo: "Registro de información de Telepeaje",
          imagen: "Menu/registro-informacion.png",
          ruta: "/inicio/registro-informacion-telepeaje",
          nombre:"Registro De Informacion De Telepeaje",
        },
        {
          titulo: "Mantenimiento de Tag`s",
          imagen: "Menu/mantenimiento-tag.png",
          ruta: "/inicio/mantenimiento-tag",
          nombre:"Mantenimiento de Tag`s",
        },
        {
          titulo: "Gestión de usuarios",
          imagen: "Menu/gestion-usuarios.png",
          ruta: "/gestion-usuarios",
          nombre:"Gestión de usuarios",
        },
        {
          titulo: "Generación de Reportes",
          imagen: "Menu/generacion-reportes.png",
          ruta: "/generacion-reportes",
          nombre:"Generación de Reportes",
        },
      ],
    };
  },
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