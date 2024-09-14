import { NavbarConfig } from "@vuepress/theme-default";

export const navs =
[ //导航栏配置
    // { text: '首页', link: '/' },
    // { text: 'Baidu', link: 'www.baidu.com', target:'_blank'},  //新窗口打开
    // { text: 'CSDN', link: 'blog.csdn.net', target:'_self'},  //当前窗口打开
    {
        text: '开发笔记',
        children: [
            {
                text: 'JAVA',
                children: [
                    {
                        text: '代码笔记',
                        link: '/java/实战/开发笔记.md' //默认跳转到READMD.md
                    },
                     {
                         text: 'Java8实战',
                         link: '/java/实战/Java8实战.md'
                     },
                   {
                       text: '分布式事务实战（Seata）',
                       link: '/java/常用框架/seata.md'
                   },
                   {
                      text: '模板引擎（FreeMarker）',
                      link: '/java/常用框架/freemarker.md'
                   }
                ]
            },
            {
                text: '中间件',
                children: [
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
                        link: '/database/redis/'
                    },
                    {
                        text: 'MongoDB',
                        link: '/database/mongoDB/'
                    }
                ]
            },
            {
                text: '数据库',
                children: [
                    {
                        text: 'Mysql',
                        link: '/database/mysql/' //默认跳转到READMD.md
                    }
                ]
            },
            {
                text: '设计模式',
                link: '/designPattern/' //默认跳转到READMD.md
            },
             {
                 text: '运维',
                 children: [
                    {
                        text: 'linux命令速查',
                        link: '/devops/linux/linux命令速查宝典.md'
                    },
                    {
                        text: 'windows命令速查',
                        link: '/devops/windows/windows命令速查宝典.md'
                    },
                    {
                        text: 'Docker笔记',
                        link: '/devops/docker/Docker笔记.md'
                    },
                    {
                        text: 'kubernetes学习笔记',
                        link: '/devops/kubernetes/kubernetes学习笔记.md'
                    },
                    {
                        text: 'kubernetes实操笔记',
                        link: '/devops/kubernetes/kubernetes实操笔记.md'
                    },
                    {
                        text: '运维工具大全',
                        link: '/devops/运维工具大全.md'
                    },
                     {
                         text: 'IDEA快捷键大全+动图演示',
                         link: '/devops/ide/IDEA快捷键大全.md'
                     }
                 ]
             }
        ]
    },
    {
        text: '数学',
        children: [
            {
                text: '概率论',
                link: '/math/概率论/'
            },
            {
                text: '线性代数',
                link: '/math/xsds/',
                children: [
                    {
                        text: '行列式',
                        link: '/math/xsds/行列式.md'
                    },
                    {
                        text: '矩阵',
                        link: '/math/xsds/矩阵.md'
                    },
                    {
                        text: '向量',
                        link: '/math/xsds/向量.md'
                    },
                    {
                        text: '线性方程组',
                        link: '/math/xsds/线性方程组.md'
                    },
                ]
            },
            {
                text: '统计学',
                link: '/math/统计学/'
            }
        ]
    },
    {
        text: '其他',
        children: [
            {
                text: 'RSS',
                link: '/other/datasource/RSS' //默认跳转到READMD.md
            },
            {
                text: '资源导航',
                link: '/other/datasource/资源汇总' //默认跳转到READMD.md
            },
             {
                 text: '软考',
                 link: '/other/softtest/软考' //默认跳转到READMD.md
             },
             {
                  text: '健身',
                  children:[
                    {
                         text: '拉伸',
                         link: '/gym/拉伸.md' //默认跳转到READMD.md
                     }
                  ]
              },
              {
                   text: '装修攻略',
                   link: '/decorate/' //默认跳转到READMD.md
              }
        ]
    },
    {
        text: '我也想搭建这样的博客！',
        link: '/azilnote/' //默认跳转到READMD.md
    },
   { text: '🚋开往', link: 'https://www.travellings.cn/go.html' }
];

// module.exports = navs;  //CommonJS

