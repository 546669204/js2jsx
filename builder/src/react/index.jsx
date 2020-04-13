import React from "react"

export default function () {
  const name = 'Josh Perez';
  const element = <h1>Hello, {name}</h1>;
  return (
    <div>
      {/* props 绑定 */}
      <button onClick={this.handleClick.bind(this)} disabled={this.state.disabled}>Add Item</button>
      {/* 三元 */}
      {this.state.if?(<div>123456</div>):null}
      {/* 列表循环 */}
      <ul>
        {
          this.state.items.map(function (item, index) {
            return <li key={index}>{item}</li>
          })
        }
      </ul>
      {element}
    </div>
  )
}