---
title: RSS
sidebar: 'auto'
---

# RSS

## 什么是RSS

RSS是一个“订阅工具”。你可以用RSS订阅你感兴趣的内容（Twitter博主、BBC新闻、B站视频更新、博客文章等等）。  

当这些内容有更新时，便可通过RSS自动推送给你。  

&nbsp;  
&nbsp;  
&nbsp;  
## RSS三件套

* RSS源（用户想订阅的内容，比如文章、视频、漫画、等等）

* RSS阅读器（阅读RSS内容的软件、APP）

* RSSHub（生成RSS源开源工具）

 
### 什么是RSS源？

RSS源是一个URL链接。格式如下：
```url
# Bilibili的UP主：英雄联盟赛事的视频的订阅源，50329118为UP主的ID  
https://rsshub.app/bilibili/user/video/50329118  
```
其中，https://rsshub.app为**域名**，/bilibili/user/video/50329118为**路由**。  

拿到订阅源URL之后，就可以在RSS阅读器中订阅该网站、博客。  

当其内容更新时，便会通过订阅源推送到你的RSS阅读器。

> 有哪些可以订阅的RSS源类型？
> * 博客
> * 视频网站
> * 社交平台（微博、Twitter）
> * ~~公众号~~（因平台的管制，目前比较难。见：https://www.runningcheese.com/rss-subscriptions 的介绍）
> * 新闻网站
> * ...

&nbsp;  
&nbsp;  
&nbsp;  

## 开始体验

### 1.获取RSS源

（1）登录https://docs.rsshub.app/  
> 该网站需要科学上网。国内可访问镜像网站：https://rsshub.rssforever.com

![RSSHub.png](/note/images/RSSHub.png)  

（2）侧边栏找到“路由”，展开后可看到有许多可供订阅的RSS源，我们以Bilibili为例。

（3）假如我们想订阅的是某个UP主更新的视频，我们可以使用以下订阅源链接。  

![RSSHub-bilibili.png](/note/images/RSSHub-bilibili.png)

（4）我想订阅“英雄联盟赛事”UP主的视频。进入B站，进入UP主的主页，我们可以看到UP主的UID。  

![UP主UID.png](/note/images/UP主UID.png)  

（5）最后，我们得到了“订阅英雄联盟赛事UP主的视频”的RSS源链接为：**https://rsshub.app/bilibili/user/video/50329118**






 
> 获取RSS源的途径有很多：
> * RSSHub  
> * RSSHub镜像网站（无需翻墙）  
> * RSS源推荐文章（百度一下）
> * 网站、博客自己提供的RSS源地址
> * RSSHub Rader（RSSHub配套的浏览器插件，当你浏览某个网站时，该插件可以自动提醒你是否有RSS源）
> * RSS+（浏览器脚本，跟浏览器插件类似）
> * RSSAid（Android用）
> * RSSBud（IOS用）


### 2.选择RSS阅读器

可供选择的RSS阅读器：  
* Feedly（在线RSS阅读器，需要翻墙）：https://feedly.com/
* InoReader
* TinyTinyRSS
* FreshRSS
* Miniflux



### 3.将订阅源添加到阅读器中  

略。

&nbsp;  
&nbsp;  
&nbsp;


## 常见疑问

### RSSHub（https://rsshub.app）被墙，订阅源都使用不了，怎么办？  

RSSHub 有很多国内的镜像网站，我们也可以自己搭建。  
下面推荐几个RSSHub镜像网站。  
```
服务器1 ：https://rsshub.rssforever.com  (推荐）
服务器2 ：https://i.scnu.edu.cn/sub  （推荐）
服务器3 ：https://rss.qiuyuair.com
服务器4 ：https://rss.feiyuyu.net
服务器5 ：https://rsshub.anyant.xyz
```


### 如何为自己的博客添加RSS源？  

TODO  


### 



