import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import generate from '@babel/generator';
import * as types from '@babel/types';
import prettier from 'prettier';
import { getString, getCamelCase, renderJSX } from "./utils"
import { parseSlot } from "./vue/slot"
import { parseAttr } from "./vue/attr"
import { parseDirectives } from "./vue/directives"
import { parseEvent } from './vue/event';
/*
 https://vuejs.org/v2/guide/render-function.html

// @returns {VNode}
createElement(
  // {String | Object | Function}
  // An HTML tag name, component options, or async
  // function resolving to one of these. Required.
  'div',

  // {Object}
  // A data object corresponding to the attributes
  // you would use in a template. Optional.
  {
    // (see details in the next section below)
  },

  // {String | Array}
  // Children VNodes, built using `createElement()`,
  // or using strings to get 'text VNodes'. Optional.
  [
    'Some text comes first.',
    createElement('h1', 'A headline'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
https://github.com/vuejs/jsx#installation
//this 上 挂在 函数 大全
https://github.com/vuejs/vue/blob/dev/src/core/instance/render-helpers/index.js
function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode; [x]
  target._e = createEmptyVNode; [x]
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

*/
// Vue render h函数判断 
function isCreateElement(path: NodePath<types.Node>, code: String) {
  const node = path.node;
  if (!types.isCallExpression(node) || !types.isStringLiteral(node.arguments[0])) return false;
  if (types.isIdentifier(node.callee)) {
    // @ts-ignore

    if (!path.scope.getBinding(node.callee.name)) return false;
    if (!types.isVariableDeclarator(path.scope.getBinding(node.callee.name).path.node)) return
    // @ts-ignore
    return getString(path.scope.getBinding(node.callee.name).path.node.init, code).includes("_self._c")
  }
  // (vm._self._c || )
  if (types.isLogicalExpression(node.callee)) {
    return getString(node.callee, code).includes("_self._c")
  }
  return false;
}


// 通过搜索作用域范围内的关键词 判断 是否是render函数
function isRenderFunction(path: NodePath<types.Function>) {
  var body = path.get("body.body");
  var _v = body[0];
  var _r = body[1];
  if(!/\_self\.\_c/.test(path.toString())){
    return false;
  }
  if(_r && _v && types.isVariableDeclaration(_v.node)  && types.isReturnStatement(_r.node) &&/\$createElement/.test(_v.toString())){
      return _r
  }
  return false;
}

function BinaryExpressionToJSXText(path: NodePath<types.BinaryExpression>, childrens = []) {
  // path.node.operator 忽略 运算符 
  if (types.isStringLiteral(path.node.left)) {
    childrens.push(types.jsxText(path.node.left.value))
  }
  if (types.isBinaryExpression(path.node.left)) {
    BinaryExpressionToJSXText(path.get("left"), childrens)
  }
  if (types.isCallExpression(path.node.left)) {
    // @ts-ignore
    childrens.push(types.jsxExpressionContainer(path.node.left.arguments[0]))
  }

  if (types.isStringLiteral(path.node.right)) {
    childrens.push(types.jsxText(path.node.right.value))
  }
  if (types.isBinaryExpression(path.node.right)) {
    BinaryExpressionToJSXText(path.get("right"), childrens)
  }
  if (types.isCallExpression(path.node.right)) {
    // @ts-ignore
    childrens.push(types.jsxExpressionContainer(path.node.right.arguments[0]))
  }


  return childrens
}

/*
export function isPrimitive (value: any): boolean %checks {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}
*/
function isPrimitive(path){
  return types.isStringLiteral(path.node) || types.isNumericLiteral(path.node) || types.isBooleanLiteral(path.node);
}


function renderAttr({attrobj,childrens,attrs}){
  attrobj.node.properties.forEach((attr,index) => {
    if (!types.isObjectProperty(attr)) return;
    var keyString = attr.key.name || attr.key.value;
    if (["attrs", "props", "domProps"].includes(keyString)) {
      if (!types.isObjectExpression(attr.value)) return;
      parseAttr({keyString,dg,childrens,attrs,attr})
    } else if (["directives"].includes(keyString)) {
      parseDirectives({attrs,attr})
    } else if (["scopedSlots"].includes(keyString)) {
      var value =<NodePath<types.JSXElement | types.JSXFragment | types.StringLiteral | types.JSXExpressionContainer | null>> attrobj.get(`properties.${index}.value`);
      parseSlot({value,dg,childrens,attrs});
    } else if (["on","nativeOn"].includes(keyString)){
      attrs.push(
        ...attrobj.get(`properties.${index}.value.properties`).map(v => {
          return parseEvent({key:v.get("key"),value:v.get("value"),pre:keyString});
        })
      )
    } else {
      attrs.push(types.jsxAttribute(types.jsxIdentifier(keyString), types.jsxExpressionContainer(attr.value as any)));
    }
  });
}


