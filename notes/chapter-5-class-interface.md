# Chapter 5: 类和接口

关键词：

- `public` / `private` / `protected`
- `readonly`
- `abstract`

 ``` ts twoslash
class Piece {
  public position: { x: number; y: number };
  constructor(private readonly color: string) {
    this.position = { x: 0, y: 0 };
  }
}
const piece = new Piece("red");
```

`type` 和 `interface` 是同一概念的两种句法，但有细微区别（P114）

1. type 更通用，interface 则必须为结构
2. interface 扩展时会检查是否可赋值，type 则不会
3. 同一命名空间下的同名 interface 会合并，type 则会导致冲突

```ts twoslash
// @errors: 2430
type Char = "a" | "b" | "c";
// interface IChar = 'a' | 'b' | 'c';  -> error
interface InterfaceA {
  value: string;
}
// error
interface InterfaceB extends InterfaceA {
  value: number;
}
// 两个 InterfaceA 并不冲突，而是会合并
interface InterfaceA {
  name: string;
}
```

`interface` 也可以 `readonly`，但是不可以有 `public` / `private` / `protected` 修饰符

```ts twoslash
// @errors: 2540
interface Animal {
  readonly name: string;
}
const cat: Animal = { name: "cat" };
cat.name = "";
```

值和类型位于不同的命名空间中，不会冲突

```ts twoslash
let value = "1";
type value = string;
```

类声明会在类空间生成两个声明（P123）

1. 类的实例类型
2. 类的构造方法类型，`keyof` ClassName 获得

typeof 运算符还需要继续学习

```ts twoslash
type State = {
  [key: string]: string;
};

class StringDataBase {
  state: State = {};
  // get 无法推导出返回值可能是 null (why?)，手动声明返回值类型
  get(key: string): string | null {
    return this.state[key] || null;
  }
  set(key: string, value: string) {
    this.state[key] = value;
  }
  static from(state: State) {
    const db = new StringDataBase();
    db.state = state;
    return db;
  }
}
// type StringDataBaseType = typeof StringDataBase;
```

Exercise 4（GitHub 上的答案）:

4 . \[Hard\] As an exercise, think about how you might design a typesafe builder pattern.
Extend the Builder pattern Builder Pattern example from earlier in this chapter to:

4a. Guarantee at compile time that someone can’t call .send() before setting at least URL
and method. Would it be easier to make this guarantee if you also force the user to call
methods in a specific order? (Hint: what can you return instead of this?)

```ts twoslash
class RequestBuilder {
  protected data: object | null = null;
  protected method: "get" | "post" | null = null;
  protected url: string | null = null;

  setMethod(method: "get" | "post"): RequestBuilderWithMethod {
    return new RequestBuilderWithMethod().setMethod(method).setData(this.data);
  }
  setData(data: object | null): this {
    this.data = data;
    return this;
  }
}

class RequestBuilderWithMethod extends RequestBuilder {
  setMethod(method: "get" | "post" | null): this {
    this.method = method;
    return this;
  }
  setURL(url: string): RequestBuilderWithMethodAndURL {
    return new RequestBuilderWithMethodAndURL()
      .setMethod(this.method)
      .setURL(url)
      .setData(this.data);
  }
}

class RequestBuilderWithMethodAndURL extends RequestBuilderWithMethod {
  setURL(url: string): this {
    this.url = url;
    return this;
  }
  send() {
    // ...
  }
}

new RequestBuilder().setMethod("get").setData({}).setURL("foo.com").send();
```

4b. \[Harder\] How would you change your design if you wanted to make this guarantee, but still let people call methods in any order?

(This answer courtesy of @albertywu)

```ts twoslash
interface BuildableRequest {
  data?: object;
  method: "get" | "post";
  url: string;
}

class RequestBuilder2 {
  data?: object;
  method?: "get" | "post";
  url?: string;

  setData(data: object): this & Pick<BuildableRequest, "data"> {
    return Object.assign(this, { data });
  }

  setMethod(method: "get" | "post"): this & Pick<BuildableRequest, "method"> {
    return Object.assign(this, { method });
  }

  setURL(url: string): this & Pick<BuildableRequest, "url"> {
    return Object.assign(this, { url });
  }

  build(this: BuildableRequest) {
    return this;
  }
}

new RequestBuilder2()
  .setMethod("post") // Try removing me!
  .setURL("bar") // Try removing me!
  .setData({})
  .build();
```
