# funnycode

<p align="center">
<img height="150" src="https://user-images.githubusercontent.com/35247521/184304011-6159b7bd-1b26-4e7c-8f94-1354378503ca.png" alt="funnycode">
</p>



[![NPM version](https://img.shields.io/npm/v/funnycode?color=3fb883)](https://www.npmjs.com/package/funnycode)

一个让你的代码变得不可读的库。

## 🤔️ Why

出于某些原因，你会希望你的代码变得不可读，所以你会用到它的。

## 🚀 Features

- 支持`js`,`ts`,`cjs`,`mjs`
- 操作是可逆的(当然你需要操作时所使用的 key)
- 混淆后代码是可执行的

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
pnpm funnycode encode -k <你的key>
```

如果你没有任何配置

```bash
pnpm funnycode encode ./src -k <你的key>
```

### Use decode

同上，只需要把`encode`改成`decode`


## 🐼 Author

[geekris1](https://github.com/geekris1)



## 📖 Template

模板来自于 [starter-ts](https://github.com/geekris1/starter-ts)

