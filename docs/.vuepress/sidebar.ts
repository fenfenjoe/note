export const sidebar = {
    '/database/redis/': [
        {
            text: '', //一级标题
            collapsible: false, //是否可折叠
            children: [
                {text:'概述',link:'/database/redis/README.md'},   //README.md
                {text:'安装&项目结构',link:'/database/redis/安装&项目结构.md'},
                {text:'API',link:'/database/redis/Redis_API.md'},
                {text:'数据结构',link:'/database/redis/Redis数据结构.md'},
                {text:'使用场景',link:'/database/redis/Redis使用场景.md'},
                {text:'其他',link:'/database/redis/Redis其他.md'}
            ]
        }
    ],
    '/database/mysql/': [
        {
            text: '', //一级标题
            collapsible: false, //是否可折叠
            children: [
                {text:'概述',link:'/database/mysql/README.md'},   //README.md
                {text:'SQL速查',link:'/database/mysql/SQL速查.md'}
            ]
        }
    ],
    '/azilnote/': [
        {
            text: '我也想搭建这样的博客', //一级标题
            collapsible: false, //是否可折叠
            children: [
                {text:'概述',link:'/azilnote/README.md'},
                {
                    text:'现在开始！',
                    children:[
                        {text:'初始化项目',link:'/azilnote/初始化项目.md'},
                        {text:'写一篇文章',link:'/azilnote/写一篇文章.md'},
                        {text:'侧边栏',link:'/azilnote/侧边栏.md'},
                        {text:'使用emoji',link:'/azilnote/使用emoji.md'},
                        {text:'在文章中画流程图',link:'/azilnote/在文章中画流程图.md'},
                        {text:'在文章中画函数图',link:'/azilnote/在文章中画函数图.md'},
                        {text:'加入开往',link:'/azilnote/加入开往.md'},
                        {text:'Vuepress插件',link:'/azilnote/Vuepress插件.md'},
                        {text:'部署到githubpages',link:'/azilnote/部署到githubpages.md'},
                        {text:'申请属于自己的域名',link:'/azilnote/申请属于自己的域名.md'},
                        {text:'迁移至Vuepress2.0',link:'/azilnote/迁移至v2.x.md'}
                    ]
                }
            ]
        }
    ],
    '/math/xsds/': [
        {
            text: '线性代数', //一级标题
            collapsible: false, //是否可折叠
            children: [
                {text:'概述',link:'/math/xsds/README.md'},
                {text:'行列式',link:'/math/xsds/行列式.md'},
                {text:'矩阵',link:'/math/xsds/矩阵.md'},
                {text:'向量',link:'/math/xsds/向量.md'},
                {text:'线性方程组',link:'/math/xsds/线性方程组.md'}
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
    ],
    '/decorate/': [
            {
                text: '装修攻略', //一级标题
                collapsible: false, //是否可折叠
                children: [
                    {text:'简述',link:'/decorate/README.md'},
                    {text:'板材选择',link:'/decorate/板材.md'},
                    {text:'装修风格',link:'/decorate/装修风格.md'},
                    {text:'门窗',link:'/decorate/门窗.md'}
                ]
            }
        ]
};

// module.exports = sidebar; //CommonJS
