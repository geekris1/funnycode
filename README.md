# funnycode

[![NPM version](https://badge.fury.io/js/funnycode.png)](https://www.npmjs.com/package/funnycode)

一个让你的代码变得不可读的库。

## 🤔️ Why

出于某些原因，你会希望你的代码变得不可读，所以你会用到它的。

## 🚀 Features

- 支持`js`,`ts`,`cjs`,`mjs`
- 操作是可逆的(当然你需要操作时所使用的 key)

## 🔧 Usage

### Install

```ball
pnpm add -D funnycode
```

### Add `package.json`

```javascript
{
  "scripts":{
   	"funnycode":"funnycode"
  }
}
```

### Add key

在根目录新建一个`.funnycode`文件，并在里面直接输入你要设置的 key

> tip: 记得将 .funnycode 添加到 .gitignore 中

如果你不想添加文件，你可以通过对应的命令输入 key

```
funnycode -k <你的key>
```

或者

```
funnycode -key <你的key>
```

### Config funnycode.config.{js,ts,cjs,mjs}

- entry
  - 是否必须 : 是
  - 类型 : 数组
  - 描述 : 需要进行编译的文件

```javascript
module.exports = {
  // 文件夹 会处理文件内所有js,ts,cjs,mjs文件
  entry: ["./src"],
};
```

```javascript
module.exports = {
  // 处理单个文件
  entry: ["./src/index.js"],
};
```

```javascript
module.exports = {
  // 也可以这样 请确保后缀是js文件
  entry: ["./src/**/*.{js,ts,cjs,mjs}"],
};
```

### Use encode

如果你配置了`.funnycode`和`funnycode.config`

```bash
pnpm funnycode encode
```

如果你配置了`.funnycode`

```bash
pnpm funnycode encode ./src
```

如果你配置`funnycode.config`

```bash
pnpm funnucode encode -k <你的key>
```

如果你没有任何配置

```bash
pnpm funnucode encode ./src -k <你的key>
```

### Use decode

如果你配置了`.funnycode`和`funnycode.config`

```bash
pnpm funnycode decode
```

如果你配置了`.funnycode`

```bash
pnpm funnycode decode ./src
```

如果你配置`funnycode.config`

```bash
pnpm funnucode decode -k <你的key>
```

如果你没有任何配置

```bash
pnpm funnucode decode ./src -k <你的key>
```

## 🐼 Author

[geekris1](https://github.com/geekris1)
