<template>
<Navbar/>

  <h1 class="text-4xl font-bold font-titulo text-center mb-4">Reporte Turno</h1>
  <div class="flex w-full justify-center gap-10">
    <div class="flex flex-col gap-10">
        <div>
            <label for="">Primer label</label>
        </div>
        <div>
            <label for="">Segundo label</label>
        </div>
        <div>
            <label for="">Tercer label</label>
        </div>
        <div>
            <label for="">Cuarto label</label>
        </div>
    </div>
    <div class="flex flex-col gap-10">
         <div>
            <label for="">Primer label</label>
        </div>
        <div>
            <label for="">Segundo label</label>
        </div>
        <div>
            <label for="">Tercer label</label>
        </div>
        <div>
            <label for="">Cuarto label</label>
        </div>
    </div>
  </div>
<Footer/>
</template>

<script>
import Navbar from "../../components/Navbar.vue";
import Footer from "../../components/Footer";
export default {
components: {
        Navbar,
        Footer,
    },
}
</script>

<style>

</style>