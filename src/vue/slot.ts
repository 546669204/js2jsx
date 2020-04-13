import * as types from '@babel/types';
import traverse, { NodePath, Binding } from '@babel/traverse';
import { getString, getCamelCase, renderJSX } from "../utils"


function parseSlot({value,dg,childrens,attrs}) {
  if (types.isCallExpression(value.node) && /\_u/.test(value.get("callee").toString())) {
    var _u_args = value.get("arguments");
    if (types.isArrayExpression(_u_args[0].node)) {
      var elements = <NodePath<types.ObjectExpression>[]>_u_args[0].get("elements")
      elements.forEach(element => {
        var key = null;
        var fn:NodePath<types.Function> = null;
        // @ts-ignore
        element.get("properties").forEach(propertie => {
          if (types.isObjectProperty(propertie.node)) {
            // key = 
            if (propertie.node.key.name == "key") {
              key = propertie.node.value;
            }
            if (propertie.node.key.name == "fn") {
              fn = propertie.get("value");
            }
          }
        })
        if (key && fn) {
          var slotAttr = [];
          var slotChildrens = [];
          // 判断是否是静态名字
          if (types.isStringLiteral(key)) {
            slotAttr.push(types.jsxAttribute(types.jsxIdentifier("slot"), key))
          } else {
            slotAttr.push(types.jsxAttribute(types.jsxIdentifier("slot"), types.jsxExpressionContainer(key)))
          }

          if (types.isFunctionExpression(fn.node)) {
            // @ts-ignore
            if (fn.get("params").length > 0) {
              // @ts-ignore
              fn.scope.rename(fn.get("params")[0].toString(),"slotProps")
              // @ts-ignore
              var slotScopeAttr =  types.jsxAttribute(types.jsxIdentifier("slot-scope"), types.stringLiteral(fn.get("params")[0].toString()))
              // @ts-ignore
              for (const key in fn.scope.bindings) {
                const binding = fn.scope.bindings[key];
                if(binding.kind == "var"){
                  var init = binding.path.get("init").toString();
                  fn.scope.rename(key,init)
                }
              }
              slotAttr.push(slotScopeAttr)
            }
            // @ts-ignore
            var returnNode = fn.get("body.body")[fn.get("body.body").length - 1];
            if (types.isSequenceExpression(returnNode.get("argument").node)) {
              let returnNodePlus = returnNode.get("argument.expressions")[returnNode.get("argument.expressions").length-1]
              // let sequenceExpression = returnNode.get("argument.expressions")
              // if(types.is)
              returnNodePlus.get("elements").forEach(e => {
                slotChildrens.push(dg(e))
              })
            }
            if (types.isArrayExpression(returnNode.get("argument").node)) {
              returnNode.get("argument.elements").forEach(e => {
                slotChildrens.push(dg(e))
              })
            }
          }
          // 独占 slotScope 处理
          if(elements.length == 1){
            attrs.push(...slotAttr)
            childrens.push(...slotChildrens.flat())
          }else{
            childrens.push(renderJSX({
              tagName: types.jsxIdentifier("template"),
              attrs: slotAttr,
              childrens: slotChildrens.flat()
            }))
          }
        }
      })
    }
  }
}


export {
  parseSlot
}