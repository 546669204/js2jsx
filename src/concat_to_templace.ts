import { types, NodePath } from "@babel/core";

export default {
  MemberExpression:function(path){
    if(types.isIdentifier(path.node.property) && path.node.property.name == "concat"){
      if(types.isStringLiteral(path.node.object) ||types.isTemplateLiteral(path.node.object)){
        let temps = [];
        let quasis = [];
       
        if(types.isStringLiteral(path.node.object)){
          quasis.push( types.templateElement({raw:path.node.object.value},true))
        }else{
          quasis = path.node.object.quasis;
          temps = path.node.object.expressions;
        }

        if(!types.isCallExpression(path.parent) || !path.parent.arguments)return
   
        path.parent.arguments.forEach((item,i,a)=>{
          if(types.isStringLiteral(item)){
            quasis.push(types.templateElement({raw:item.value},true));
            return
          }
          if(types.isTemplateLiteral(item)){
            quasis.concat(...item.quasis)
            temps.concat(...item.expressions)
            return
          }
          temps.push(item)
          if(i == a.length -1){
            quasis.push(types.templateElement({raw:""},true));
          }
        })
        path.parentPath.replaceWith(
          types.templateLiteral(
            quasis,
            temps
          )
        )
        path.parentPath.parentPath.parentPath.traverse(path.opts)
      }
    }
  },
}