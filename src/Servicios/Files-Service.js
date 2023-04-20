import saveAs from "file-saver";
import ServiceToken from '../Servicios/Token-Services'
import {ref} from 'vue';
import { notify } from "@kyvg/vue3-notification";

export const file = () => {
  const loading = ref(false);
function xml_hhtp_request(urlToFile,tipo,name,vista){  
    loading.value = true; 
    var oReq = new XMLHttpRequest();  
    oReq.open("GET", urlToFile, true);    
    oReq.responseType = "blob";  
    let token =  ServiceToken.obtenerToken() //ServiceToken.getCookie('Token')    
    oReq.setRequestHeader('Authorization', 'Bearer ' + token);   
    oReq.send();              
    oReq.onload = function () {
      if(oReq.status == 200){ //Validacion de la respuesta del servidor
        var file = new Blob([oReq.response], { //Creamos el objeto Blob
          type: "application/pdf",
        });
        if(file.size > 0){ //VAlidacion del tamaño del archivo
          if(tipo == 1){
            loading.value = false; 
            var pdfFileURL = URL.createObjectURL(file); //El archivo Blob lo guardamos en una URL temporal
            window.open(pdfFileURL, '_blank' ) //Abrimos la uRL denuestor local host en una nueva pestaña
          }else if (tipo == 2){
            loading.value = false; 
            saveAs(file, name); 
          }
        }else{
        
          loading.value = false; 
          notify({
            title:'Archivo Vacio',
            text:'No se pudo generar el reporte por favor intentelo mas tarde',
            type: 'error'
          });
        }
      }else {
        if(vista)
        {
          loading.value = false;
          notify({
            title:'Sin Datos',
            text:'No se tienen datos para el carril o cajero en el turno seleccionado',
            type: 'error'
          });
        }else{
          loading.value = false; 
          notify({
            title:'Archivo Dañado',
            text:'No se pudo generar el reporte por favor intentelo mas tarde',
            type: 'error'
          });
        }
      }
      //saveAs(file, nameFile);  
    };            
}
  return {xml_hhtp_request,loading}
}