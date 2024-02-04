
import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { sidebar } from './sidebar.js'
import { navbar } from './nav.js'
//import { pluginBackToTop } from '@vuepress/plugin-back-to-top'
//import { lastUpdated } from '@vuepress/last-updated'
//import { pluginMediumZoom } from '@vuepress/plugin-medium-zoom'
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance"

export default defineUserConfig({
    bundler: viteBundler(),
    theme: defaultTheme({
        lastUpdated: '最近更新时间', //文章添加最近更新时间
        logo: '/images/favicon.ico', //导航栏logo
        navbar: navbar,   //导航配置见nav.js
        sidebar: sidebar //侧边栏配置见sidebar.js
    }),
    title: '粉粉蕉的笔记本',
    description: 'Just playing around',
    //base: '/note/',  //基础路径
    head: [
      ['link',{rel: 'icon', href: '/images/favicon.ico'}]  //网站图标
    ],
    plugins:[
        mdEnhancePlugin({}), //markdown功能增强插件
    ]
})