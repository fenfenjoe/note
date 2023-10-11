module.exports = {
  title: '粉粉蕉的笔记本',
  description: 'Just playing around',
  base: '/note/',  //基础路径
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

      nav: [ //导航栏配置
//        { text: '首页', link: '/' },
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
        '/math/线性代数/': [
            {
             title: '线性代数', //一级标题
             collapsable: false, //是否可折叠
             children:[
              '',
              '行列式',
              '矩阵',
              '向量'
             ]
            },
        ],
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
             '工厂模式',
              '单例模式',
              '建造者模式',
              '原型模式'
             ]
            },
            {
             title: '结构型', //一级标题
             collapsable: false, //是否可折叠
             children:[
             '适配器模式',
               '装饰模式',
               '代理模式',
               '外观模式',
               '桥接模式',
               '组合模式'
             ]
            },
            {
             title: '行为型', //一级标题
             collapsable: false, //是否可折叠
             children:[
             '享元模式',
            '策略模式',
            '模板方法模式',
            '观察者模式',
            '迭代子模式',
            '责任链模式',
            '命令模式',
            '备忘录模式',
            '状态模式',
            '访问者模式',
            '中介者模式',
            '解释器模式'
             ]
            }
        ]
      }
//      ,sidebarDepth: 0
  },
  plugins:[
  '@vuepress/plugin-back-to-top',  //“回到顶部”插件
  '@vuepress/last-updated', //显示最后更新时间
  '@vuepress/plugin-medium-zoom' //图片可以点开放大
  ]
}