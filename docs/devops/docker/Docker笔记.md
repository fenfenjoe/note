---
title: Docker
sidebar: 'auto'
---

# 应用容器：Docker


## FAQ
**如何查看宿主机IP？**
* Linux：在命令行输入“ifconfig”命令。里面docker0对应的就是宿主机ip。
* Windows（Docker Desktop）：
## Docker入门
#### 为什么需要容器化？

略。


#### 基本概念

***【镜像（Image）】*** 一个镜像将配置好的操作系统、基本的运行环境打成一个包。这样部署时只要用打好包的镜像来创建一个虚拟操作系统（即Docker容器）即可。
***镜像*** 可理解为一个“安装包”，运维人员运行 ***镜像*** 后，就会生成一个 ***Docker容器*** 在本机，容器里包含了已配置好的 ***环境（例如JDK、Python）*** 、***环境变量（JAVA_HOME）*** 以及 ***应用程序*** ，无需运维人员再配置。

***【镜像仓库（Docker Registry）】*** 用来存放镜像文件。

***【Docker容器（Container）】*** 即一个系统运行实例（类似虚拟系统）。

***【Docker engine】***
当人们说“Docker”时，指的就是docker engine。docker engine由以下3部分组成：
1. Docker守护进程（内核）
2. 与守护进程交互的REST API（系统函数）
3. 在REST API下封装的命令行接口（CLI）



#### Docker与VM（虚拟操作系统）的区别

VM一旦分配便占用固定的资源（硬盘空间、内存空间）；
Docker是一个应用，当需要创建一个Docker容器时，才分配资源，比较灵活。



#### 如何在Linux上安装Docker
使用官方脚本进行安装。

安装命令如下：
```bash
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```
也可以使用国内 daocloud 一键安装命令：
```bash
curl -sSL https://get.daocloud.io/docker | sh
```


#### 如何在Windows上安装Docker
https://www.cnblogs.com/wusha/p/8556567.html



#### 启动Docker
```
systemctl start docker
```


#### 启动Docker的容器
见Docker常见操作/容器操作



## Docker进阶


#### Docker仓库


##### 搭建私有仓库

1. 下载
   https://github.com/goharbor/harbor/releases

2. 解压
```bash
tar -xvf harbor-offline-installer-v1.2.2.tgz
```

3. 修改 harbor.cfg
```properties
#hostname 改为本地ip，非 Mac OS系统 可以不指定端口
hostname = 192.168.31.143:9090
#设置secretkey_path 的路径为 当前目录的data下
secretkey_path = ./data
```

4. 启动 harbor
```bash
./install.sh
```

5. 访问
   http://127.0.0.1:9090/
   默认 admin 用户的密码为 Harbor12345 ，可以在 harbor.cfg 进行修改。

**Docker客户端的操作**
```bash
#登录私服仓库
docker login -u admin -p Harbor12345 127.0.0.1:9090

#将某个镜像标志为需要推送到哪个仓库
docker tag nginx:latest 127.0.0.1:9090/library/nginx:latest

#推送到私服仓库
docker push 127.0.0.1:9090/library/nginx:latest
```



#### 镜像生成脚本：Dockerfile


##### Dockerfile是干什么的？
实质就是一个制作Docker镜像的一段脚本。



##### 怎么制作？
1. 创建一个文件夹（mkdir samp1）
2. 在该文件夹下新建一个Dockerfile文件（cd ./samp1 ; touch Dockerfile）
3. 编写脚本
4. 在Dockerfile脚本的目录下执行：docker build -t [镜像标签名] .
   或者执行docker build -f ./samp/Dockerfile -t [镜像标签名] .
5. 执行docker image ls，查看是否已生成镜像


##### Dockerfile语法


###### Dockerfile示例
```python
# samp1/Dockerfile
# 创建一个linux容器，创建人为dyz
# 执行构建命令：docker build -t samp1:v1 .
# 执行启动命令：docker run samp1后打印出hello world
FROM centos:latest
MAINTAINER dyz
CMD echo "hello world"
```
```python
# samp2/Dockerfile
FROM centos:latest
MAINTAINER dyz
ENTRYPOINT ["echo"]
CMD ["hello world"]
```


