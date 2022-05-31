<template>
<Navbar/>
<div class="grid justify-items-center p-16 2xl:p-42">
<div class="bg-white w-96 h-96 rounded-lg shadow-md 2xl:w-80 2xl:h-80">
  <h1 class="text-4xl font-bold font-titulo text-center p-2 2xl:text-6xl 2xl:p-4">Reporte Cajero</h1>
  <div class="flex w-full justify-center mt-4 gap-8 2xl:gap-20 2xl:mt-10">
    <div class="flex flex-col gap-10 2xl:gap-20">
        <div>
            <label for="">Plaza de Cobro</label>
        </div>
        <div>
            <label for="">Numero de Cajero</label>
        </div>
        <div>
            <label for="">Turno</label>
        </div>
        <div>
            <label for="">Fecha</label>
        </div>
        
    </div>
    <div class="flex flex-col gap-10 2xl:gap-20">
         <div>
            <label for="">Mazanillo</label>
        </div>
        <div>
            <input type="text" placeholder="XXXXX" class="input"/>
        </div>
        <div>
            <select class="input">
                <option>Selecciones un turno</option>
            </select>
        </div>
        <div>
            <input type="date" class="input">
        </div>
    </div>
  </div>
  <div class="flex w-full justify-center p-6 2xl:p-20">
      <button class="border w-40 bg-ferromex text-white">Generar Reporte</button>
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

<style scoped>
.border {
    border: 1px solid #ffffff;
    border-radius: 150px;
    -webkit-box-shadow: 5px 5px 14px -5px rgba(0, 0, 0, 0.44);
    box-shadow: 5px 5px 14px -5px rgba(0, 0, 0, 0.44);
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