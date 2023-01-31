<template>
    <div class="p-7 -mt-12 w-1/3" :class="{'ml-20': mostrar == 'false'}">
        <router-link  v-if="ruta.includes('/')" :to="ruta" tag="div">
            <div class="rounded-lg animacion flex flex-col bg-ferromex border-2 border-gray-900" >
                <div>
                    <img class="img" :src="require('@/assets/' + img_src)" />
                </div>
                <div class="text-center py-5 font-titulo font-bold text-white">
                    <h1>{{ nombre }}</h1>
                </div>
            </div>
        </router-link>
        <div v-else @click="this.$emit(ruta)" class="rounded-lg animacion flex flex-col bg-ferromex border-2 border-gray-900" >
            <div>
                <img class="img" :src="require('@/assets/' + img_src)" />
            </div>
            <div class="text-center py-5 font-titulo font-bold text-white">
                <h1>{{ nombre }}</h1>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "ModuloConfiguracion",
    props: ["nombre", "img_src", "ruta", "mostrar","color"],
};
</script>
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