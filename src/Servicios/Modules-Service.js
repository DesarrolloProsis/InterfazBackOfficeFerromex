

function test(resultModules) {    
    let modules = resultModules.data.content  
    let modulos, subModulos = []
    
    modulos = modules.filter(x => x.parentModule == null)
    subModulos = modules.filter(x => x.parentModule != null)
    
    return { modulos, subModulos }
}

export default {
    test
}
