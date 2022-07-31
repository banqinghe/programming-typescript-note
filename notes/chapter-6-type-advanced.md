# Chapter 6: 类型进阶

类型拓宽

初始化为 `null` 和 `undefined` 的变量类型被扩展为 `any`，但是离开作用域后会被分配一个具体的类型

```ts twoslash
function popA() {
  let a = null;
  a = "1";
  return a; // any
}
let a = popA(); // string
```

`as const` 可以阻止类型拓宽并且递归将成员设为 `readonly`

```ts twoslash
let ordinaryObj = { x: 3 };
let constObj = { x: 3 } as const;
```

赋值时 TypeScript 会对 fresh object literal type 进行多余属性检查

```ts twoslash
// @errors: 2322
type Person = {
  name: string;
};
let p1: Person = { name: "1", age: 1 }; // error
let p2 = { name: "2", age: 2 };
let p3: Person = p2; // assign success, 变量不再 fresh 了
```

并集类型的成员可能重复，所以 TypeScript 需要更精确的明确并集类型的方式

```ts twoslash
type UserTextEvent = { value: string; target: HTMLInputElement };
type UserMouseEvent = { value: number; target: HTMLDivElement };
type UserEvent = UserTextEvent | UserMouseEvent;

// value 类型被细化了，但是 event 类型并没有，比如传入了
// { value: string; target: HTMLInputElement | HTMLDivElement }，
// 依然属于 UserEvent 类型，但是 Event 类型却并不是 UserTextEvent
function handleUserEvent(event: UserEvent) {
  if (typeof event.value === "string") {
    event;
    event.value;
    event.target;
  } else {
    event;
    event.value;
    event.target;
  }
}
```

加入明确的字面量可以解决这个问题

```ts twoslash
type UserTextEventWithType = {
  type: "text";
  value: string;
  target: HTMLInputElement;
};
type UserMouseEventWithType = {
  type: "mouse";
  value: number;
  target: HTMLDivElement;
};
type UserEventWithType = UserTextEventWithType | UserMouseEventWithType;

function handleUserEventWithType(event: UserEventWithType) {
  // 两个分支中的类型明确了
  if (event.type === "text") {
    event;
    event.value;
    event.target;
  } else {
    event;
    event.value;
    event.target;
  }
}
```

键入运算符：`type newType = TYPE[key]`

```twoslash include keyof
type APIResponse = {
  user: {
    userId: number;
    name: string;
    friendList: {
      count: number;
      friends: { name: string }[];
    };
  };
};
```

```ts twoslash
// @include: keyof
// friendList 的类型可以从 APIResponse 类型中使用键入运算符获取
function showFriendList(friendList: APIResponse["user"]["friendList"]) {
  friendList.friends.forEach((friend) => {
    console.log(friend.name);
  });
}
```

`keyof` 运算符获取对象所有键的类型，合并为一个字符串字面量类型

```ts twoslash
// @include: keyof
// ---cut---
type ResponseKey = keyof APIResponse["user"]; // "userId" | "name" | "friendList"
```

利用 `keyof` 实现一个类型安全的读值函数

```ts twoslash
function get<O extends object, K extends keyof O>(obj: O, key: K) {
  return obj[key];
}

const personInfo = {
  name: "banqinghe",
  age: 18,
  friends: [{ name: "banqinghe", age: 18 }],
};

let friendName = get(personInfo, 'friends');
```

`Record` 类型，用于描述有映射关系的对象

- 常规的索引签名，键只能约束为 `string`、`number` 或 `symbol`
- `Record`，对象的键还可以被约束为 `string` 和 `number` 的子类型

映射类型是一种比 Record 更强大的映射类型，Record 类型实际上就是用映射类型实现的。

```ts twoslash
// @errors: 2339
type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
type Day = Weekday | 'Sat' | 'Sun';

// Without Record：无法指定 Weekday → Day 的映射
const nextDayWithoutRecord = {
  Mon: 'Tue',
};
nextDayWithoutRecord.Tue; // 使用时才会发现错误

// With Record
const nextDayWithRecord: Record<Weekday, Day> = {
  Mon: 'Tue',
  Tue: 'Wed',
  Wed: 'Thu',
  Thu: 'Fri',
  Fri: 'Sat',
};

// With Mapped Type
const nextDayWithMappedType: { [K in Weekday]: Day } = {
  Mon: 'Tue',
  Tue: 'Wed',
  Wed: 'Thu',
  Thu: 'Fri',
  Fri: 'Sat',
};
```

使用映射类型实现 `Record`：

