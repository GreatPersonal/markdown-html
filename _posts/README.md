# 利用jenkins持续集成构建electron桌面应用

---

# [关于 Electron](https://electronjs.org/docs/tutorial/about#关于-electron)

* [Electron](https://electronjs.org/)是由Github开发，用HTML，CSS和JavaScript来构建跨平台桌面应用程序的一个开源库。 Electron通过将[Chromium](https://www.chromium.org/Home)和[Node.js](https://nodejs.org/)合并到同一个运行时环境中，并将其打包为Mac，Windows和Linux系统下的应用来实现这一目的。

  Electron于2013年作为构建Github上可编程的文本编辑器[Atom](https://atom.io/)的框架而被开发出来。这两个项目在2014春季开源。

  目前它已成为开源开发者、初创企业和老牌公司常用的开发工具。官网[看看谁在使用Electron](https://electronjs.org/apps)。

  继续往下阅读可以了解Electron的贡献者们和已经发布的版本，或者直接阅读官网的[快速开始指引](https://electronjs.org/docs/tutorial/quick-start)来开始用Electron来构建应用。

## [核心理念](https://electronjs.org/docs/tutorial/about#核心理念)

* 为了保持Electron的小 \(文件体积\) 和可持续性 \(依赖和API的扩展\) ，Electron限制了使用的核心项目的范围。比如Electron只用了Chromium的渲染库而不是全部。 这使得容易升级Chromium，但也意味着Electron缺少Google Chrome里的一些浏览器特性。

* Electron所添加的的新特性应主要用于原生API。 如果一个特性能够成为一个Node.js模块，那它就应该成为。 参见[社区构建的Electron工具](https://electronjs.org/community)。

# [Electron 版本管理](https://electronjs.org/docs/tutorial/electron-versioning#electron-版本管理)

> 详细查看我们的版本控制策略和实现。

从版本 2.0.0, Electron遵循[semver](https://electronjs.org/docs/tutorial/electron-versioning#semver)。以下命令将安装Electron最新稳定的版本:

```
npm install --save-dev electron
```

现有项目更新到最新的稳定版本:

```
npm install --save-dev electron@latest
```

# 构建前准备

> 构建electron应用依赖于nodeJs，所以我们在构建之前需要在本地安装nodeJs.下面介绍一下nodeJs的安装配置和使用Node.js

# Node 使用介绍

简单的说 Node.js 就是运行在服务端的 JavaScript。

Node.js 是一个基于Chrome JavaScript 运行时建立的一个平台。

Node.js是一个事件驱动I/O服务端JavaScript环境，基于Google的V8引擎，V8引擎执行Javascript的速度非常快，性能非常好。

> node的具体使用方法详见官网：[http://nodejs.cn/api/](http://nodejs.cn/api/)

Node.js安装包及源码下载地址为：[http://nodejs.cn/download/](http://nodejs.cn/download/)

```
检测PATH环境变量是否配置了Node.js，点击开始=》运行=》输入"cmd" => 输入命令"path"，输出结果找到这一行：
```

```
PATH=C:\Program Files\nodejs\;
```

我们可以看到环境变量中已经包含了：

```
C:\ProgramFiles\nodejs\
```

安装成功，我们可以在命令行使用node命令了，例如：

> node -v    //检查node安装版本号，看到版本号说明node安装成功

![](/assets/lALPBbCc1U9LQZwSzQEW_278_18.png)

node依赖于npm包，所以npm也需要在本地安装，下面介绍一下npm包管理器的使用和安装:

# NPM 使用介绍

NPM是随同NodeJS一起安装的包管理工具，能解决NodeJS代码部署上的很多问题，常见的使用场景有以下几种：

* 允许用户从NPM服务器下载别人编写的第三方包到本地使用。
* 允许用户从NPM服务器下载并安装别人编写的命令行程序到本地使用。
* 允许用户将自己编写的包或命令行程序上传到NPM服务器供别人使用。

由于新版的nodejs已经集成了npm，所以之前npm也一并安装好了。同样可以通过输入**"npm -v"**来测试是否成功安装。命令如下，出现版本提示表示安装成功:

```
$ npm -v

2.3.0
```

如果是 Window 系统使用以下命令全局安装即可：

```
npm install npm -g
```

> 使用淘宝镜像的命令：

```
cnpm install npm -g
```

> 在官网上我们可以查找我们项目中用到的依赖包，使用以下命令安装：

```
npm install 包名
```

> 在一个项目中会生成一个node\_modules的文件夹，所有的依赖包下载都会在这个目录里，还有就是在我们上传代码到源码管理仓库时，会把node\_modules 写入到ignore,只需要写入到项目的package.json配置中dependencies中，我们不需要手动写入，只要在安装依赖包时的命令中加入--save,在包安装 时就会自动写入依赖项。

```
npm install 包名 --save
```

还可以在npm上开源自己写的代码，支持各种语言，具体使用方法，详见官网：[https://www.npmjs.com/](https://www.npmjs.com/)

# Electron

* Electron 提供了一个能通过 JavaScript 和 HTML 创建桌面应用的平台，同时集成 Node 来授予网页访问底层系统的权限。

## 程序入口

* 在 Electron 中，入口是一个 JavaScript 脚本。 不同于直接提供一个URL，你需要手动创建一个浏览器窗口，然后通过 API 加载 HTML 文件。 你还可以监听窗口事件，决定何时让应用退出。

* Electron的工作方式更像nodeJS运行，比如下面这个结构树：

```
electron/resources/app
├── package.json
├── ignore    
├── Resources
|   └── index.html
├── main.js
├── menu.js
└── render.js
```

main.js就是起动窗口的入口文件，Resources作为项目结构用前端框架时比如vue,react,angular,结构和外层的electron差不多，因为这几个框架也是基于node开发的，当然这里也可以写普通的html+css+javascript,package.json是electron的配置项及依赖包，render.js是作为渲染进程，和web结构的路由一样，调用nodejs API还有事件的触发机制，都可以写在里面，main.js是主进程，根据项目的结构调整结构树,。

## ** 构建系统（用node调用chromium原生API完成构建）**

* 为了避免构建整个 Chromium 带来的复杂度，Electron 通过[`libchromiumcontent`](https://github.com/electron/libchromiumcontent)来访问 Chromium 的 Content API。`libchromiumcontent`是一个独立的、引入了 Chromium Content 模块及其所有依赖的共享库。 用户不需要一个强劲的机器来构建 Electron。

## **Node 集成**

* 在 Electron 中，通过各个平台的消息循环与 libuv 的循环集成，避免了直接在 Chromium 上做改动。 可以查看[`node_bindings`](https://github.com/electron/electron/tree/master/atom/common)

  来了解这是如何完成的。当然有兴趣的也可以尝试chromium开发

# [代码规范](https://electronjs.org/docs/development/coding-style#代码规范)

* 这些是 Electron 编码风格指南。

* 您可以运行`npm run lint`来显示`cpplint`和`eslint`检测到的任何样式问题。

## [JavaScript](https://electronjs.org/docs/development/coding-style#javascript)

* 也可以使用“use strict”,"USE STRICT"是es5的严格模式，可以更好的将错误检测引入代码的方法。顾名思义，使得JS在更严格的条件下运行。举个例子：

* ```
  变量必须先声明，再使用
  function test(){
    "use strict";
    foo = 'bar';  // Error
  }

  不能对变量执行delete操作
  var foo = "test";
  function test(){}

  delete foo; // Error
  delete test; // Error

  function test2(arg) {
      delete arg; // Error
  }
  对象的属性名不能重复
  { foo: true, foo: false } // Error

  禁用eval()

  函数的arguments参数
  setTimeout(function later(){
    // do stuff...
    setTimeout( later, 1000 );
  }, 1000 );

  禁用with(){}

  不能修改arguments
  不能在函数内定义arguments变量
  不能使用arugment.caller和argument.callee。因此如果你要引用匿名函数，需要对匿名函数命名。
  ```

## [JavaScript](https://electronjs.org/docs/development/coding-style#javascript) {#javascript}

* 书写[标准](http://npm.im/standard)JavaScript 样式
* 文件名应使用`-`连接而不是`_`, 例如.`file-name.js`而不是`file_name.js`, 因为在[github/atom](https://github.com/github/atom)中模块名通常是`module-name`形式. 此规则仅适用于`.js`文件。
* 酌情使用更新的 ES6 / ES2015 语法

  * [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
    用于需要的和其他的常数
  * [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
    用于定义变量
  * [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
    代替`function () { }`
  * [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
    而不是使用字符串连接符`+`

## [命名相关](https://electronjs.org/docs/development/coding-style#命名相关)

Electron API 使用与 Node.js 相同的大小写方案：

* 当模块本身是类时, 比如`BrowserWindow`, 使用`CamelCase`.
* 当模块是一组 API 时, 比如`globalShortcut`, 使用`mixedCase`.
* 当 API 是对象的属性时, 并且它复杂到足以成为一个单独的块, 比如`win.webContents`, 使用`mixedCase`.
* 对于其他非模块API, 使用自然标题, 比如`<webview> Tag`或`Process Object`.

当创建新的 API 时， 最好使用 getter 和 setter 而不是 jQuery 的一次性函数。 举个例子,`.getText()`和`.setText(text)`优于`.text([text])`. 理解语义化的重要性，这是一些相关的[讨论](https://github.com/electron/electron/issues/46)

[源代码的目录结构](https://electronjs.org/docs/development/source-code-directory-structure#源代码的目录结构)

      Electron
      ├── atom/ - C++ 源代码.
      |   ├── app/ - 系统入口代码.
      |   ├── browser/ - 包含了主窗口,UI和所有主
      |   |   进程相关的东西. 它会告诉渲染进程如何管理页面.
      |   |   ├── ui/ - 不同平台上 UI 部分的实现.
      |   |   |   ├── cocoa/ - Cocoa 部分的源代码.
      |   |   |   ├── win/ - Windows GUI 部分的源代码.
      |   |   |   └── x/ - X11 部分的源代码.
      |   |   ├── api/ - 主进程 API 的实现.
      |   |   ├── net/ - 网络相关的代码.
      |   |   ├── mac/ - 与 Mac 有关的 Objective-C 代码.
      |   |   └── resources/ - 图标，平台相关的文件等.
      |   ├── renderer/ - 运行在渲染进程中的代码.
      |   |   └── api/ - 渲染进程 API 的实现.
      |   └── common/ - 同时被主进程和渲染进程用到的代码,
      |       包括了一些用来将 node 的事件循环整合到 Chromium 的
      |       事件循环中时用到的工具函数和代码.
      |       └── api/ - 同时被主进程和渲染进程使用到的 API 的实现
      |           以及 Electron 内置模块的基础设施.
      ├── chromium_src/ - Source code copied from Chromium. See below.
      ├── default_app/ - 在没有提供应用程序的情况下
      |   启动 Electron 的默认页面.
      ├── docs/ - 文档.
      ├── lib/ - JavaScript 源代码.
      |   ├── browser/ - Javascript 主进程初始化代码.
      |   |   └── api/ - Javascript API 实现.
      |   ├── common/ - 主进程和渲染器进程使用的 JavaScript.
      |   |   └── api/ - Javascript API 实现.
      |   └── renderer/ - Javascript 渲染器进程初始化代码.
      |       └── api/ - Javascript API 实现.
      ├── spec/ - 自动化测试.
      ├── electron.gyp - Electron 的构建规则.
      └── common.gypi - 为诸如 `node` 和 `breakpad` 等其它
          组件准备的编译设置和构建规则.

## ![](/assets/diagram.png)

## [其它目录的结构](https://electronjs.org/docs/development/source-code-directory-structure#其它目录的结构)

* **script**
  * 用于诸如构建、打包、测试等开发用途的脚本等.
* **tools**
  * 在 gyp 文件中用到的工具脚本，但与`script`目录不同，该目录中的脚本不应该被用户直接调用.
* **vendor**
  * 第三方依赖项的源代码，为了防止人们将它与 Chromium 源码中的同名目录相混淆，在这里我们不使用`third_party`作为目录名.
* **node\_modules**
  * 在构建中用到的第三方 node 模块.
* **out**
  -`ninja`的临时输出目录.
* **dist**
  * 由脚本`script/create-dist.py`创建的临时发布目录.
* **external\_binaries**
  * 下载的不支持通过`gyp`构建的预编译第三方框架.

## [让 Git 子模块保持最新](https://electronjs.org/docs/development/source-code-directory-structure#让-git-子模块保持最新)

Electron信息库有一些被提供的依赖, 在[/vendor](https://github.com/electron/electron/tree/master/vendor)目录中可以找到. 运行`git status`时，偶尔会看到这样的消息：

```
git status
    modified:   vendor/libchromiumcontent (new commits)
    modified:   vendor/node (new commits)
```

要更新这些被提供的依赖关系，运行以下命令：

```
git submodule update --init --recursive
```

如果觉得自己经常运行此命令, 你可以在`~/.gitconfig`文件中创建一个别名:

```
[alias]su = submodule update --init --recursive
```

介绍了这么多的东西，开始进入题目内容了，利用jenkins-ci构建打包electrony应用程序：

# 构建

## 构建目的

* 快速集成，自动打包，热更新

* electron本质就是Chrome浏览器的壳子，展示内容使用web框架,就是html+css+js

## 构建工具

jenkins持续集成、官方提供的api、electron-packger或者其他第三方打包工具（这里打包的时候注意，坑很多，动不动就会报错，打包工具大家可以找找，这里举例用electron-packger，尽量把安装包压缩的小一点）、webpack

## 构建方法

* 使用sh命令在jenkins中ci构建

* create build.sh\\(所有构建方式通过build.sh\\)

* 在package.json里的script里create npm construct运行build.sh\\(这个命令会配置在jenkins构建命令中\\),也可以直接使用

* 在构建之前请用yarn安装web项目的node依赖包，因为用npm会下载包的隐藏文件，打包时electron会把隐藏文件和没有依赖 的文件也打包起来，会让最后打包的文件很大，electron本身打的包已经很大了，操作时记住这一点

### 具体操作如下：

* 项目构建时使用webpack/grunt或者其他打包工具（建议使用webpack）将前端web层打包

* electron应用层打包，electron支持多平台应用包打包，在package.json中配置打包命令，可以同时打包多个平台的应用包，这里使用electron-packager打包，打包配置中只打包web层打包好的dist，打包成功之后会在目录下生成一个out文件夹，里面放的就是打包好各平台的应用文件

* 运行打包命令之前先清理构建文件

```
             npm run clean
```

```
             npm run clean-build
```

\\*注意: 两个清理命令都需要在构建之前再次运行引导

#### 构建开始，构建信息在jenkins控制台输出中查看（Console Output）

#### 构建成功之后，可以将out文件夹里打包好的安装包用sh命令或者ftp或者ssh放到指定的路径，这一操作

#### 命令在jenkins构建后操作执行。

# electron更新机制

```
文档持续更新中………
```

electron详情、api文档请至官网查询：[https://electronjs.org/docs](https://electronjs.org/docs)

W3C的教程更好理解一些：[https://www.w3cschool.cn/electronmanual/l52g1qyy.html](https://www.w3cschool.cn/electronmanual/l52g1qyy.html)