###### 每条指令的用法及作用
```python
from <继承于哪个dockerfile> #
maintainer <创建人> #创建人
copy <源路径> <目标路径> #生成容器后，将源路径中的文件拷贝到容器的目标路径中
add <源路径> <目标路径> #与COPY类似，但在拷贝tar文件时还会自动解压
entrypoint 
# 容器启动时默认启动的运行程序
# 多条CMD命令下，仅最后一条命令生效
# 会被docker run 后面的指令及参数覆盖
# docker run时，加上--entrypoint，可以覆盖entrypoint定义的内容
# 格式：
#  ENTRYPOINT ["<可执行文件或命令>","<param1>","<param2>",...] （推荐）
cmd <shell命令>
# 作用：
# 1. 容器启动时默认启动的运行程序的默认参数
# 2. 也可以与entrypoint一样，定义容器启动时的默认启动的运行程序
# 多条CMD命令下，仅最后一条命令生效
# 格式：
# 1. CMD <shell命令>
# 2. CMD ["<可执行文件或命令>","<param1>","<param2>",...] （推荐）
# 3. CMD ["<param1>","<param2>",...]  # 该写法是为 ENTRYPOINT 指令指定的程序提供默认参数
env <key>=<value> <key>=<value> #设置环境变量
arg <key>=<value> <key>=<value> #定义参数，参数仅dockerfile内有效
volume ["<路径1>", "<路径2>"...] #定义匿名数据卷
expose <端口号1> <端口号2>... #开启容器端口
workdir "工作目录" #设置当前工作目录
user
healthcheck
onbuild
label
run #启动前跑的shell命令，例如：run yum -y install httpd（安装httpd）
```




#### 多容器运行：Docker Compose
解决“方便在一台主机上同时运行多个容器”的需求。

步骤：
0. 创建一个新目录（比如/myapp）
1. 编写Dockerfile（定义不同的应用程序）
2. 编写docker-compose.yml（定义这些程序的运行环境，语法见“Docker常见命令-多容器操作”）
3. 执行docker-compose up命令，启动多容器

> 启动后，会默认为这个多容器创建一个默认的网络。按照上面例子，则会创建一个名为“myapp_default”的网络。可通过docker network ls命令查看。

