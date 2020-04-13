import * as types from '@babel/types';
import { NodePath } from '@babel/traverse';
import { getCamelCase } from '../utils';
import { deepEqual, equal } from 'assert';

/*
https://github.com/vuejs/vue/blob/dev/src/compiler/helpers.js
addHandler
https://github.com/vuejs/vue/blob/dev/src/compiler/codegen/events.js
*/
interface EventAttrModel {
  key:NodePath<types.Identifier | types.StringLiteral>,
  value:NodePath<types.Function | types.Expression>,
  pre?:string
}

function parseEvent({key,value,pre}:EventAttrModel) {
  var modifiers:any = {};
  var _keyName ;
  var _value:any = value; 
  var modifiers:any = {};
  if (types.isStringLiteral(key.node)) {
    _keyName = key.node.value;
    while (["!","~","&"].includes(_keyName.substr(0,1))) {
      switch (key.node.value.substr(0, 1)) {
        case "!":
          modifiers.capture = true;
          break;
        case "~":
          modifiers.once = true;
          break;
        case "&":
          modifiers.passive = true;
          break;
      }
      _keyName = _keyName.substr(1)
    }
  }
  if(types.isIdentifier(key.node)){
    _keyName = key.node.name;
  }
  
  if(types.isFunction(value.node)){
    if(types.isIdentifier(value.node.params[0])){
      // 统一函数首参名称 event
      value.scope.rename(value.node.params[0].name,"$event");
      value.scope.bindings.$event.referencePaths.forEach(reference=>{
        if(reference.parentPath.toString() == "$event.stopPropagation"){
          modifiers.stop = true;
          reference.parentPath.parentPath.remove();
        }
        if(reference.parentPath.toString() == "$event.preventDefault"){
          modifiers.prevent = true;
          reference.parentPath.parentPath.remove();
        }
      })
    }
    // 判断 self 关键词
    if(value.toString().includes('$event.currentTarget')){
      modifiers.self = true;
    }
    //判断 是否是 key event
    if(value.toString().includes('$event.type.indexOf("key")')){
      // 检测所有_k 函数
      value.traverse({
        CallExpression(path){
          if(path.get("callee").toString().includes("_k")){
            // @ts-ignore
            modifiers[path.get("arguments")[1].node.value] = true;
          }
        }
      });
      // 关键词匹配功能键
      ['ctrl', 'shift', 'alt', 'meta'].forEach(key=>{
        if(value.toString().includes(`$event.${key}Key`)){
          modifiers[key] = true;
        }
      });
      // 当热键为纯数字时 会采用 13 === $event.keyCode 的方式判断 
      value.scope.bindings.$event.referencePaths.forEach(referencePath=>{
        if(types.isMemberExpression(referencePath.parent) && referencePath.parent.property.name == "keyCode" && types.isBinaryExpression(referencePath.parentPath.parentPath.node)){
          if(referencePath.parentPath.parentPath.node.left == referencePath.parent && types.isNumericLiteral(referencePath.parentPath.parentPath.node.right)){
            // @ts-ignore
            modifiers[referencePath.parentPath.parentPath.node.right.value] = true;
          }
          if(referencePath.parentPath.parentPath.node.right == referencePath.parent && types.isNumericLiteral(referencePath.parentPath.parentPath.node.left)){
            // @ts-ignore
            modifiers[referencePath.parentPath.parentPath.node.left.value] = true;
          }
        }
      })
    }
    // 搜索真实方法
    var realMethods = [];
    value.traverse({
      MemberExpression(path:NodePath<types.MemberExpression>){
        if((<NodePath<types.Expression>> path.get("object")).toString().includes("$event"))return;
        if(path.toString().includes("._k"))return;
        realMethods.push(path.parentPath);
        
      }
    });
    if(realMethods.length == 0){
      _value = null;
    } else if(realMethods.length == 1){
      _value = realMethods[0];
    }else{
      // 如果每个元素都相同 代表他们拥有相同父级 为一个组
      if(realMethods.some((v,i)=>v == realMethods[0] && i!=0)){
          _value = realMethods[0].parentPath;
      }
    } 
  }

  
  
  return types.jsxAttribute(
    types.jsxIdentifier(`${getCamelCase("v",pre)}:${[_keyName,...Object.keys(modifiers)].join("_")}`), types.stringLiteral(""+_value)
  )
}

export {
  parseEvent
}