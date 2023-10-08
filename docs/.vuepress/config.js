module.exports = {
  title: '粉粉蕉的笔记本',
  description: 'Just playing around',
  base: '/note/',  //基础路径
  head: [
    ['link',{rel: 'icon', href: '/images/favicon.ico'}]  //网站图标
  ],
  themeConfig: {
      lastUpdated: '最近更新时间', //文章添加最近更新时间
      logo: '/images/favicon.ico', //导航栏logo

      nav: [ //导航栏配置
//        { text: '首页', link: '/' },
        // { text: 'Baidu', link: 'www.baidu.com', target:'_blank'},  //新窗口打开
        // { text: 'CSDN', link: 'blog.csdn.net', target:'_self'},  //当前窗口打开
        {
         text: '开发笔记',
         items:[
          {
           text: 'JAVA',
           items: []
          },
          {
            text: '消息中间件',
            items:[
            {
              text: '概述',
              link: '/mq/' //默认跳转到READMD.md
            },
            {
              text: 'Kafka',
              link: '/mq/kafka/' //默认跳转到READMD.md
            },
            {
              text: 'RocketMQ',
              link: '/mq/rocketMq/' //默认跳转到READMD.md
            }
            ]
          },
          {
             text: 'PYTHON',
             items: []
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
             items: []
          },
          {
             text: '前端',
             items: []
          },
          {
             text: '运维',
             items: []
          },
         ]
        },
        {
           text: '数学',
           items: []
        },
        {
           text: '量化',
           items: []
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
        { text: 'External', link: 'https://google.com' },
      ],
      sidebar: {
        '/database/redis/':[
          {
           title: '', //一级标题
           collapsable: false, //是否可折叠
           children:[
           '',   //README.md
           '安装&项目结构',
           'Redis_API',
           'Redis数据结构',
           'Redis使用场景',
           'Redis其他'
           ]
          }
        ],
        '/database/mysql/':[
          {
             title: '', //一级标题
             collapsable: false, //是否可折叠
             children:[
             '',   //README.md
             'SQL速查'
             ]
            }
        ],
        '/azilnote/': 'auto',
        '/designPattern/':[
            {
             title: '设计模式', //一级标题
             collapsable: false, //是否可折叠
             children:[
             ''
             ]
            },
            {
             title: '创建型', //一级标题
             collapsable: false, //是否可折叠
             children:[
             '工厂模式.md',
              '单例模式.md',
              '建造者模式.md',
              '原型模式.md'
             ]
            },
            {
             title: '结构型', //一级标题
             collapsable: false, //是否可折叠
             children:[
             '适配器模式.md',
               '装饰模式.md',
               '代理模式.md',
               '外观模式.md',
               '桥接模式.md',
               '组合模式.md'
             ]
            },
            {
             title: '行为型', //一级标题
             collapsable: false, //是否可折叠
             children:[
             '享元模式.md',
            '策略模式.md',
            '模板方法模式.md',
            '观察者模式.md',
            '迭代子模式.md',
            '责任链模式.md',
            '命令模式.md',
            '备忘录模式.md',
            '状态模式.md',
            '访问者模式.md',
            '中介者模式.md',
            '解释器模式.md'
             ]
            },



        ]
      },
      sidebarDepth: 0
  },
  plugins:[
  '@vuepress/plugin-back-to-top',  //“回到顶部”插件
  '@vuepress/last-updated', //显示最后更新时间
  '@vuepress/plugin-medium-zoom' //图片可以点开放大
  ]
}