import {parse} from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import generate from '@babel/generator';
import * as types from '@babel/types';

function dg(path) {
  const node = path.node;
  if (!types.isCallExpression(node)) return types.jsxText('');
  if (!path.get("callee").toString().endsWith('createElement')) {
    return types.jsxText('');
  }
  if(!node.arguments[0])return types.jsxText('');
  const tagName = types.jsxIdentifier(path.get("arguments.0").toString().replace(/"|'/gi,""));
  const attrs = [];

  if (types.isObjectExpression(node.arguments[1])) {
    var attrobj: types.ObjectExpression = node.arguments[1];
    attrobj.properties.forEach(attr => {
      if (!types.isObjectProperty(attr)) return;
      attrs.push(types.jsxAttribute(types.jsxIdentifier(attr.key.name||attr.key.value), types.jsxExpressionContainer(attr.value as any)));
    });
  }
  let childrens = [];
  if (node.arguments.length>2) {
    childrens = node.arguments.slice(2).map((item,index) => {
      if(types.isCallExpression(item)){
        if (!path.get("arguments."+(index+2)).toString().endsWith('createElement')) {
          return types.jsxExpressionContainer(item);
        }
        return dg(item);
      }else if(types.isStringLiteral(item)){
        if(tagName.name == "style"){
          attrs.push(
            types.jsxAttribute(types.jsxIdentifier("dangerouslySetInnerHTML"), item)
          )
          return types.jsxText("")
        }else{
          return types.jsxText(item.value)
        }
      }else if(types.isExpression(item) && !types.isObjectExpression(item)){
        return types.jsxExpressionContainer(item)
      }

    });
  }
  
  if (childrens.length <= 0) {
    return types.jsxElement(types.jsxOpeningElement(tagName, attrs, true), null, [], true);
  }
  return types.jsxElement(types.jsxOpeningElement(tagName, attrs), types.jsxClosingElement(tagName), childrens, false);
}

export default function (code){
  var ast = parse(code, {
    plugins: ['jsx']
  });
  var opt = {
    CallExpression: function (path, t) {
      if (path.get("callee").toString().endsWith('createElement')) {
        let jsxElement = dg(path);
        if(types.isJSXElement(jsxElement)){
          path.replaceWith(jsxElement);

        }
      }
    }
  }
  // @ts-ignore
  traverse(ast, opt);
  var output = generate(
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
  return output.code;
}
