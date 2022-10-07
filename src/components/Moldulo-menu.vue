<template>
  <div class="w-69 mx-auto">
    <div class="ferromex-color border border-black  rounded-3xl animacion">
      <router-link :to="ruta" tag="div" class="">
        <img class="imagen-modulo" :src="require('@/assets/' + imagen)" />
      </router-link>
    <h1 class="text-center text-white text-xl py-5 font-titulo">{{ nombre }}</h1>
    </div>
  </div>
</template>
<script>
export default {
  name: "ModulosComp",
  props: ["imagen", "ruta", "nombre","exitSubModulo"]
};
</script>
<style scoped>
.inactive{
  opacity: .3;
  pointer-events: none;
}
.titulo-modulo {
  text-align: center;
  padding-top: 5px;
  font-weight: 400;
}
.imagen-modulo {
  display: block;
  margin: auto;
  width: 150px;
  background-color:transparent;
}
@media (min-width: 1720px) {
  .imagen-modulo {
    display: block;
    margin: auto;
    width: 230px;
    padding: 15px ;
    background-color: transparent;
  }
}
</style>