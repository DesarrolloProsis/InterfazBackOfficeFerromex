<template>
  <Navbar></Navbar>
  <div class="bg-gray-100 grid grid-cols-2 items-center full-height">
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
        /* {
          titulo: "Monitoreo de Servicios en Tiempo Real",
          imagen: "Menu/monitoreo-servicios.png",
          ruta: "/inicio/monitoreo-servicios",
          nombre:"Monitoreo Servicios",
          isInactive:false
        },
        {
          titulo: "Monitoreo de Carriles",
          imagen: "Menu/monitoreo-carriles.png",
          ruta: "/inicio/monitoreo-carriles",
          nombre:"Monitoreo Carriles",
          isInactive:false
        }, */
        {
          titulo: "Registro de información de Telepeaje",
          imagen: "Menu/monitoreo-cruces.png",
          ruta: "/inicio/registro-informacion-telepeaje",
          nombre:"Registro De Informacion De Telepeaje",
          isInactive:false
        },
        /* {
          titulo: "Envío de Transacciones al Operador de Telepeaje",
          imagen: "Menu/envio-transacciones.png",
          ruta: "/inicio/envio-transacciones",
          nombre:"Envio Transacciones",
          isInactive:false
        }, */
        {
          titulo: "Mantenimiento de Tags`s",
          imagen: "Menu/busqueda-transacciones.png",
          ruta: "/inicio/busqueda-transacciones",
          nombre:"Busqueda Cruces",
          isInactive:false
        },
        /* {
          titulo: "Bitácora de Accesos",
          imagen: "Menu/bitacora-accesos.png",
          ruta: "/inicio/bitacora-accesos",
          nombre:"Bitacora Accesos",
          isInactive:false
        }, */
        /* {
          titulo: "Estatus de TAGs",
          imagen: "Menu/estatus-tags.png",
          ruta: "/inicio/estatus-tags",
          nombre:"Estatus Tag",
          isInactive:false
        }, */
        {
          titulo: "Gestión de usuarios",
          imagen: "Menu/configuracion.png",
          ruta: "/configuracion",
          nombre:"Configuracion",
          isInactive:false
        },
        {
          titulo: "Generación de Reportes",
          imagen: "Menu/bitacoras.png",
          ruta: "/bitacoras",
          nombre:"Bitacoras",
          isInactive:false
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