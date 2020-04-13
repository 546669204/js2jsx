import { types } from "@babel/core";

function getString(node,code): string {
  if (!node.start || !node.end) return '';
  return code.substring(node.start, node.end);
}


function getCamelCase(...args:string[]):string{
  return args.map((v,i)=>{var c=v.replace(/^./,function(a){return a.toUpperCase()});return i>0?c:v}).join("")
}

function renderJSX({tagName,attrs,childrens}){
  if (childrens.length <= 0) {
    return types.jsxElement(types.jsxOpeningElement(tagName, attrs, true), null, [], true);
  }
  return types.jsxElement(types.jsxOpeningElement(tagName, attrs), types.jsxClosingElement(tagName), childrens, false);
}

export {
  getString,
  getCamelCase,
  renderJSX
}