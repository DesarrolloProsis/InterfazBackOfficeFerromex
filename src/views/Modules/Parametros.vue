<template>
  <Navbar/>
  <div class="justify-content-center">
    <h1 class="title font-bold font-titulo my-8">Parámetros</h1>
    <div class="container mx-auto px-auto px-48 pt-10 my-32">
        <div class="flex flex-wrap">
            <ModulosComp
            v-for="(modulo, index) in modulos"
            :key="index"
            :imagen="modulo.imagen"
            :ruta="modulo.ruta"
            :nombre="modulo.nombre"
            ></ModulosComp>
        </div>
    </div>
  </div>
  
  <Footer></Footer>
</template>

<script>
import Navbar from "../../components/Navbar.vue"; //Importamos el componnete Navbar para mostrar en la vista
import ModulosComp from "../../components/Moldulo-menu.vue"; //Importamos el componente de Menú para poder poner cada uno de los modulos que tiene el rol
import Footer from "../../components/Footer.vue";//Importamos el footer para mostrar en la vista
import { ref } from 'vue' //Importamos onMounted para recibir una respuesta de una llamada cuando se monta el modulo, y ref para hacer referencia al tipo de dato que estamos utilizando y volvemos reactiva la constante

export default {
  components: {
    Navbar,
    ModulosComp,
    Footer
  },
  setup(){
    
    const modulos = ref([]) //Constante que va a almacenar el array de modulos que se van a mostrar

    modulos.value = [
                {
                    imagen: "Menu/gestion-usuarios.png",
                    nombre: "Gestion de Usuarios",
                    ruta: "/gestion-usuarios",
                    color: "red"
                },
                {
                    imagen:"Menu/mantenimiento-tag.png",
                    nombre: "Gestión de Tags",
                    ruta: "/inicio/mantenimiento-tag",
                    color: "red"
                },
            ]  

    
    return {modulos}
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