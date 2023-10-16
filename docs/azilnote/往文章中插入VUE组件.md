---
title: 往文章中插入VUE组件
---


# 往文章中插入VUE组件

<h1>非常简单！</h1>

以下是vuepress 1.x版本的插入组件步骤。

步骤如下：
1. 在.vuepress/components 下新建一个vue组件（.vue）  
示例：RightBar.vue  
```
<template>
  <div>
    <div class="right-bar-wrap" v-show="isRightBar">
      测试测试
    </div>
  </div>
</template>

<script>
export default {
  name: "RightBar", //组件名
  data() {
    return {
      isRightBar: true    // 侧边栏默认隐藏
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
      if (that.scrollTop > 60) {    // 这里是实现,当滚动条滚动高度大于60px,就显示右侧的侧边栏,否则就隐藏
        that.isRightBar = true;
      } else {
        that.isRightBar = false;
      }
    },
  }
};
</script>
```

vuepress 1.x会将 .vuepress/components里的组件注册到全局中。  

2. 在你想添加组件的md中添加```<RightBar/>```，即可显示你的组件。
