---
title: Vuepress源码学习
---

# Vuepress源码学习

## package.json

### ```npm run docs:dev```的原理？  

npm是node.js的**包管理器**模块，你可以在nodejs的```/根目录/node_modules/```下见到这个模块。  

npm提供了run命令，用于执行定义在```package.json```的npm脚本。    

当用户执行```run```命令时，npm 会查找当前项目的```package.json```文件中的```scripts```字段，并执行对应的脚本命令```docs:dev```。

> npm的命令文档：<https://docs.npmjs.com/cli/v10/commands/>  


### ```vuepress dev docs```的原理？  

在执行了```npm run docs:dev```后，

实质等于执行了```npm run vuepress dev docs```  

```vuepress```这个脚本在package.json中没定义，那这个命令是在哪定义、如何定义的呢？  

点开```项目根目录/node_modules/vuepress/package.json```可以看到，在bin属性处有```"vuepress": "cli.js"```  

这样在vuepress模块被全局安装到node.js时，会将```vuepress```命令也安装到系统路径中。  

当执行了```vuepress```命令时，实质是执行了```cli.js```这个NPM脚本。  




## cli.js

### cli.js做了什么工作？  

- ```checkEnv(pkg)```检查nodejs环境
- ```registerCoreCommands(cli, OPTIONS)```将@vuepress/core中的dev、build、eject方法注册到命令行中（最重要）



### ```#!/usr/bin/env node``` 的作用是什么？  

对于```#!/usr/bin/env node```，它告诉系统使用  env  程序来查找正确的解释器来执行脚本。 env  程序会搜索系统的  PATH  环境变量，以找到指定的解释器。


### ```update-notifier``` 模块有什么用？  

```update-notifier```是一个Node.js模块，用于检查包的可用更新并向用户显示通知，如果有更新可用的话。通过使用  update-notifier  模块，您可以轻松地在您的 Node.js 应用程序中实现更新通知功能。  


### ```process```为什么可以直接使用？  

process是Node.js中的一个全局变量，通常用于访问当前 Node.js 进程的相关信息和控制进程。  

常用方法：  
-  process.argv ：一个包含命令行参数的数组。
-  process.env ：一个包含环境变量的对象。
-  process.exit() ：退出当前进程。
-  process.cwd() ：返回当前工作目录的路径。
-  process.pid ：返回当前进程的 PID（进程 ID）。
-  process.on() ：用于监听各种进程事件，比如  exit 、 uncaughtException  等。

其他Node.js常见的全局变量：
- global
- require()
- module
- console
- __dirname
- __filename


## @vuepress/core/index.js

### 解释下```app.process()```方法

```
async process () {
    //1.负责网站配置及相对路径、主题模板、输出目录 & 页面、插件API等 的处理及初始化
    await this.resolveConfigAndInitialize()
    this.normalizeHeadTagUrls() //基于用户提供的base配置做处理
    this.themeAPI = loadTheme(this) //加载主题
    this.resolveTemplates() //dev及ssr的模板配置
    this.resolveGlobalLayout() //准备全局布局的配置

    //2.引入插件
    this.applyInternalPlugins() //将内部插件加入插件队列
    this.applyUserPlugins() //将用户配置插件加入插件队列
    this.pluginAPI.initialize() //按照插件队列顺序逐个执行applyPlugin

    //3.markdown相关
    this.markdown = createMarkdown(this) //按照配置创建markdown对象

    //4.源文件搜集
    await this.resolvePages() //找到源目录中所有文件，添加到pages数组中

    //5.插件执行，生成临时文件
    await this.pluginAPI.applyAsyncOption('additionalPages', this)
    await Promise.all(
      this.pluginAPI.getOption('additionalPages').appliedValues.map(async (options) => {
        await this.addPage(options)
      })
    )
    await this.pluginAPI.applyAsyncOption('ready')
    await Promise.all([
      this.pluginAPI.applyAsyncOption('clientDynamicModules', this),
      this.pluginAPI.applyAsyncOption('enhanceAppFiles', this),
      this.pluginAPI.applyAsyncOption('globalUIComponents', this)
    ])
  }
```