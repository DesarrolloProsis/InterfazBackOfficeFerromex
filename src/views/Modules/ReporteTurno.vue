<template>
<Navbar/>
  <h1 class="text-4xl font-bold font-titulo text-center">Reporte Turno</h1>
  <div class="flex w-full justify-center gap-20 mt-10">
    <div class="flex flex-col gap-10">
        <div>
            <label for="">Plaza de Cobro</label>
        </div>
        <div>
            <label for="">Turno</label>
        </div>
        <div>
            <label for="">Fecha</label>
        </div>
        
    </div>
    <div class="flex flex-col gap-10">
         <div>
            <label for="">Mazanillo</label>
        </div>
        <div>
            <select>
                <option>Seleccione un turno</option>
            </select>
        </div>
        <div>
            <input type="date">
        </div>
    </div>
  </div>
  <div class="flex w-full justify-center mt-20">
      <button class="border w-40">Generar Reporte</button>
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