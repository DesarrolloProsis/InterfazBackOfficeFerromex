import { createRouter, createWebHistory } from "vue-router";
//import axios from "axios";
import Login from "@/views/Login.vue";
import Menu from "@/views/Menu.vue";
import RegistroDeInformacionDeTelepeaje from "@/views/Modules/RegistroInformacion.vue";
import MantenimientoTag from "@/views/Modules/MantenimientoTag.vue";
import GestiónUsuarios from "@/views/Modules/GestionUsuarios.vue";
import RolesDeUsuario from "@/views/Modules/RolesDeUsuario.vue";
import ListaUsuarios from "@/views/Modules/ListaUsuarios.vue";
import GeneracionReportes from "@/views/Modules/GeneracionReportes.vue";
import ReportesOperativos from '@/views/Modules/ReportesOperativos.vue'
import ReporteTurno from '../views/Modules/ReporteTurno.vue'
import ReporteCajero from '../views/Modules/ReporteCajero.vue'
import Cruces from '../views/Modules/Cruces.vue'
import Servicio from '../Servicios/Token-Services'
import Parametros from '@/views/Modules/Parametros.vue'
import ActividadUsuarios from '@/views/Modules/ActividadUsuario.vue'


const routes = [{
    path: "/",
    name: "Login",
    component: Login,
    meta: {
      requiresCookie: false
    },
    beforeEnter: (to, from, next) => {
      if (Servicio.obtenerToken()) {
        next()
      } else {        
        document.cookie = "TipoUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC;" + "SameSite=None; Secure;";
        document.cookie = "Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;" + "SameSite=None; Secure;";
        next();
      }
    }
  },
  {
    path: "/inicio",
    name: "Menu",
    component: Menu,
    meta: {
      requiresCookie: true,
    }
  },  
  {
    path: "/gestion-usuarios",
    name: "Gestión de usuarios",
    component: GestiónUsuarios,
    meta: {
      requiresCookie: true,
      nombre:"Gestión de usuarios"
    }
  }, 
  {
    path: "/gestion-usuarios/:id",
    name: "Gestión de usuarios Id",
    component: GestiónUsuarios,
    meta: {
      requiresCookie: true,
      nombre:"Gestión de usuarios Id"
    }
  },
  {
    path: "/generacion-reportes",
    name: "Generación de Reportes",
    component: GeneracionReportes,
    meta: {
      requiresCookie: true,
      nombre:"Generación de Reportes"
    }
  }, 
  {
    path: "/generacion-reportes/:id",
    name: "Generación de Reportes Id",
    component: GeneracionReportes,
    meta: {
      requiresCookie: true,
      nombre:"Generación de Reportes Id"
    }
  },
  {
    path: "/inicio/Cruces",
    name: "Cruces",
    component: Cruces,
    meta: {
      requiresCookie: true,
      nombre:"Cruces"
    }
  },
  {
    path: "/inicio/Cruces/:id",
    name: "Cruces Id",
    component: Cruces,
    meta: {
      requiresCookie: true,
      nombre:"Cruces Id"
    }
  },
  {
    path: "/parametros",
    name: "parametros",
    component: Parametros,
    meta: {
      requiresCookie: true
    }
  },
  {
    path: "/parametros/:id",
    name: "parametros Id",
    component: Parametros,
    meta: {
      requiresCookie: true
    }
  },
  {
    path: "/inicio/registro-informacion-telepeaje",
    name: "RegistroDeInformacionDeTelepeaje",
    component: RegistroDeInformacionDeTelepeaje,
    meta: {
      requiresCookie: true,
      nombre:"Monitoreo Cruces"
    }
  },
  {
    path: "/inicio/mantenimiento-tag",
    name: "MantenimientodeTag`s",
    component: MantenimientoTag,
    meta: {
      requiresCookie: true,
      nombre:"Mantenimiento de Tag`s"
    }
  },
  {
    path: "/inicio/Reportes-Operativos",
    name: "Reportes Operativos",
    component: ReportesOperativos,
    meta: {
      requiresCookie: true,
      nombre:"Reportes Operativos"
    }
  },
  {
    path: "/inicio/ReportesTurno",
    name: "Reporte Turno",
    component: ReporteTurno,
    meta: {
      requiresCookie: true,
      nombre:"Reporte Turno"
    }
  },
  {
    path: "/inicio/ReportesCajero",
    name: "Reporte Cajero",
    component: ReporteCajero,
    meta: {
      requiresCookie: true,
      nombre:"Reporte Cajero"
    }
  },  
  {
    path: "/gestion-usuarios/administracion-perfiles",
    name: "AdministracionPerfilUsuario",
    component: RolesDeUsuario,
    meta: {
      requiresCookie: true
    }
  },
  {
    path: "/gestion-usuarios/lista-usuarios",
    name: "ListaUsuarios",
    component: ListaUsuarios,
    meta: {
      requiresCookie: true
    }
  },
  {
    path: "/actividad-usuarios",
    name: "ActividadUsuarios",
    component: ActividadUsuarios,
    meta: {
      requiresCookie: true
    }  
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.matched.some(record => record.meta.requiresCookie)) {    
    //if (getCookie("TipoUser") != "" && getCookie("Token") != "") {
    if (Servicio.obtenerToken()) {
        next()
    } else {        
      //document.cookie = "TipoUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC;" + "SameSite=None; Secure;";
      //document.cookie = "Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;" + "SameSite=None; Secure;";
      next('/')      
    }
  } else {    
    next();
  }
})

export default router;