function dg(path: NodePath<types.Node>,attr=[]) {
  if(types.isConditionalExpression(path.node)){
    var alternate = path.get("alternate")?.toString();
    if(alternate && /\_e\(\)/.test(alternate)){
      return dg(<NodePath<types.Node>> path.get("consequent"),[types.jsxAttribute(types.jsxIdentifier("vIf"), types.jsxExpressionContainer(path.node.test))])
    }
  }
  if (!types.isCallExpression(path.node)) return types.jsxText('');

  if ((<NodePath<types.Node>>path.get("callee")).toString().includes("_v")) {//createTextVNode _v
    let args = <NodePath<types.Node>[]>path.get("arguments");
    if (args.length == 1 && types.isStringLiteral(args[0].node)) {
      return types.jsxText(args[0].node.value)
    }
    if (types.isExpression(args[0].node)) {
      if (types.isBinaryExpression(args[0].node)) {
        // @ts-ignore
        return BinaryExpressionToJSXText(args[0])
      }
      return types.jsxExpressionContainer(args[0].node)
    }
    return types.jsxText("");
  }

  if ((<NodePath<types.Node>>path.get("callee")).toString().includes("_t")) {//renderSlot _t
    let args: NodePath<types.Node>[] = <NodePath<types.Node>[]>path.get("arguments");
    if(types.isStringLiteral(args[0].node)){
      var slotAttrs= [types.jsxAttribute(types.jsxIdentifier("name"), args[0].node)],slotChildrens = [];

      if(args[2] && types.isObjectExpression(args[2].node)){
        renderAttr({childrens:slotChildrens,attrs:slotAttrs,attrobj:args[2]})
      }

      return renderJSX({
        tagName:types.jsxIdentifier("slot"),
        // @ts-ignore
        attrs:slotAttrs,
        childrens:slotChildrens
      })
    }
    return types.jsxText('')
  }
  if ((<NodePath<types.Node>>path.get("callee")).toString().includes("_s(")) {//toString _s
    // @ts-ignore
    return types.jsxExpressionContainer(path.get("arguments.0"))
  }

  
  if (!types.isMemberExpression(path.node.arguments[0]) && !types.isStringLiteral(path.node.arguments[0])) return types.jsxText('')
  let node = path.node;

  // @ts-ignore
  let tagName = types.jsxIdentifier(node.arguments[0].value || node.arguments[0].name || "template");

  const attrs = [...attr];
  let childrens = [];
  let args = <NodePath<types.Node>[]>path.get("arguments");


  if (args[1] && types.isObjectExpression(args[1].node)) {
    var attrobj =<NodePath<types.ObjectExpression>> args[1];
    renderAttr({childrens,attrs,attrobj})
    
  }

  attrs.forEach((v: types.JSXAttribute,index) => {
    // if(!v){return}
    if (types.isJSXExpressionContainer(v.value) && types.isStringLiteral(v.value.expression)) {
      v.value = v.value.expression
    }
    // @ts-ignore
    if(v.name.name == 'tag' && types.isMemberExpression(path.node.arguments[0])){
      attrs.splice(index,1)
      tagName = types.jsxIdentifier((<types.StringLiteral>v.value).value);
      // @ts-ignore
      attrs.push(types.jsxAttribute(types.jsxIdentifier("is"),types.jsxExpressionContainer(path.node.arguments[0])))
    }
  })
  // console.log(attrs)

  let childrenArgs = args[2];
  if(args[1]&&(types.isArrayExpression(args[1]) || isPrimitive(args[1]))){
    childrenArgs = args[1]
  }
  if (childrenArgs) {
    if (types.isArrayExpression(childrenArgs.node)) {
      // @ts-ignore
      childrens = childrens.concat( (<NodePath<types.Node>[]>childrenArgs.get("elements")).map(item => dg(item)).flat());
    } else {
      if (types.isCallExpression(childrenArgs.node)) {
        childrens = childrens.concat([types.jsxExpressionContainer(childrenArgs.node)])
      } else {
        if (types.isStringLiteral(childrenArgs.node)) {
          childrens = childrens.concat([types.jsxText(childrenArgs.node.value)])
        } else if (types.isExpression(childrenArgs.node) && !types.isObjectExpression(childrenArgs.node)) {
          childrens = childrens.concat([types.jsxExpressionContainer(childrenArgs.node)])
        }
      }
    }
  }

  return renderJSX({
    tagName,
    attrs,
    childrens
  })
}


export default function (code:string) {
  const ast = parse(code, {
    plugins: ['jsx']
  });
  const opt = {
    // CallExpression: function a(path: NodePath<types.Node>, t: any) { 
    //   if (isCreateElement(path, code)) {
    //     path.replaceWith(dg(path));
    //   }
    // },
    Function:(path: NodePath<types.Function>, t: any)=>{
      var _r = isRenderFunction(path);
      if(_r){
        var _a = _r.get("argument");
        // @ts-ignore
        _a.replaceWith(dg(_a));
      }
    }
  }
  // @ts-ignore
  traverse(ast, opt);
  const output = generate(
    // @ts-ignore
    ast,
    {
      jsescOption: {
        wrap: true,
        compact: false,
        indent: ' ',
        indentLevel: 2
      }
    },
    code
  );
  return output.code
}
