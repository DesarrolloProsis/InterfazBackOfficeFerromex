<template>
  <div>
    <embed type="application/pdf" width="700" height="600" :src="srcarchivo">
  </div>
</template>

<script>
import {toRef} from 'vue'
export default {
props: {
    rutaarchivo: String
  },
setup(props){
    const srcarchivo = toRef(props, 'rutaarchivo')
    return{srcarchivo}
}
}
</script>

<style>

</style>