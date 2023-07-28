---
title: 搭建属于自己的博客
---

# 搭建属于自己的博客

## 概述

当前的博客是使用一个叫Vuepress的框架搭建的。  
Vuepress需要我们使用一种叫Markdown的格式去编写文章。  

> 类似的框架还有：mdbook、mkdocs、hexo等。熟悉搭建步骤后可以尝试使用不同的框架！

Markdown非常的强大，可以自动排版，用户可以在Markdown中插入表格、图片、链接、数学公式等。

搭建博客前，你需要对以下内容有一定理解：  
* Markdown
* Node.js
* Github
* Github Pages

当然，也可以跟着本教程，逐步了解上面的知识！  



## 安装node.js

略

## 初始化项目

1.新建一个文件夹，名称自拟。文件夹名就等于你的项目名。这里我的项目名为note  
之后进入该文件夹。
```bash
mkdir note && cd note
```

2.将该项目变为一个nodejs项目
```bash
npm init -y
```

执行完后，会看到文件夹里多了一个package.json文件。内容如下：
```json
{
  "name": "note",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}

```

3.安装vuepress到项目里
```bash
npm install vuepress --save
```

安装完后，可以见到package.json里多了依赖包的信息：
```json
{
    "dependencies": {
        "vuepress": "^1.9.9"
    }
}
```

4.在package.json添加构建&启动脚本
```json
{
  "scripts": {
    "docs:dev": "set NODE_OPTIONS=--openssl-legacy-provider & vuepress dev docs",
    "docs:build": "set NODE_OPTIONS=--openssl-legacy-provider & vuepress build docs"
  }
}
```

5.在根目录下创建docs文件夹及里面的内容，现时的文档结构如下：
```
note（根目录）
└—docs 
  └——.vuepress 
    ├———— public         # 放静态资源（图片）
    └———— config.js       # vuepress配置文件   
  └——README.md          # 主页      
├—node_modules
├—package.json
└—package-lock.json
```

6.config.js中，添加配置
```javascript
module.exports = {
  title: 'Hello VuePress',
  description: 'Just playing around',
  base: '/note/',  //基础路径。如果是要部署在xxxx.github.io/<项目名称>下，就需要这个配置；否则可以注释掉。
  themeConfig: {
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Guide', link: '/guide/' },
        { text: 'External', link: 'https://google.com' },
      ]
  }
}
```

7.将docs/README.md设置为主页，往里面添加以下内容
```markdown
---
home: true
heroImage: /hero.jpg
heroText: 笔记本
tagline:  数学、编程
actionText: 快速上手 →
actionLink: /zh/guide/
features:
- title: 简洁至上
  details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
- title: Vue驱动
  details: 享受 Vue + webpack 的开发体验，在 Markdown 中使用 Vue 组件，同时可以使用 Vue 来开发自定义主题。
- title: 高性能
  details: VuePress 为每个页面预渲染生成静态的 HTML，同时在页面被加载的时候，将作为 SPA 运行。
  footer: MIT Licensed | Copyright © 2018-present Evan You
---
```

## 在本地启动项目


8.执行命令“npm run docs:dev”，启动项目，测试一下。

见到success...字眼，证明启动成功。打开浏览器，通过localhost:8080/<项目名称> 访问项目


9.往docs/public中添加你喜欢的一张图片/头像，并命名为hero.jpg，再刷新一下页面。


成功后结果如下：  
![IMG20230719-173036752.png](/note/images/IMG20230719-173036752.png)

> 至此，项目已经可以成功启动了。下面我们再看看如何通过Github Action将项目托管到Github，不用总是在自己的电脑运行着。



## 在Github中部署你的博客

10.安装Git

略


11.在根目录创建.github/workflows目录，在里面创建CI.yml文件（名称任意命名，但后缀一定要.yml）
```
.github
  - workflows
    CI.yml  
```

12.CI.yml文件内容如下：
```yaml
name: A TO A:GH_PAGES
on: [push]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@master

      - name: Build and Deploy
        uses: jenkey2011/vuepress-deploy@master
        env:
          ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
          TARGET_REPO: fenfenjoe/note # 你的仓库名称
          TARGET_BRANCH: gh_pages
          BUILD_SCRIPT: npm install && npm run docs:build
          BUILD_DIR: docs/.vuepress/dist/
```


13.到Github创建同名的远程仓库

> 注意，如果创建的仓库为私人仓库，则无法**免费**使用Github Pages的服务来部署你的Vuepress项目


14.创建本地仓库，并添加远程仓库
```
git init  
git remote add origin git@github.com:fenfenjoe/note.git  
```



15.在github里，点开头像->settings->developer settings->personal access token->generate token 创建一个新的密钥，然后复制它，或者记下来。


16.回到你的github项目，settings->secrets and variables->actions->new repository secrets，添加一个名称为ACCESS_TOKEN的token，将刚刚你复制的密钥放进去，保存。


17.push你的代码到远程仓库
```shell
git push origin master
```

18.在github项目，settings->pages->branchs，选择gh-pages分支，save。等待一段时间后，刷新页面，就会显示你的vuepress已经部署成功。


## 参考
vuepress官方文档：[https://vuepress.vuejs.org/zh/guide/getting-started.html](https://vuepress.vuejs.org/zh/guide/getting-started.html)
