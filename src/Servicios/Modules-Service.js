function GetMolduleAndSubModule(_modules) {    
    let modulos, subModulos = []
    let _subModulo = _modules.filter(x => x.parentModule != null)    
    subModulos = _modules
        .filter(x => x.parentModule != null)
        .map(x => {
            let exitSubModulo = _subModulo.some(item => item.parentModule == x.id)            
            if(exitSubModulo) x.route = x.route + '/' + x.id
            return { ...x, exitSubModulo }                        
        })

    modulos = _modules
        .filter(x => x.parentModule == null)
        .map(x => {
            let exitSubModulo = subModulos.some(item => item.parentModule == x.id)
            if(exitSubModulo) x.route = x.route + '/' + x.id
            return { ...x, exitSubModulo }                        
        })        
    return { modulos, subModulos }
}

function ValidSubModule(_modulo, _subModulos){    
    let arraySubModule = []
    //if(_modulo.exitSubModulo){
        let subModule = _subModulos.filter(x => x.parentModule == _modulo.id)         
        //if(subModule.some(x => x.exitSubModulo == true)) {              
            subModule            
            .forEach(item => {
                let subModuleItem = ValidSubModule(item, _subModulos)
                //let newSubModule = { modulo: item, arraySubModule: subModuleItem }                
                arraySubModule.push(subModuleItem)
            });
            return { modulo: _modulo, arraySubModule }
        //}
        //arraySubModule = subModule
        //return { modulo: _modulo, arraySubModule }       
    //}   
    //return { modulo: _modulo, arraySubModule }
}

function GetModulosWhitSubModulo(_modules) {
    let { modulos, subModulos } = GetMolduleAndSubModule(_modules)    
    return modulos.map(item => ValidSubModule(item, subModulos))
}

export default {
    GetMolduleAndSubModule,
    GetModulosWhitSubModulo
}
