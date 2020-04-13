import { types, NodePath } from "@babel/core";


export default {
  Identifier:function(path){
    const node = path.node;
    if(!types.isIdentifier(node))return
    if (node.name == "exports" && path.getFunctionParent().parentPath.type == "ObjectProperty") {
      let objectPath = path.getFunctionParent().parentPath.parentPath;
      let objectNode = path.getFunctionParent().parentPath.parentPath.node;
      if(types.isObjectExpression(objectNode)){
        // @ts-ignore
        objectPath.get("properties").forEach(v=>{
          if(types.isObjectProperty(v)){
            // @ts-ignore
            if(types.isFunctionExpression(v.get("value"))){
              // @ts-ignore
              let p = v.get("value");
              p.node.params.forEach((v,i)=>{
                if(types.isIdentifier(v)){
                  p.scope.rename(v.name,["module","__webpack_exports__","__webpack_require__"][i])
                }
              })

            }
          }
        })
      }
    }
  },
}