<template>
<Navbar/>
  <h1 class="text-4xl font-bold font-titulo text-center">Reporte Cajero</h1>
  <div class="flex w-full justify-center gap-20 mt-10">
    <div class="flex flex-col gap-10">
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
    <div class="flex flex-col gap-10">
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
  <div class="flex w-full justify-center mt-20">
      <button class="border w-40 bg-ferromex text-white">Generar Reporte</button>
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