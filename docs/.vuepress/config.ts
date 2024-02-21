
import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { sidebar } from './sidebar'
import { navs } from './nav'
//import { pluginBackToTop } from '@vuepress/plugin-back-to-top'
//import { lastUpdated } from '@vuepress/last-updated'
//import { pluginMediumZoom } from '@vuepress/plugin-medium-zoom'
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance"

export default defineUserConfig({
    bundler: viteBundler(),
    theme: defaultTheme({
        lastUpdated: true, //文章添加最近更新时间
        logo: '/images/favicon.ico', //导航栏logo
        navbar: navs,
        sidebar: sidebar
    }),
    title: '粉粉蕉的笔记本',
    description: 'Just playing around',
    //base: '/note/',  //基础路径
    head: [
      ['link',{rel: 'icon', href: '/images/favicon.ico'}]  //网站图标
    ],
    plugins:[
        mdEnhancePlugin({
            katex: true
        }) //markdown功能增强插件
    ]
})