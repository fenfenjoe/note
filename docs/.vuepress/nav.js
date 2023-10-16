const navs =
[ //导航栏配置
 // { text: '首页', link: '/' },
 // { text: 'Baidu', link: 'www.baidu.com', target:'_blank'},  //新窗口打开
 // { text: 'CSDN', link: 'blog.csdn.net', target:'_self'},  //当前窗口打开
 {
  text: '开发笔记',
  items:[
   {
    text: 'JAVA',
    items: [
      {
        text: '概述',
        link: '/java/' //默认跳转到READMD.md
      },
      {
        text: 'spring framework',
        link: '/java/spring/springframework/'
      },
      {
        text: 'spring boot',
        link: '/java/spring/springboot/'
      },
      {
        text: 'spring cloud alibaba',
        link: '/java/spring/springcloudAlibaba/'
      },
      {
        text: 'spring cloud netflix',
        link: '/java/spring/springcloudNetflix/'
      },
    ]
   },
   {
    text: '中间件',
    items:[
     {
     text: '消息中间件',
     link: '/mq/' //默认跳转到READMD.md
     },
     {
       text: 'Kafka',
       link: '/mq/kafka/' //默认跳转到READMD.md
     },
     {
       text: 'RocketMQ',
       link: '/mq/rocketMq/' //默认跳转到READMD.md
     },
     {
       text: 'Redis',
       link: '/redis/'
     },
     {
       text: 'MongoDB',
       link: '/mongoDB/'
     }
    ]
   },
   {
      text: 'PYTHON',
      link: '/python/'
   },
   {
      text: '数据库',
      items: [
         {
           text: 'Mysql',
           link: '/database/mysql/' //默认跳转到READMD.md
         },
         {
           text: 'Redis',
           link: '/database/redis/' //默认跳转到READMD.md
         }
      ]
   },
   {
      text: '设计模式',
      link: '/designPattern/' //默认跳转到READMD.md
   },
   {
      text: '前端',
      link: '/frontend/' //默认跳转到READMD.md
   },
   {
      text: '运维',
      link: '/devops/' //默认跳转到READMD.md
   }
  ]
 },
 {
    text: '数学',
    items: [
     {
        text: '线性代数',
        link: '/math/线性代数/'
     }
    ]
 },
 {
    text: '量化',
    link: '/quant/' //默认跳转到READMD.md
 },
 {
   text: '其他',
   items:[
     {
       text: '获取信息的渠道',
       items:[
           {
             text: 'RSS',
             link: '/other/datasource/RSS' //默认跳转到READMD.md
           },
           {
               text: '资源汇总',
               link: '/other/datasource/资源汇总' //默认跳转到READMD.md
             }
         ]
     }
   ]
 },
 {
   text: '我也想搭建这样的博客！',
   link: '/azilnote/' //默认跳转到READMD.md
 },
 { text: '前往', link: 'https://www.travellings.cn/go.html' },
];

module.exports = navs;
