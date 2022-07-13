<template>
  <Navbar/>
  <h1 class="title font-titulo ml-24 font-bold">Actividad de Usuario</h1>
  <!-- Header Rol  -->
  <div class="container mx-auto px-0 pb-2 pt-4">    
    <div class="flex flex-wrap ferromex-color p-1 rounded-lg">
      <div class="flex-none my-auto text-white font-md p-2 ml-1">
        Día:<input type="date" class="rounded text-black ml-2 md:w-20 2xl:w-20"/>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-1">
        Mes:<input type="month" class="rounded text-black ml-2 md:w-20 2xl:w-20"/>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-1">
        Semana:<input type="week" class="rounded text-black ml-2 md:w-20 2xl:w-20"/>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-1">
        Nombre:<input type="text" class="rounded ml-2 text-black 2xl:w-20" />
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-1">
        Perfil:
        <select class="rounded ml-2 text-black 2xl:w-20">
          <option :value="undefined" >Seleccione un Perfil</option>
          <option>Perfil 1</option>
          <option>Perfil 2</option>
          <option>Perfil 3</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-1">
        Acción:
        <select class="rounded ml-2 text-black 2xl:w-20">
          <option :value="undefined" >Seleccione una Acción</option>
          <option>Crear</option>
          <option>Editar</option>
          <option>Activar</option>
          <option>Desactivar</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2">
        Resultados:
        <select class="text-gray-800 w-16 rounded">
          <option>10</option>
          <option>30</option>
          <option>50</option>
        </select>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-10">
        <button class="btn-buscar animacion">Buscar</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-1">
        <button class="btn-buscar animacion">Todos</button>
      </div>
      <div class="flex-none my-auto text-white font-md p-2 ml-1">
        <button class="btn-buscar animacion">Descargar</button>
      </div>
    </div>
    <TablaActividad :infoRoles="roles"/>
    <div class="ml-20">
      <Paginacion :total-pages="totalPaginas" :total="100" :current-page="paginaActual" :has-more-pages="hasMorePages" @pagechanged="cambiarPagina"/>
    </div>
  </div>
  <!-- MODAL CARGANDO -->
  <Spinner :modalLoading="modalLoading"/>
  <Footer/>
</template>

<script>
import TablaActividad from "../../components/Tabla-actividad.vue"//Importamos el componente de la tabla que contiene las cabeceras que corresponden y contiene los datos para mostrar
import Paginacion from "../../components/Paginacion.vue" //Importamos el componente de la páginación
import Spinner from '../../components/Spinner.vue' //Importamos el componente del spinner para las pantallas de carga
import Navbar from "../../components/Navbar.vue";//Importamos el componente navbar para la navegación
import Footer from "../../components/Footer";//Importamos el componente Footer
export default {
  components: {
    TablaActividad,
    Navbar,
    Footer,
    Spinner,
    Paginacion,
  }, 
};
</script>
<style scoped>
.bg-ferromex {
  background-color: #BB2028;
  padding: 10px 5px;
}
.title {
  text-align: center;
  font-size: 25px;
  padding-top: 20px;
}
@media (max-width: 750px) {
  .title {
    font-size: 20px;
    padding-bottom: 20px;
  }
}
</style>
<style src="@vueform/multiselect/themes/default.css"></style>