import { types, NodePath } from "@babel/core";

export default {
  "FunctionExpression|FunctionDeclaration":function(path){
    Object.keys(path.scope.bindings).forEach(b => {
      const v = path.scope.bindings[b];
      // @ts-ignore
      if (v.kind != "hoisted") {
        return;
      }
      if (v.references == 1) {
        
        let node = types.cloneNode(v.path.node);
        node.type = "FunctionExpression";
        v.referencePaths[0].replaceWith(node);
        v.path.remove();
      }
    });
  },
}