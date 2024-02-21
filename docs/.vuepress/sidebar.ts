export const sidebar = {
    '/database/redis/': [
        {
            text: '', //一级标题
            collapsible: false, //是否可折叠
            children: [
                '',   //README.md
                '安装&项目结构',
                'Redis_API',
                'Redis数据结构',
                'Redis使用场景',
                'Redis其他'
            ]
        }
    ],
    '/database/mysql/': [
        {
            text: '', //一级标题
            collapsible: false, //是否可折叠
            children: [
                '',   //README.md
                'SQL速查'
            ]
        }
    ],
    '/azilnote/': [
        {
            text: '我也想搭建这样的博客', //一级标题
            collapsible: false, //是否可折叠
            children: [
                '',
                '初始化项目',
                '写一篇文章',
                '侧边栏',
                '使用emoji',
                '在文章中画流程图',
                '在文章中画函数图',
                '加入开往',
                'Vuepress插件',
                '部署到githubpages',
                '申请属于自己的域名'
            ]
        }
    ],
    '/math/线性代数/': [
        {
            text: '线性代数', //一级标题
            collapsible: false, //是否可折叠
            children: [
                {text:'行列式',link:'/math/线性代数/行列式.md'},
                {text:'矩阵',link:'/math/线性代数/矩阵.md'},
                {text:'向量',link:'/math/线性代数/向量.md'},
                {text:'线性方程组',link:'/math/线性代数/线性方程组.md'}
            ]
        }
    ],
    '/designPattern/': [
        {
            text: '设计模式', //一级标题
            collapsible: false, //是否可折叠
        },
        {
            text: '创建型', //一级标题
            collapsible: false, //是否可折叠
            children: [
                {text:'工厂模式',link:'/designPattern/工厂模式.md'},
                {text:'单例模式',link:'/designPattern/单例模式.md'},
                {text:'建造者模式',link:'/designPattern/建造者模式.md'},
                {text:'原型模式',link:'/designPattern/原型模式.md'}
            ]
        },
        {
            text: '结构型', //一级标题
            collapsible: false, //是否可折叠
            children: [
                {text:'适配器模式',link:'/designPattern/适配器模式.md'},
                {text:'装饰模式',link:'/designPattern/装饰模式.md'},
                {text:'代理模式',link:'/designPattern/代理模式.md'},
                {text:'外观模式',link:'/designPattern/外观模式.md'},
                {text:'桥接模式',link:'/designPattern/桥接模式.md'},
                {text:'组合模式',link:'/designPattern/组合模式.md'}
            ]
        },
        {
            text: '行为型', //一级标题
            collapsible: false, //是否可折叠
            children: [
                {text:'享元模式',link:'/designPattern/享元模式.md'},
                {text:'策略模式',link:'/designPattern/策略模式.md'},
                {text:'模板方法模式',link:'/designPattern/模板方法模式.md'},
                {text:'观察者模式',link:'/designPattern/观察者模式.md'},
                {text:'迭代子模式',link:'/designPattern/迭代子模式.md'},
                {text:'责任链模式',link:'/designPattern/责任链模式.md'},
                {text:'命令模式',link:'/designPattern/命令模式.md'},
                {text:'备忘录模式',link:'/designPattern/备忘录模式.md'},
                {text:'状态模式',link:'/designPattern/状态模式.md'},
                {text:'访问者模式',link:'/designPattern/访问者模式.md'},
                {text:'中介者模式',link:'/designPattern/中介者模式.md'},
                {text:'解释器模式',link:'/designPattern/解释器模式.md'}
            ]
        }
    ]
};

// module.exports = sidebar; //CommonJS
