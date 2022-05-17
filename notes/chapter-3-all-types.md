# Chapter 3: 类型全解

`unknown` 表示任何值，但是当进行特定操作前 ts 会要求细化类型

1. ts 不会把任何值推导为 `unknown`，需要显式指定
2. `unknown` 类型变量可以比较

```ts twoslash
// @errors: 2571
let a: unknown;
let b = a === 123;
let c = a + 10;
if (typeof a === "number") {
  let d = a + 10;
}
```

类型字面量：仅表示一个值的类型

```ts twoslash
let real: true = true;
let exact: 1 = 1;
```

`object` 类型表示一个非 `null` 的对象，但是对值得访问一无所知

```ts twoslash
// @errors: 2339
let message: object = { name: "hello" };
message.name;
```

class constructor 中的 `public` 是 `this.property = property` 的简写

```ts twoslash
class Person {
  constructor(public name: string) {}
  // 等价于：
  // constructor(name: string) { this.name = name; }
}
```

`{}` 和 `Object` 也可以用来声明对象类型，有细微差别，不推荐使用（P41）

类型别名使用块级作用域

```ts twoslash
function test() {
  type Person = { name: string };
  if (Math.random() > 0.5) {
    type Person = { age: number };
    let person: Person;
  }
}
```

元组

- 支持可选符号 ?
- 支持剩余元素 ...

```ts twoslash
let ticket: [string, number] = ["bqh", 10185];
let trains: [string, number?][] = [["a", 123], ["b"]];
let list: [number, boolean, ...string[]] = [1, true, "a", "b", "c"];
```

数组类型有 `readonly` 标识，只读数组不再能被改变

```ts twoslash
// @errors: 2542 2339
let arr: readonly number[] = [1, 2, 3];
arr[1] = 2;
arr.push(1);
```

- `void` 可表示无显式返回值函数的返回类型，例如 `console.log()`
- `never` 可表示不会结束或抛出异常的的函数的返回类型
- `never` 值可以赋值给任何类型的变量

```ts twoslash
function error(message: string): never {
  throw new Error('Failed to return. msg:' + message);
}
function loop(): never {
  while (true) {}
}
let sth = 100;
sth = loop();
```

枚举

- `enum` 编译为一个对象a
- `const enum` 则不生成 JavaScript 代码，而是在用到枚举成员的地方内插对应的值，
- 设置 `complierOptions` 中的 `preserveConstEnums` 参数为 true 可以保留枚举常量（Disable erasing `const enum` declarations in generated code.）

```ts twoslash
enum Color {
  Red = "#f00",
  Green = "#0f0",
  Blue = "#00f",
}
// 编译结果：
// var Color;
// (function (Color) {
//     Color["Red"] = "#f00";
//     Color["Green"] = "#0f0";
//     Color["Blue"] = "#00f";
// })(Color || (Color = {}));
```
