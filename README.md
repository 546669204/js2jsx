# js2jsx

[![license](https://img.shields.io/github/license/:user/:repo.svg)](LICENSE)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

这是一个有关于 ast 语法树的项目

主要目的是将被编译后的js代码转换成jsx的形式 以便于更好的观察组件结构

最近在学习语法树想到了这个项目说干就干  

同时学习了 react jsx 和 vue template 的编译规则


## Install

```
yarn add　https://github.com/546669204/js2jsx.git
```

## Usage

```
import { js2jsxByVue, js2jsxByReact } from "js2jsx"

js2jsxByVue('encode') // 输出转换后的代码

js2jsxByReact('encode') // 输出转换后的代码

```

## TODO 

[todo task](../TODO.md)

## License

[Apache License 2.0](../LICENSE)

