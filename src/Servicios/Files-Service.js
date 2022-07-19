import saveAs from "file-saver";
import ServiceToken from '../Servicios/Token-Services'

function xml_hhtp_request(urlToFile){        
    var oReq = new XMLHttpRequest();  
    oReq.open("GET", urlToFile, true);    
    oReq.responseType = "blob";  
    let token =  ServiceToken.obtenerToken() //ServiceToken.getCookie('Token')    
    oReq.setRequestHeader('Authorization', 'Bearer ' + token);   
    oReq.send();              
    oReq.onload = function () {
      var file = new Blob([oReq.response], { //Creamos el objeto Blob
        type: "application/pdf",
      });
      var pdfFileURL = URL.createObjectURL(file); //El archivo Blob lo guardamos en una URL temporal
      window.open(pdfFileURL, '_blank' ) //Abrimos la uRL denuestor local host en una nueva pestaña
      //saveAs(file, nameFile);  
    };            
}
function descargararchivo(urlToFile,nameFile){
  var oReq = new XMLHttpRequest();  
  oReq.open("GET", urlToFile, true);    
  oReq.responseType = "blob";  
  let token =  ServiceToken.obtenerToken() //ServiceToken.getCookie('Token')    
  oReq.setRequestHeader('Authorization', 'Bearer ' + token);   
  oReq.send();              
  oReq.onload = function () {
    var file = new Blob([oReq.response], { //Creamos el objeto Blob
      type: "application/pdf",
    });
    saveAs(file, nameFile);  
  };  
}
export default {
    xml_hhtp_request,
    descargararchivo
}