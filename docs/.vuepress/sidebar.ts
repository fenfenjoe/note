const sidebar = {
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
'/azilnote/': [
  {
       title: '我也想搭建这样的博客', //一级标题
       collapsable: false, //是否可折叠
       children:[
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
     title: '线性代数', //一级标题
     collapsable: false, //是否可折叠
     children:[
      '',
      '行列式',
      '矩阵',
      '向量',
      '线性方程组'
     ]
    }
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

module.exports = sidebar; //CommonJS
