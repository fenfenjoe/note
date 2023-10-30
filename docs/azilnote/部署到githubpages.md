---
title: 部署到服务器
---

# 在Github Pages中部署你的博客

## 将博客部署到github pages的优缺点  
优点：免费、提交文章后自动部署（CI/CD）    
缺点：需要科学上网、国内无法备案，无法使用国内CDN  


## 部署步骤
1.安装Git

略


2.在博客项目的根目录创建.github/workflows目录，在里面创建CI.yml文件（名称任意命名，但后缀一定要.yml）
```
.github
  - workflows
    CI.yml  
```

CI.yml文件内容如下：
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
          TARGET_REPO: ***/note # 你的仓库名称
          TARGET_BRANCH: gh_pages
          BUILD_SCRIPT: npm install && npm run docs:build
          BUILD_DIR: docs/.vuepress/dist/
```


3.到Github创建同名的远程仓库

> 注意，如果创建的仓库为私人仓库，则无法**免费**使用Github Pages的服务来部署你的Vuepress项目


4.创建本地仓库，并添加远程仓库
```
git init  
git remote add origin git@github.com:***/note.git  
```



5.在github里，点开头像->settings->developer settings->personal access token->generate token 创建一个新的密钥，然后复制它，或者记下来。


6.回到你的github项目，settings->secrets and variables->actions->new repository secrets，添加一个名称为ACCESS_TOKEN的token，将刚刚你复制的密钥放进去，保存。


7.push你的代码到远程仓库
```shell
git push origin master
```

8.在github项目，settings->pages->branchs，选择gh-pages分支，save。等待一段时间后，刷新页面，就会显示你的vuepress已经部署成功。


## 参考
vuepress官方文档：[https://vuepress.vuejs.org/zh/guide/getting-started.html](https://vuepress.vuejs.org/zh/guide/getting-started.html)