```ts
// keyof any 的返回为 string | number | symbol
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

映射类型结合 keyof 可以实现约束特定键对应值的类型。

特殊的类型运算符 `-`（减号），只能在映射类型中使用。可以将可选（?）或只读（readonly）状态去除。

与 `-` 对应的运算符 `+`，一般不直接使用，因为其一般蕴含在别的运算符中。

- `+readonly` 等效于 `readonly`
- `+?` 等效于 `?`

```twoslash include account
type Account = {
  id: number;
  isEmployee: boolean;
  notes: string[];
};
```

```ts twoslash
// @include: account
// 所有字段可选
type OptionalAccount = {
  [K in keyof Account]?: Account[K];
};

type RequiredAccount = {
  [K in keyof OptionalAccount]-?: Account[K];
};

type ReadonlyAccount = {
  readonly [K in keyof Account]: Account[K];
};

type WritableAccount = {
  -readonly [K in keyof ReadonlyAccount]: Account[K];
};

// 其他 case（所有字段可为 null、只读…… 见 P168）
```

映射类型很好用，所以 TypeScript 内置了一些类型，用来描述常见的映射类型

- `Record<Keys, Values>`
- `Partial<Object>`：将 `Object` 中每个属性都置为可选
- `Required<Object>`：将 `Object` 中每个属性都置为必须
- `Readonly<Object>`：将 `Object` 中的每个属性都置为只读
- `Pick<Object, Keys>`：返回只含指定 `Keys` 的子类型
- `Omit<Object, Keys>`: 返回不含指定 `Keys` 的子类型（实现使用了 `Exclude`）

（学习一下这些映射类型的实现）

```ts twoslash
// @include: account
// ---cut---
type OptionalAccount2 = Partial<Account>;
type RequiredAccount2 = Required<OptionalAccount2>;
type ReadonlyAccount2 = Readonly<Account>;
type PickAccount = Pick<Account, 'id' | 'isEmployee'>;
type OmitAccount = Omit<Account, 'id'>;
```

伴生对象模式，即将同名的对象和类放配对在一起。TypeScript 中可以实现类似的模式，因为 TypeScript 中值和类型处于不同
的命名空间中，所以可以做到将同名对象和类型放在一起。

Tips：若一个 ts 文件中既 export type 又 export 变量，并且二者同名，`import { type } from './file'` 的时候会同时将二者导入。

将数组推导为元组的方法：

1. as const
2. 利用剩余参数类型

```ts twoslash
function tuple<T extends unknown[]>(...args: T): T {
  return args;
}

const tuple0 = [1, '2', true]; // (number | string | boolean)[]
const tuple1 = tuple(1, '2', true); // [number, string, boolean]
```

细化类型只在当前作用域中有效，不会转移到其他作用域。这就导致下面的 parseInt 函数依然无法得知 isString(input) 返回的是 true 还是 false。

当**函数细化了参数类型**且**返回值为 boolean 时**，可以使用 is 操作符使类型细化能在作用域之间转移。这一特性的使用场景较少。

```ts twoslash
// @errors: 2339
function isString(input: unknown): input is string {
  return typeof input === 'string';
}
function parseInput<T>(input: string | number) {
  if (isString(input)) {
    return input.toUpperCase();
  } else {
    return input;
  }
}
// 我自己还有一个问题是，怎么才能推导出 parseInput 返回的类型呢？
const resParse = parseInput(1); // string | number
```

条件类型，形如 `T extends string ? true : false`。可以认为是类型层面的三元表达式

条件类型遵从分配律，也可以说具有分配性质，即： `(string | number) extends T ? A : B` 等价于 `(string extends T) ? A : B | (number extends T) ? A : B`

根据分配性质，下面的 `ToArray` 类型可以对并集类型的数组进行分配：

```ts twoslash
type ToArray<T> = T extends unknown ? T[] : T[];
type A = ToArray<number>;
type B = ToArray<number | string | boolean>;
```

利用分配性质，也可以用于实现一个 `Without` 类型，`Without<T, U>` 即为 `T` 中不含 `U` 类型的类型。

```ts twoslash
type Without<T, U> = T extends U ? never : T;
type NoAB = Without<'a' | 'b' | 'c', 'a'>; // 'b' | 'c'
```

上面的 NoAB 的运算过程：

```ts
type NoAB = Without<'a' | 'b' | 'c', 'a'>; // 'b' | 'c'
          = Without<'a', 'a'> | Without<'b', 'a'> | Without<'c', 'a'>;
          = never | 'b' | 'c'
          = 'b' | 'c'