检查是否已安装docker-compose
```bash
docker-compose --version
```
下载docker-compose当前的稳定版本
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```
增加权限
```bash
sudo chmod +x /usr/local/bin/docker-compose
```
创建软链
```bash
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```


#### 集群部署：Docker Swarm
解决“增加Docker服务器，对Docker服务进行扩容，并将其构建成一个Docker集群”的需求。

Raft协议：保证大多数节点存活，集群才可以使用。因此通过Docker Swarm构建集群至少需要3台主机。


#### Docker的网络

>以下网络部分的内容均以Linux系统为基础。


##### 网络基础

物理主机需要通过网卡，才能连接到局域网、互联网，与其他物理主机通信。
网卡一头连着自己，另一头连着不同的网络，通过IP地址唯一的标识自己，标识要连向的网段。
也就是说，不同网卡表示，该机器连着不同的网络。

>在linux系统里，通过 ifconfig 命令或者 ip addr命令,
>可以查看Linux系统中有哪些网络设备。
>一般会看到以下的网卡：
>lo：本地环回的地址
>eth0：阿里云内网的地址（云主机会有该网卡）
>docker0：docker网络的地址
```bash
docker0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
        ether 02:42:5a:d4:cb:38  txqueuelen 0  (Ethernet)
        RX packets 28061  bytes 2235433 (2.1 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 40302  bytes 144133154 (137.4 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.27.14.140  netmask 255.255.192.0  broadcast 172.27.63.255
        ether 00:16:3e:19:ad:e7  txqueuelen 1000  (Ethernet)
        RX packets 23587257  bytes 6897074026 (6.4 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 17405737  bytes 9079226758 (8.4 GiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        loop  txqueuelen 1  (Local Loopback)
        RX packets 8494147  bytes 526641811 (502.2 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 8494147  bytes 526641811 (502.2 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

>提问：是否不同的网卡所连接的网络必然是不同的网络？如何知道网卡对应的网络？

通过网卡的ip地址和子网掩码，可以计算出该网卡连通的是哪个网段。

局域网专用网段：
大型局域网：(10.x.x.x)
中型局域网：(172.16.x.x~172.31.x.x)
小型局域网：(192.168.x.x)
内网的机器都用以上范围的IP地址进行通信。
因特网中路由器对目的地址为专用地址的数据报一律不进行转发。


##### docker0局域网
**Docker容器也一样，一台Docker服务器中的容器是属于同一局域网的，由一个称为“docker0”的网桥为不同的容器分配局域网IP，因此可以互相访问。**

**网桥：docker0**
docker0是一个网桥，维护了一个虚拟网络，它会为容器分配不同的局域网ip。
在linux里，docker0的ip地址一般为172.17.0.1。
其他容器则会分配172.17.0.2，172.17.0.3...如此类推。

**容器与docker0之间的连接：veth-pair**
通过一种称为veth-pair的技术，使容器与docker0之间可以建立连接。

容器发送报文，都会通过veth-pair技术，与docker0建立连接，然后把报文先发送至docker0；
然后docker0根据自己维护的路由表，找到目的容器的地址，再将报文转发出去。


###### Docker容器有哪些互相访问的方式？

**方式一：虚拟ip访问**
容器启动后，docker0会为容器分配一个IP地址。容器之间可以通过该地址进行互相访问。

> 必须先运行容器才能知道ip地址，实际用处不大。

**方式二：link**
在容器启动时，加上link参数。（--link 容器名:容器别名，使用别名访问容器）
```bash
#运行第一个容器
[root@CentOS ~] docker run -it --name centos-1 docker.io/centos:latest
#运行第二个容器
[root@CentOS ~] docker run -it --name centos-2 --link centos-1:centos-1 docker.io/centos:latest
```

> 只能单向访问（centos-2访问centof-1）；
> 原理类似于在hosts文件中增加一个路由。
> 多容器、需要互相访问时也不方便。


**方式三：创建bridge网络（推荐）**

1. 创建bridge网络：mynet
```bash
docker network create mynet
```
2. 将两个容器连接到该网络下
```bash
# --network [哪个网络]
# --network-alias [容器别名]
[root@CentOS ~]# docker run -it --name centos-1 --network testnet --network-alias centos-1 docker.io/centos:latest
[root@CentOS ~]# docker run -it --name centos-2 --network testnet --network-alias centos-2 docker.io/centos:latest
```
3. 两个容器中的应用便可以直接通过network-alias中定义的容器别名访问对方


###### 容器如何访问Docker外的网络？
通过iptables的SNAT实现。
```bash
#查看当前iptable的nat表防火墙策略
iptables -t nat -nL

docker port nginx
```


##### Bridge模式（网桥模式：Docker的默认网络模式）


##### Docker的其他网络模式

Docker的网络模式有以下几种（默认为bridge模式）：
* host模式（--net=host）
* container模式（--net=container:container_id/container_name）
* none模式（--net=none）
* bridge模式（--net=bridge）

使用哪种网络模式，可在运行容器（docker run）时指定。

无论哪种模式，Docker在安装完成后都会创建一个名为docker0的虚拟网桥。

**bridge模式**：
bridge模式（桥接模式）是Docker容器的默认网络模式。

类似于VMware的NAT模式；

使用到一个叫veth-pair的技术，该技术用于连通不同的虚拟网络设备。

>veth-pair就是一对虚拟网卡，容器中一个，宿主机上一个；
```bash
#容器中调用ip addr命令
20166: eth0@if20167: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default 
    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
#宿主机中调用ip addr命令
20167: veth35438b4@if20166: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP 
    link/ether 16:21:9e:97:49:18 brd ff:ff:ff:ff:ff:ff link-netnsid 0
```


**host模式**
类似于VMware的桥接模式


**container模式**


**none模式**
无网络


#### Docker镜像的原理
***UnionFS（联合文件系统）***
是Docker镜像用到的一个分层的文件系统。
当我们在Docker pull拉取镜像时，可以看到Docker会将镜像一层一层的拉取下来。
举例：Mysql的镜像是如何构成的。
* 第一层：bootfs（boot file system），用于加载内核到内存（与BIOS同理）
* 第二层：rootfs（root file system），包含/dev，/proc，/bin等文件，代表不同的操作系统发行版，如CentOS，Ubuntu等


#### Docker可视化工具
* portainer
* Rancher


##### portainer
***在Docker中运行portainer***
```
docker run -d -p 9000:9000 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock --privileged=true protainer/protainer
```


## Docker使用实例

#### 使用Docker搭建Redis集群
```bash
docker run --name kris-redis -p 6380:6379 -d redis --requirepass "123456"
#后台启动redis 守护线程


docker exec -it kris-redis redis-cli
#客户端无密码登录

auth '123456'
#输入登录密码

...
#输入redis命令

```
#### 使用Docker搭建Mysql服务器（单机）
参考：https://www.cnblogs.com/sablier/p/11605606.html
```bash

docker pull mysql # 拉取最新版mysql镜像

docker images # 检查是否拉取成功


docker run 
--name mysql 
-p 3306:3306 
-e MYSQL_ROOT_PASSWORD=123456 
-v /usr/data/mysql/conf:/etc/mysql 
-v /usr/data/mysql/logs:/var/log/mysql 
-v /usr/data/mysql/data:/var/lib/mysql 
-v /usr/data/mysql/my.cnf:/etc/mysql/my.cnf
-d mysql
# –name：容器名，此处命名为mysql
#-e：配置信息，此处配置mysql的root用户的登陆密码
#-p：端口映射，此处映射 主机3306端口 到 容器的3306端口
#-d：后台运行容器，保证在退出终端后容器继续运行
#-v：卷挂载


docker exec -it mysql bash mysql -uroot -p123456 #进入docker本地连接mysql客户端


```
#### 使用Docker搭建Jenkins服务器


#### 使用Docker部署SpringBoot服务

1. 制作SpringBoot应用的Jar包 & 准备JDK压缩包

2. 制作Dockerfile脚本
```bash
FROM centos
#创建人
MAINTAINER dyz
#添加项目
COPY ./sample-hystrix-server-0.0.1-SNAPSHOT.jar /usr/local/
#添加JDK并解压
ADD ./jdk-8u301-linux-x64.tar.gz /usr/local/java
# 设置环境变量
ENV JAVA_HOME=/usr/local/java/jdk1.8.0_301
ENV CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
ENV PATH=$JAVA_HOME/bin:$PATH
# 设置工作目录
WORKDIR /usr/local/
```

3. 上传Jar包到服务器

4. 构建镜像
```bash
docker build -f ./usr/local/samp1/Dockerfile -t [镜像名称] . #注意后面还有一个英文句号
```
5. 新建容器
```bash
docker run -itd --name sample-hystrix-server sample-hystrix-server /bin/bash
```
6. 检查JDK是否安装成功
```bash
java -version
```
7. 容器内启动微服务
```bash
java -jar sample-hystrix-server-0.0.1-SNAPSHOT.jar
```
8. 退出容器，让微服务在后台运行
```bash
Ctrl+P+Q
```


#### 使用Docker部署RabbitMQ服务
```bash
docker pull rabbitmq #拉取最新的rabbitmq镜像


docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 -v /data:/var/lib/rabbitmq --hostname myRabbit -e RABBITMQ_DEFAULT_VHOST=my_vhost -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin

#-d 后台运行容器；
#--name 指定容器名；
#-p 指定服务运行的端口（5672：应用访问端口；15672：控制台Web端口号）；
#-v 映射目录或文件；
#--hostname  主机名（RabbitMQ的一个重要注意事项是它根据所谓的 “节点名称” 存储数据，默认为主机名）；
#-e 指定环境变量；（RABBITMQ_DEFAULT_VHOST：默认虚拟机名；RABBITMQ_DEFAULT_USER：默认的用户名；RABBITMQ_DEFAULT_PASS：默认用户名的密码）


http://Server-IP:15672 #在浏览器访问RabbitMQ控制台


```

#### 使用Docker部署Nacos
https://www.cnblogs.com/allennote/articles/12459907.html

#### 使用Docker部署kafka
```yml
#docker-compose.yml
version: '2'
services:
  zookeeper:
    image: wurstmeister/zookeeper
    volumes:
      - ./data:/data
    ports:
      - "2181:2181"
  kafka:
    image: wurstmeister/kafka
    ports:
      - "9092"
    environment:
      #KAFKA_ADVERTISED_HOST_NAME: PLAINTEXT://172.0.0.1:9092 
      KAFKA_MESSAGE_MAX_BYTES: 2000000
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://192.168.31.71:9092
      KAFKA_LISTENERS: PLAINTEXT://192.168.31.71:9092
    volumes:
      - ./kafka-logs:/kafka
      - /var/run/docker.sock:/var/run/docker.sock
    depends_on:
      - zookeeper
  kafka-manager:
    image: sheepkiller/kafka-manager
    ports:
      - 9020:9000
    environment:
      ZK_HOSTS: zookeeper:2181
    depends_on:
      - kafka
```
然后执行docker-compose up -d即可

#### Docker部署Zookeeper
```bash
docker pull zookeeper:latest

docker run -d -p 2181:2181 --name zookeeper --restart always zookeeper

```

#### Docker部署prometheus
```bash
docker run \
    -p 9090:9090 \
    -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml \
    prom/prometheus

```

#### Docker部署RocketMQ
参考：[https://zhuanlan.zhihu.com/p/137477999](https://zhuanlan.zhihu.com/p/137477999)
[https://blog.csdn.net/weixin_48182198/article/details/106441206](https://blog.csdn.net/weixin_48182198/article/details/106441206)

1.创建以下文件、文件夹
- rocketmq
    - docker-compose.yml
    - opt
        - rocketmq
            - conf
                - broker.conf
            - logs
            - store
```bash
#broker.conf内容
brokerClusterName = DefaultCluster
brokerName = broker-a
brokerId = 0
deleteWhen = 04
fileReservedTime = 48
brokerRole = ASYNC_MASTER
flushDiskType = ASYNC_FLUSH
#需要配置成宿主机的IP
brokerIP1 = 192.168.0.101
```

```yml
#docker-compose.yml内容
version: '2'services:
  namesrv:
    image: rocketmqinc/rocketmq
    container_name: rmqnamesrv
    ports:
      - 9876:9876
    volumes:
      - /opt/rocketmq/logs:/home/rocketmq/logs
      - /opt/rocketmq/store:/home/rocketmq/store
    command: sh mqnamesrv
  broker:
    image: rocketmqinc/rocketmq
    container_name: rmqbroker
    ports:
      - 10909:10909
      - 10911:10911
      - 10912:10912
    volumes:
      - /opt/rocketmq/logs:/home/rocketmq/logs
      - /opt/rocketmq/store:/home/rocketmq/store
      - /opt/rocketmq/conf/broker.conf:/opt/rocketmq-4.4.0/conf/broker.conf
    command: sh mqbroker -n namesrv:9876 -c ../conf/broker.conf
    depends_on:
      - namesrv
    environment:
      - JAVA_HOME=/usr/lib/jvm/jre
  console:
    image: styletang/rocketmq-console-ng
    container_name: rocketmq-console-ng
    ports:
      - 8087:8080
    depends_on:
      - namesrv
    environment:
      - JAVA_OPTS= -Dlogging.level.root=info   -Drocketmq.namesrv.addr=rmqnamesrv:9876 
      - Dcom.rocketmq.sendMessageWithVIPChannel=false
```

#### 使用Docker部署Nginx





## Docker常见命令

***
#### Docker应用操作

***systemctl start docker***
启动Docker守护进程

***systemctl stop docker***
停止Docker守护进程

***systemctl restart docker***
重启Docker守护进程

***docker version***
查看docker版本（亦可检查docker是否安装成功）

***docker info***
查看docker信息（根目录）

***
#### 容器操作

***docker run -d ubuntu***
用ubuntu镜像创建一个容器，后台运行（但因为没有运行任何“前台进程”，因此运行完后输入docker ps会发现，容器又停止了）

***docker run -it ubuntu /bin/bash***
用ubuntu镜像创建一个容器，并以命令行形式进入该容器

***docker run -d -P --name pytest training/webapp python app.py***
用webapp镜像创建一个容器，后台运行（-d），随机映射一个端口（-P）,并运行容器上的app.py

***run详解***
首先是run的语法如下：
```
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]

OPTIONS ：有以下可选项（常用，可参考docker run --help）
    --name [containername] #为容器起名
    -v [目录地址] #匿名挂载
    -v [卷名]:[目录地址]  #具名挂载
    -v /[本地目录地址]:[容器内地址]  #指定路径挂载
    -d #后台运行
    -p [本地端口]:[容器端口]

IMAGE： 指需要启动的镜像名

COMMAND ：
    空 #运行容器默认的命令
    /bin/bash #以命令行方式进入容器
```


***exit/Ctrl+C***
退出Docker容器（且容器停止）

***Ctrl+P+Q***
退出Docker容器（容器继续运行）

***docker ps***
查看运行中的容器

***docker ps -a***
查看所有容器

***docker stop [CONTAINERID]***
停止容器（CONTAINERID可通过docker ps -a查看）

***docker start [CONTAINERID]***
启动一个已停止的容器（CONTAINERID可通过docker ps -a查看）

***docker restart [CONTAINERID]***
启动一个已停止的容器（CONTAINERID可通过docker ps -a查看）

***docker run -itd --name ubuntu-test ubuntu /bin/bash***
用ubuntu镜像创建一个容器；
命名为ubuntu-test；
加了参数d默认不会进入容器

***docker attach [CONTAINERID]***
打开已运行的终端进入容器

***docker exec -it [CONTAINERID] /bin/bash***
开启一个新的终端来进入容器

***docker inspect [CONTAINERID]***
查看容器的详细信息
State：状态（Running、Pause、Restarting...）
Image：对应的镜像ID
HostConfig.Binds：卷挂载
HostConfig.PortBinding：端口映射
Mounts：卷挂载
Configs.ENV：容器开启后的环境变量
Configs.Cmd：容器开启时运行的命令
Configs.Image：生成容器的镜像名
Configs.WorkingDir：进入容器后的默认地址
NetworkSettings.Ports：端口映射
NetworkSettings.Gateway：
NetworkSettings.IPAddress：
NetworkSettings.Networks：





***docker rm -f [CONTAINERID]***
删除容器

***docker stop $(docker ps -aq)***
删除所有容器

***docker rm $(docker ps -aq)***
删除所有容器

***
#### 镜像操作
***docker images***
列出本机里的镜像列表
* REPOSITORY：表示镜像的仓库源
* TAG：镜像的标签（下面称为“版本”）
* IMAGE ID：镜像ID
* CREATED：创建时间
* SIZE：镜像大小

***docker run -it ubuntu:14.04 /bin/bash***
使用版本为14.04的ubuntu镜像来创建容器

***docker pull [Image Name]***
手动从仓库拉取Docker镜像到本地；
如：docker pull ubuntu:14.04
当本地没有该镜像时，docker会自动从仓库拉取这个镜像。仓库地址：
https://hub.docker.com/

***docker search httpd***
查找httpd的Docker镜像

***docker rmi hello-world***
删除镜像

***docker rmi -f $(docker images -qa)***
删除所有镜像

***docker build -t [镜像标签名] .***
使用当前目录下的Dockerfile创建镜像


***
#### 仓库操作
***docker login -u [username] -p [password]***
登录到仓库（dockerhub）

***
#### 网络操作

***docker network ls***
查看Docker服务器正在维护的虚拟子网
```
NETWORK ID     NAME      DRIVER    SCOPE
33a42a4a7c62   bridge    bridge    local
3857b46c9a21   host      host      local
69024ef4e0be   none      null      local
```

***docker network inspect [network-id]***
查看网络的详细信息（比如哪些容器在用该网络、这些容器的ip、mac地址等）

***docker network create [network-name]***
创建虚拟子网

***docker network connect [network-name]  [container-name]***
将容器（原来在虚拟子网A）连接到虚拟子网B上
***
#### 多容器操作（Compose）
**注意！以下命令均需要到docker-compose.yml目录下执行**


***docker-compose up***
运行所有服务容器

***docker-compose ps***
列出Compose项目中所有的容器

***docker-compose stop***
停止Compose项目中所有的容器

***docker-compose down***
停用并移除所有容器以及网络相关

***docker-compose logs -f***
查看Compose项目启动日志

***docker-compose run [SERVICE] [COMMAND]***
在Compose项目的某个服务中跑一条SHELL命令

***docker-compose config***
查看docker-compose.yml内容


##### docker-compose.yml语法
```yml
version: "3.7"
services:  #核心部分，每个service对应一个Dockerfile
  web:
    container_name: "web1" #容器名
    hostname: "web" #主机名
    restart: always #跟随docker重启
    build: . #指定该服务的Dockerfile所在位置，默认为当前目录
    image: centos:latest #指定使用哪个镜像构建容器，version1中image和build不能共存；version2之后则可以（为镜像打上image指定的标签）
    links: #如何访问其他服务（等于在容器的/etc/hosts文件中创建相应记录）
      - "mysql"  #通过“mysql”就可以访问到mysql所在容器（例如ping mysql）
      - "mysql:myMysql" #服务名：自定义名称。在容器中通过myMysql访问mysql所在容器（例如ping myMysql）
    depends_on: #按依赖顺序启动服务（即先启动mysql，再启动web）
      - mysql
    ports:
      - "8080" #仅写容器端口，这样会随机映射宿主机的端口
      - "8080:8080" #宿主机端口:容器端口
    expose:
      - "8080" #暴露端口，但不映射到宿主机（供其他容器使用）
    #command: 默认的容器启动命令
    networks: 
      - dev 
    volumes:
      - /opt/data/mysql:/var/lib/mysql #容器内绝对路径:宿主机的绝对路径
      - ./opt/data/mysql:/var/lib/mysql #
      - myvolume:/var/lib/mysql #已定义的数据卷:宿主机的绝对路径
      - ./
  mysql:
    build: ./mysql #指定该服务的Dockerfile所在位置
    env_file: ./mysql/.env #从文件添加环境变量
    environment:  #添加环境变量
      MYSQL_ROOT_PASSWORD: '123456'
      IS_TRUE: 'true'
    networks: #添加以下配置以后，web容器就可以通过mysql:3306（服务名）或者mysqlaliaes:3306（aliaes）访问mysql了（因为都同属于dev网络）
      dev:
        aliaes:
          - mysqlaliaes
networks: #docker-compose up之后，会创建一个默认网络"appname_default"；以下部分则是让开发者可以按需添加网络
  dev: 
    driver: bridge #默认桥接模式，可不填
  pro: 
  app:
    external: true #是否预先创建好的网络
extra_hosts: #等于在hosts文件中加上ip和域名映射
  162.242.195.82  somehost
  50.31.209.229   otherhost

```
***
#### 集群操作（Swarm）
***docker swarm init --advertise-addr [IP]***
初始化一个Docker的服务集群，并赋予它一个IP地址（一般是本机的IP地址）。

***docker swarm join-token manage / docker swarm join-token worker***
获取一个令牌（若需要将其他机器加入到集群，需要先获取令牌）

***docker swarm join [JOIN-TOKEN] [IP:PORT]***
将本机加入到一个Docker集群中，该Docker集群的地址为IP：PORT

***docker node ls***
查看集群里有多少节点，及节点的详细信息（主机名、是管理节点还是工作节点等）
该命令只能在管理节点里可用
***docker swarm leave***
本机退出当前集群
***
#### 服务操作

***docker service create -p 80:8080 --name my-nginx nginx***

***docker service ls***

***docker service ps [SERVICE_NAME]***

***docker service update --replicas 3 my-nginx***
创建3个服务的副本
***docker service scale my-nginx=5***
创建5个服务的副本
***docker service rm my-nginx***
移除服务
***

#### 其他操作
***docker --help***
查看docker帮助文档

***docker run --help***
查看run命令的帮助文档（其他命令同理）

***docker cp [CONTAINERID]:路径 本机路径***
将容器内的文件拷贝到本机

***docker volumn ls***
查看所有容器的卷挂载情况
```
DRIVER    VOLUME NAME
local     0d50d9bf15664fd57e7568d9e68f6d7a89a7dcc4ebcc1ac816b0ac0859a429db
local     firstvolume

#第一个是匿名卷，第二个是具名卷；
#前两个卷都维护在/var/lib/docker/volumes/ 里；
#若这两个卷里有文件的增减，则对应容器内对应的地址也会与卷内的情况同步
```

***docker volume inspect [VOLUME NAME]***
查看某个卷的信息
```
[
    {
        "CreatedAt": "2021-08-31T23:58:58+08:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/firstvolume/_data",
        "Name": "firstvolume",
        "Options": null,
        "Scope": "local"
    }
]
```

***docker logs [CONTAINER NAME] -f***
查看容器日志
-f：跟踪日志
--tail=10：仅显示最新10条日志

## 参考
Docker官方文档 [https://docs.docker.com/](https://docs.docker.com/)

官方Dockerfile、docker-entrypoint.sh： [https://github.com/docker-library](https://github.com/docker-library)

遇见狂神说：Docker入门系列视频

遇见狂神说：Docker进阶系列视频[https://www.bilibili.com/video/BV1kv411q7Qc](https://www.bilibili.com/video/BV1kv411q7Qc)


中文文档：[https://vuepress.mirror.docker-practice.com/](https://vuepress.mirror.docker-practice.com/)