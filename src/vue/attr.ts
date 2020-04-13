import * as types from '@babel/types';
import traverse, { NodePath, Binding } from '@babel/traverse';
import { getString, getCamelCase, renderJSX } from "../utils"

function parseAttr({keyString,dg,childrens,attrs,attr}){
  attrs.push(...attr.value.properties.map(v => {
    if (!types.isObjectProperty(v)) return;
    let key = getCamelCase(keyString, v.key.value || v.key.name);
    if (["attrs", "props"].includes(keyString)) {
      key = v.key.name || v.key.value;
    }
    return types.jsxAttribute(
      types.jsxIdentifier(key), types.jsxExpressionContainer(v.value as any)
    )
  }))
}

export {
  parseAttr
}