```

P177 中说如果没有分配类型，上面的 `NoAB` 类型就会是 `never` 了。但是我自己感觉不应该还是 `'a' | 'b' | 'c'` 吗？因为 `'a' | 'b' | 'c'` 整体是不能赋值给 `'a'` 的，所以返回的是三元表达式的右分支。

下面的 `ElementType` 可以用于提取数组元素的类型：

```ts twoslash
type ElementType<T> = T extends unknown[] ? T[number] : T;
type E = ElementType<number[]>;
```

`[number]` 可以用来提取数组的元素类型，因为数组在这里和对象是一样的结构。

```ts twoslash
type Bool = boolean[][number];
```

除了可以在尖括号里声明泛型变量（如 `<T>`），也可以在条件类型中使用 `infer` 关键字声明。

上文中的 `ElementType` 类型可以使用 `infer` 关键字重写：

```ts twoslash
type ElementType2<T> = T extends (infer U)[] ? U : T;
type E2 = ElementType2<boolean[]>;
```

可以看出，`infer` 的作用是条件类型中类型推导的结果。

另一个例子：

```ts twoslash
type SecondArg<F> = F extends (a: any, b: infer B) => any ? B : never;
type F = typeof Array['prototype']['slice'];
// 得到了 Array.prototype.slice 的第二个参数类型
type Arg2 = SecondArg<F>;
```

内置的条件类型（记得学习一下实现，都不难）：

- `Exclude<T, U>`：计算在 `T` 中而不在 `U` 中的类型
  
  ```ts twoslash
  type EXC = Exclude<boolean | number, number>;
  ```

- `Extract<T, U>`：计算在 `T` 可以赋值给 `U` 的类型，具体实现就是和 `Exclude` 的条件分支反过来

  ```ts twoslash
  type EXT = Extract<boolean | number | string, string | number>;
  ```

- `NonNullable<T>`：从 `T` 中去除 `null` 和 `undefined`，`undefined extends null` 是成立的。实现就是用的 `extends null` 条件类型。

  ```ts twoslash
  type NON = NonNullable<string | null | number | undefined>;
  ```

- `ReturnType<T>`：获取函数返回值类型（对泛型和重载的函数无效）

  ```ts twoslash
  type RET = ReturnType<() => string>;
  ```

- `InstanceType<T>`：获取构造函数的实例类型，其实就是获取构造函数的返回值类型，使用 abstract new 做函数类型前缀判断是不是构造函数（看起来是这样）

  ```ts twoslash
  // type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any
  type INST_ARR = InstanceType<typeof Array>;
  type INST_DATE = InstanceType<typeof Date>;
  ```

类型断言的两种方式：

1. `as`
2. <T> 前缀，比如有时候会遇到这样的写法：`const canvas = <HTMLCanvasElement> document.getElementById('#canvas');`

尖括号前缀是旧语法，推荐使用 `as` 操作符。

非空断言：`Something!` 表示确定 `Something` 是非空的。
明确赋值断言：`let userId!: string;` 表示确定 `userId` 在使用时是已经被赋值的。

TypeScript 类型的不支持名义类型，即如果有两个类型声明 `type UserId = string`、`type CompanyId = string`，那么 `function get(id: UserId)` 也是能接受 `CompanyId` 类型的参数的。

一种解决的方式，名为类型烙印（type branding），即使用如下的类型声明：

```ts twoslash
// @errors: 2345
type UserId = string & { readonly brand: unique symbol };
type CompanyId = string & { readonly brand: unique symbol };
function UserId(id: string) {
  return id as UserId;
}
function CompanyId(id: string) {
  return id as CompanyId;
}
function getUserInfo(id: UserId) {}
getUserInfo(UserId('123'));
getUserInfo(CompanyId('123'));
```

使用 TypeScript 接口合并的特性可以扩展现有的接口，如为 Array 的原型添加新的方法。

```ts twoslash
interface Array<T> {
  zip<U>(list: U[]): [T, U][];
}

[1].zip<boolean>([true]);
```

在 tsconfig 文件中使用 `exclude` 将定义文件排除在外，这样就可以要求在开发过程中必须先 `import` 才能使用定义。（P189）

**Exercise 3**：计算不同时在 `T` 和 `U` 中的类型：

```ts twoslash
type Exclusive<T, U> = (T extends U ? never : T) | (U extends T ? never : U);
type ExclusiveNumber = Exclusive<1 | 2 | 3, 2 | 3 | 4>;

// 下面是更好的写法：
type Exclusive2<T, U> = Exclude<T, U> | Exclude<U, T>;
```

**Exercise 4**：将 6.6.3 中的示例改写成不用明确赋值断言（*Definite Assignment Assertions*）的形式

```ts
// 使用明确赋值断言
let userId!: string;
fetchUser();
userId.toUpperCase();

function fetchUser() {
  userId = localStorage.getItem('userId')!;
}
```

不用明确赋值断言的话，还是用 `fetchUser()` 的返回值赋值比较好：

```ts twoslash
let userId = fetchUser();
userId.toUpperCase();

function fetchUser() {
  return localStorage.getItem('userId')!;
}
```
