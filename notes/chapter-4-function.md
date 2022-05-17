# Chapter 4: 函数

当需要在函数中使用 `this` 时，可以在参数列表的第一项声明 `this` 的类型，否则 `this` 为 `any`，并不安全

```ts twoslash
// @errors: 2684 2345
function helloDate(this: Date, greet: string) {
  return greet + this.getDate();
}

// error
helloDate('hello');
helloDate.call({}, "hello");

// correct
helloDate.call(new Date(), "hello");
```

函数类型有两种声明方式，分别为简写和完整形式

```ts twoslash
// The following two declare are the same
type LogA = (message: string) => void;
type LogB = {
  (message: string): void;
};
```

函数类型的完整声明可以用来进行函数的重载

```ts twoslash
type Print = {
  (message: string): void;
  (message: string, suffix: number): number;
  (prefix: number, message: string, suffix: number): number;
};
```

可以在函数声明时对函数进行重载

```ts twoslash
function foo(message: "a"): Date;
function foo(message: "b"): number;
function foo(name: "c"): string;
function foo(message: string): any {
  return message;
}
```

使用完整的函数类型声明可以给函数对象添加属性

```ts twoslash
type FooFn = {
  (message: string): void;
  bar: number;
};
```

泛型

```ts twoslash
// A example for filter function
type Filter = {
  <T>(array: T[], f: (item: T) => boolean): T[];
};
type AnotherFilter = <T>(array: T[], f: (item: T) => boolean) => T[];
```

使用 `T extends Type` 的方式可以声明受限的泛型
在下面的 `mapNode` 函数声明中，如果仅使用 `T`，则无法从 `node` 中安全读取 `value` 属性，
若使用 `TreeNode` 不使用泛型，则返回值会丢失类型信息，统统为 `TreeNode` 类型

```ts twoslash
type TreeNode = {
  value: string;
};
type LeafNode = TreeNode & {
  isLeaf: true;
};
type InnerNode = TreeNode & {
  children: [TreeNode] | [TreeNode, TreeNode];
};

function mapNode<T extends TreeNode>(node: T, f: (value: string) => string) {
  return {
    ...node,
    value: f(node.value),
  };
}

const fooNode: LeafNode = {
  value: "foo",
  isLeaf: true,
};
// resultNode 的类型为 typeof fooNode & { value: string }
const resultNode = mapNode(fooNode, (value) => value.slice(1));
```

模拟变长参数（Exercise 4）

```ts twoslash
function call<T extends [unknown, string, ...unknown[]], R>(
  f: (...args: T) => R,
  ...args: T
) {
  return f(...args);
}
function fill<T>(length: number, value: T) {
  return Array.from({ length }, () => value);
}
const fillArr = call(fill, 10, "");
```

泛型可以有默认类型。类似于函数的可选参数，有默认类型的泛型需要放在没有默认类型的泛型后面

```ts twoslash
type MyEvent<Target extends HTMLElement = HTMLElement, Type = string> = {
  target: Target;
  type: Type;
};
let myEvent: MyEvent<HTMLBodyElement> = {
  target: <HTMLBodyElement>document.body,
  type: "click",
};
```

Exercise 5

```ts twoslash
// @errors: 2345
type Is = <T>(valueA: T, valueB: T) => boolean;
const is: Is = (a, b) => {
  return a === b;
};
const equal = is("a", "b");
const equal2 = is(1, 2);
const err = is("1", 2);

type MultiplyIs = <T>(...args: T[]) => boolean;
const multiplyIs: MultiplyIs = (...args) => {
  for (let i = 1, len = args.length; i < len; i++) {
    if (args[i] !== args[i - 1]) {
      return false;
    }
  }
  return true;
  // 另一种不好读的方式
  // args.reduce((accumulator, current, index) => {
  //   if (index !== 0 && current !== args[index - 1]) {
  //     return false;
  //   }
  //   return accumulator;
  // }, true)
};

const mEqual = multiplyIs([1], "", [1, 2, 3]);
```
