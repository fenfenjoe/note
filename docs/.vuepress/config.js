const sidebar =  require("./sidebar");  // 引入sidebar,后缀名xx.js可以省略
const nav =  require("./nav");  // 引入nav,后缀名xx.js可以省略

module.exports = {
  title: '粉粉蕉的笔记本',
  description: 'Just playing around',
  //base: '/note/',  //基础路径
  head: [
    ['link',{rel: 'icon', href: '/images/favicon.ico'}],  //网站图标
  ],
  extendMarkdown(md) {
    md.use(require('markdown-it-mathjax3')) //使vuepress支持数学公式
    md.linkify.set({ fuzzyEmail: false })
  },
  themeConfig: {
      lastUpdated: '最近更新时间', //文章添加最近更新时间
      logo: '/images/favicon.ico', //导航栏logo
      nav: nav   //导航配置见nav.js
//      sidebar: sidebar //侧边栏配置见sidebar.js
//      ,sidebarDepth: 0
  },
  plugins:[
  '@vuepress/plugin-back-to-top',  //“回到顶部”插件
  '@vuepress/last-updated', //显示最后更新时间
  '@vuepress/plugin-medium-zoom' //图片可以点开放大
  ]
}