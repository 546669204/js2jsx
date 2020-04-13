import * as types from '@babel/types';
import traverse, { NodePath, Binding } from '@babel/traverse';
import { getString, getCamelCase, renderJSX } from "../utils"

function parseDirectives({attrs,attr}){
  if (types.isArrayExpression(attr.value)) {
    attr.value.elements.forEach(v => {
      if (!types.isObjectExpression(v)) return
      let key = v.properties.find(v => {
        if (!types.isObjectProperty(v)) return;
        return v.key.name == "rawName"
      })
      let value = v.properties.find(v => {
        if (!types.isObjectProperty(v)) return;
        return v.key.name == "expression"
      })
      if (!key) return;
      if (!types.isObjectProperty(key)) return;
      //@ts-ignore
      attrs.push(types.jsxAttribute(
        //@ts-ignore
        types.jsxIdentifier(getCamelCase(...(key.value.value || key.value.name).replace(/\./, "_").split("-"))), value?types.jsxExpressionContainer(value.value):null
      ));
    })
  }
}

export {
  parseDirectives
}