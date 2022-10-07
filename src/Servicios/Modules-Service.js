
function test(_modules) {    
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

export default {
    test
}
