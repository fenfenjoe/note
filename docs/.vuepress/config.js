module.exports = {
  title: 'Hello VuePress',
  description: 'Just playing around',
  base: '/note/',  //基础路径
  themeConfig: {
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Guide', link: '/guide/' },
        {
          text: 'DevelopNote',
          items:[
            { text: 'frondend', link: '/developNote/frondend/' },
            { text: 'backend', link: '/developNote/backend/' }
          ]
        },
        { text: 'External', link: 'https://google.com' },
      ]
  }
}