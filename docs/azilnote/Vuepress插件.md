---
title:添加插件
---

# 添加插件

## VuePress有哪些可选的插件

* 官方的
  * “返回顶部”按钮 --- @vuepress/plugin-back-to-top
  * 添加“Google Analyse“ --- @vuepress/plugin-google-analytics
  * 使网站更像APP --- @vuepress/plugin-pwa
  * ...

> 更多：https://vuepress.vuejs.org/zh/plugin/official/plugin-active-header-links.html

## 如何搜索插件

* 【官方文档】https://vuepress.vuejs.org/zh/plugin/official/plugin-active-header-links.html  
* 【第三方插件】https://github.com/vuepress/awesome-vuepress

## 如何安装插件

示例：安装markdown-it-katex插件  

```shell
npm install markdown-it-katex --save
```



## 开发一个插件

> 开发前，需要先对前端框架**VUE**有一定的了解。

### 开发插件示例

假设我现在有一个需求：想在首页右侧做一个侧边栏，里面显示2个图标：个人微信二维码、赞赏码

1. 先开发好一个侧边栏VUE组件，下面提供一个简单的实现：
/docs/.vuepress/components/global/RightBar.vue
```vue
<template>
  <div>
    <nav class="right-bar-wrap" v-show="isRightBar">
      <div class="right-bar-item">
        <img :src="localImgRepo.wxImg" alt="站长wechat"/>
        <div>站长wechat</div>
      </div>
      <div class="right-bar-item">
        <img :src="localImgRepo.zsImg" alt="赞赏码"/>
        <div>赞赏码</div>
      </div>
    </nav>
  </div>
</template>

<script>
import localImgRepo from '../../public/js/localImgRepo';
export default {
  name: "RightBar",
  data() {
    return {
      isRightBar: true,    // 侧边栏默认隐藏
      localImgRepo: localImgRepo
    };
  },
  mounted() {
    window.addEventListener("scroll", this.scroll);   // 绑定监听scroll事件
  },

  destroyed() {
    window.removeEventListener("scroll", this.scroll); // 解绑监听scroll事件
  },

  methods: {
    scroll() {
      const that = this;
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      that.scrollTop = scrollTop;
    }

  },
};
</script>

<style lang="stylus" scoped>
.right-bar-wrap {
    position: fixed;
    right: 0.15rem;
    top: 20%;
    display: flex;
    flex-direction: column;
    z-index: 888;

    img {
      border: 1px solid #3eaf7c;
      border-radius: 4px;
      width: 70px;
      height: 70px;
    }
}

.right-bar-item {
  background-color:#FFFFFF;
  text-align:center;
  border-style:solid;
  width: 100px;
  height: 100px;
}
</style>
```

2. 把个人微信二维码、赞赏码的图片放到/images文件夹中，并把路径写进这个JS里  
/docs/.vuepress/public/js/localImgRepo.js  
```javascript
import wxImg from '../images/IMG20231030-102436789.jpg';
import zsImg from '../images/IMG20231030-102429678.jpg';

export default {
  wxImg: wxImg,
  zsImg: zsImg
}
```

3. 在Vuepress中注册这个右侧栏组件，并命名为：global-RightBar  
/docs/.vuepress/config/plugin.js  
```javascript
const plugins = [
  [
    {
      // 右边固定栏
      name: 'page-plugin',
      globalUIComponents: [
        'global-RightBar',
      ],
    },
  ],
];

module.exports = plugins; // 导出
```

4. 现在，可以直接在你的markdown页中使用这个插件了。方法也很简单，直接在主页追加一个```<global-RightBar/>```即可。

5. 新增、修改插件后，需要重启项目，才能看到结果。最后结果如图：  

![screen_vuechajian1.png](/images/screen_vuechajian1.png)  
![screen_vuechajian2.png](/images/screen_vuechajian2.png)  

当然，这里做的插件比较简约，仅提供一个思路。现在按照这种方式去创建自己想要的插件吧！  

### 开发插件基本流程

* 【必须】写一个插件（CommonJS模块）
* 【可选】插件对应的VUE组件
* 【必须】在VUEPRESS中注册该插件
* 【必须】使用插件


1. 我们说的**插件**实质就是一个**CommonJS模块**，因为插件需要运行在Node端。  

一个插件可以是一个Javascript对象（当不需要入参时）：
```javascript
module.exports = {
   // ...
}
```

也可以是一个匿名函数。这个函数接收插件的配置选项作为第一个参数，包含编译器上下文的**ctx**对象作为第二个参数：
```javascript
module.exports = (options, ctx) => {
   return {
      // ...
   }
}
```

