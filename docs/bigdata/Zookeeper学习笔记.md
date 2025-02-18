---
title: Zookeeper学习笔记
sidebar: 'auto'
---

# Zookeeper学习笔记

## 参考

【Zookeeper入门看这篇就够了】[https://blog.csdn.net/java_66666/article/details/81015302](https://blog.csdn.net/java_66666/article/details/81015302)


## Zookeeper是做什么的？

简单的说，就是一个有监听通知机制的文件系统。

>怎么理解？

就是你可以在Zookeeper上增加、删除目录（在Zookeeper中目录被称为znode）；

目录里可以存放文件；

同时，你的其他应用程序可以监听Zookeeper上文件的变化；

当文件有改动时，Zookeeper可以将改动通知到你的应用程序。

>有什么应用场景呢？

**1.发布/订阅**
可以做类似于Spring Cloud Config（分布式配置管理）的功能。
将SpringCloud项目的配置文件全部放到Zookeeper上，需要改配置时，不用到项目里一个一个改，直接在Zookeeper上改，然后由Zookeeper通知到项目即可。

**2.Master选举**  

**3.分布式锁**  

**4.分布式队列**  

**5.集群管理**   
kafka的集群管理就是通过zookeeper来完成。  

## Zookeeper的特性
* 文件（znode）有版本号（dataVersion）
* 同一级节点 key 名称是唯一的（创建重复节点会返回报错）
* 可创建临时节点。当session 关闭后，临时节点自动清除
* watch 机制，监听节点变化
* 为了保持高吞吐和低延迟，每个znode的存放数据上限 为 1M

## 安装

## 配置


## 常见操作

### 服务端的命令行操作
* 启动服务端
  zkServer.sh start
* 关闭服务端
  zkServer.sh stop
* 查看服务端状态
  zkServer.sh status

### 客户端的命令行操作
* 启动客户端
  zkCli.sh
* 退出客户端
  Ctrl+C
* 创建名为“hello”、值为18的znode（目录）
  create /hello 18
* 查看“hello”znode的详细信息
  get /hello
 ```bash
#返回如下值
18 #hello的值
cZxid = 0x49 #创建时znode的id
ctime = Thu Mar 10 08:47:46 UTC 2022 #当前znode创建的时间
mZxid = 0x53 #当前znode的id
mtime = Thu Mar 10 08:53:06 UTC 2022 #当前znode上一次修改的时间
pZxid = 0x49 #子节点id
cversion = 0 #子节点的version
dataVersion = 2 #当前znode值的版本号，修改过一次，所以版本号为2
aclVersion = 0 #权限版本
ephemeralOwner = 0x0
dataLength = 2 #值的长度
numChildren = 0 #子节点个数
```
* 修改“hello”znode的值为19
  set /hello 19
* 删除“hello”znode（znode内不可有子znode，否则删除失败）
  delete /hello
* 删除“hello”znode及其子znode
  deleteall /hello
* 在“hello”下创建子znode“subhello”
  create /hello/subhello 20
* 查看“hello”下的所有子znode
  ls /hello
* 查看根目录下的所有znode
  ls /
* 查看“subhello”的值
  get /hello/subhello
* 监听“hello”znode的值，如果有变化则返回通知。
  get /hello watch
* 创建临时节点（当session关闭后，临时节点清除）
  create -e  /hello-linshi 10
* 创建顺序节点
```bash
#自动创建按顺序生成的znode（后面加上10位数组成的序号）
[zk: localhost:2181(CONNECTED) 8] create -s -e /hello/obj 0
Created /hello/obj0000000001
[zk: localhost:2181(CONNECTED) 9] create -s -e /hello/obj 0
Created /hello/obj0000000002
[zk: localhost:2181(CONNECTED) 10] create -s -e /hello/obj 0
Created /hello/obj0000000003
```


