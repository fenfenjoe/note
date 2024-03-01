---
title: Kubernetes实操笔记
sidebar: 'auto'
---

# Kubernetes实操笔记


### 参考

【kuboard：免费K8S教程（图文）】[https://kuboard.cn/learning/](https://kuboard.cn/learning/)

#### k8s单机环境：minikube（学习用）
##### 简介

**MacOS/Windows**  
minikube -> libmachine -> virtualbox/hyper V ->  
linux VM -> docker ->  localkube  
**Linux**  
minikube -> docker -> localkube

>libmachine：虚拟机的驱动程序，负责创建或销毁虚拟机  
>virtualbox/hyper V：开源的虚拟机管理软件  
>localkube：一个独立的Go 语言的二进制包，包含了所有 Kubernetes 的主要组件

>简单的说，在Mac和Windows系统下，minikube会创建一个虚拟机，并在虚拟机内通过docker去搭建一个单机版的k8s环境（localkube）；  
>而在Linux上，因为k8s可以直接运行，因此无需设置虚拟机。

##### 在Windows上安装minikube
https://minikube.sigs.k8s.io/docs/start/
下载windows版即可

##### minikube基本操作
```bash

#启动minikube
minikube start
#关闭minikube
minikube stop
#登录minikube上的虚拟机（虚拟机已内默认安装了docker）
minikube ssh
#打开minikube可视化界面
minikube dashboard
#查看minikube的k8s版本
kubectl version
```

#### k8s集群环境搭建

集群中，需要有至少1台的master节点以及1台node节点。
假设现有机器：
* k8s-master：192.168.178.171
* k8s-node1：192.168.178.172
* k8s-node2：192.168.178.173

##### 在master、node上安装k8s所需组件
1. 安装docker环境
   略
2. 启动docker服务
```bash
#设置docker服务自启动
systemctl enable docker.service

#启动docker服务
systemctl start docker.service
```
3. 搭建：kubeadm、kubelet、kubectl
```bash
#安装kubeadm、kubelet、kubectl
yum install kubelet-1.19.4 kubeadm-1.19.4 kubectl-1.19.4 -y

#设置kubelet服务自启动
systemctl enable kubelet.service

#查看有没有安装
yum list installed | grep kubelet
yum list installed | grep kubeadm
yum list installed | grep kubectl

#查看安装的版本
kubelet --version

#启动kubelet服务
systemctl start kubelet.service

```
##### master节点
1. 在master节点上安装k8s环境（参考上面）

2. 重启机器后，将本机初始化为Master节点
```bash
kubeadm init 
--apiserver-advertise-address=192.168.178.171 
--image-repository registry.aliyuncs.com/google_containers 
--kubernetes-version v1.19.4 
--service-cidr=10.96.0.0/12 
--pod-network-cidr=10.244.0.0/16
```
3. 见如下提示后，即k8s master节点部署成功
```bash
Your Kubernetes master has been initialized successfully!
...
kubeadm join --token 4ffccd2.asdfawierjll 192.168.178.171:6443
```
##### node节点
1. 在node节点中安装k8s环境（参考上面）

2. 在master上查看token
```bash
kubeadm token list
```
3. 使用token，向集群添加Node节点
```bash
kubeadm join 192.168.178.171:6443 --token=wa5bif.zfuvbesevdfvf4of 
```


### kubectl常用命令

#### 基础命令：create，delete，get，run，expose，set，explain，edit
**查看帮助**
```bash
#查看所有命令及简介
kubectl --help 
#查看run命令用法
kubectl run --help
#查看pod资源清单有哪些属性
kubectl explain pod
#查看pod资源清单的metadata有哪些属性
kubectl explain pod.metadata
```

**创建、运行资源**
```bash
#直接创建并运行pod（不用资源清单）
#示例，运行一个名称为nginx，副本数为3，标签为app=example，镜像为nginx:1.10，端口为80的容器实例
kubectl run nginx 
--replicas=3 
--labels="app=example" 
--image=nginx:1.10 
--port=80

#根据资源清单创建development
kubectl create -f mydeployment.yaml

#根据资源清单创建development（推荐使用）
#不但能创建资源，若资源已存在，还能根据资源清单对资源进行更新
kubectl apply -f mydeployment.yaml

```

**将资源暴露为Service**
```bash
#为名为nginx的rc创建service，并通过service 的80端口转发到容器的8000端口上
kubectl expose rc nginx --port=80 --target-port=8000

#根据资源清单中指定的type和name，找到对应的rc，并未rc创建service；并通过service 的80端口转发到容器的8000端口上
kubectl expose -f nginx-controller.yaml --port=80 --target-port=8000
```


**删除资源**
```bash
#根据资源清单删除development
kubectl delete -f mydeployment.yaml
#根据名称删除development
kubectl delete 资源名
```

**查看资源信息**
```bash
#查看所有的资源信息
kubectl get all
#查看pod列表
kubectl get pod
#显示pod节点的标签信息
kubectl get pod --show-labels
#根据指定标签匹配到具体的pod
kubectl get pods -l app=example
#查看node节点列表
kubectl get node 
#显示node节点的标签信息
kubectl get node --show-labels
#查看pod详细信息，也就是可以查看pod具体运行在哪个节点上（ip地址信息）
kubectl get pod -o wide
#查看服务的详细信息，显示了服务名称，类型，集群ip，端口，时间等信息
kubectl get svc
[root@master ~]# kubectl get svc
NAME            TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
go-service      NodePort    10.10.10.247   <none>        8089:33702/TCP   29m
java-service    NodePort    10.10.10.248   <none>        8082:32823/TCP   5h17m
kubernetes      ClusterIP   10.10.10.1     <none>        443/TCP          5d16h
nginx-service   NodePort    10.10.10.146   <none>        88:34823/TCP     2d19h
#查看命名空间
kubectl get ns
#查看所有pod所属的命名空间
kubectl get pod --all-namespaces
#查看所有pod所属的命名空间并且查看都在哪些节点上运行
kubectl get pod --all-namespaces  -o wide
#查看目前所有的replica set，显示了所有的pod的副本数，以及他们的可用数量以及状态等信息
kubectl get rs
[root@master ~]# kubectl get rs
NAME                          DESIRED   CURRENT   READY   AGE
go-deployment-58c76f7d5c      1         1         1       32m
java-deployment-76889f56c5    1         1         1       5h21m
nginx-deployment-58d6d6ccb8   3         3         3       2d19h
#查看目前所有的deployment
kubectl get deployment
[root@master ~]# kubectl get deployment
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
go-deployment      1/1     1            1           34m
java-deployment    1/1     1            1           5h23m
nginx-deployment   3/3     3            3           2d19h
#查看已经部署了的所有应用，可以看到容器，以及容器所用的镜像，标签等信息
 kubectl get deploy -o wide
[root@master bin]# kubectl get deploy -o wide     
NAME    READY   UP-TO-DATE   AVAILABLE   AGE   CONTAINERS   IMAGES       SELECTOR
nginx   3/3     3            3           16m   nginx        nginx:1.10   app=example
```

#### 部署命令：rollout，rolling-update，scale，autoscale

**rollout命令（作用于deployments，daemonsets）**
```bash
kubectl rollout SUBCOMMAND
```
子命令（SUBCOMMAND）包括：

history（查看历史版本）
pause（暂停资源）
resume（恢复暂停资源）
status（查看资源状态）
undo（回滚版本）

```bash
#回滚到之前的deployment
kubectl rollout undo deployment/abc
#查看daemonet的状态
kubectl rollout status daemonset/foo
```

**rolling-update命令（作用于RC）**
用于滚动更新。

**scale命令（作用于Deployment、RS、RC、Job）**
对资源中的pod进行扩容或缩容。


**autoscale命令（作用于Deployment、RS、RC、Job）**
对资源中的pod进行自动扩缩容。



#### 集群故障排查和调试命令：describe，logs，exec，attach，port-foward，proxy，cp，auth
```bash
#describe：查看资源的详细信息
kubectl describe TYPE NAME_PREFIX
#TYPE：pod、deployment、service、node、rc等（可以用缩写）
#NAME_PREFIX：资源名称or资源名称前缀

#logs：打印pod中容器的日志（若只有一个容器，可以省略容器名）
kubectl logs [-f] [-p] POD [-c CONTAINER]
#-c：容器名
#-f：是否滚动输出日志（默认false）
#-p：输出pod中曾经运行过、但现在已终止的容器的日志

#exec：进入容器（与Docker的exec类似）
kubectl exec POD [-c CONTAINER] -- COMMAND [args...]
#命令选项
#-c, --container="": 容器名。如果未指定，使用pod中的一个容器。
#-p, --pod="": Pod名。
#-i, --stdin[=false]: 将控制台输入发送到容器。
#-t, --tty[=false]: 将标准输入控制台作为容器的控制台输入。

#attach：连接到一个正在运行的容器
kubectl attach -c CONTAINER

#cp：拷贝文件或者目录到pod容器中
```

### K8S实战

#### 在Minikube部署一个SpringBoot微服务容器
1. 将镜像打包好上传到远程仓库（略）
2. （如果是私有仓库）在Minikube从仓库下载镜像
```bash
#连接minikube
minikube ssh
#登录仓库（若不填仓库地址，则默认为Dockerhub）
docker login -u [用户名] -p [密码] [私有仓库URL，不填则默认登录中央仓库]
#拉取镜像
docker pull azil/eureka-server:1.0-SNAPSHOT
```
3. 创建Deployment。通过资源清单部署：创建development.yaml
```yaml
apiVersion: apps/v1  #kubectl api-versions 可以通过这条指令去看版本信息
kind: Deployment # 指定资源类别
metadata: #资源的一些元数据
  name: eureka-server-deployment #deloyment的名称
  labels:
    app: eureka-server-deployment  #标签
spec:
  replicas: 2 #创建pod的个数
  selector:
    matchLabels:
      app: eureka-server #满足标签为这个的时候相关的pod才能被调度到
  template:
    metadata:
      labels:
        app: eureka-server
    spec:
      containers:
        - name: eureka-server
          image: azil/eureka-server:1.0-SNAPSHOT #镜像名+标签名
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8761
  
```


```bash
kubectl apply -f ./deployment.yaml

```

4. 创建Service。

【方法1：通过命令部署】
```bash
#此时，在本机已经可以通过localhost:8761访问微服务，但集群中的其他机器不行
#因此需要将服务暴露出来
#以下命令创建一个Service，将容器的8761端口映射到Node的某个端口中
kubectl expose deploy eureka-server --type=NodePort --target-port=8761

#查看容器与Node的端口映射情况
kubectl get svc eureka-server
NAME ... PORTS
eureka-server 8761:32425/TCP
```
【方法2：通过资源清单部署：创建service.yaml】
```yaml
apiVersion: v1
kind: Service
metadata:
  name: sample-web-service	#Service 的名称
  labels:     	#Service 自己的标签
    app: sample-web	#为该 Service 设置 key 为 app，value 为 nginx 的标签
spec:	    #这是关于该 Service 的定义，描述了 Service 如何选择 Pod，如何被访问
  selector:	    #标签选择器
    app: sample-web	#选择包含标签 app:nginx 的 Pod
  ports:
  - name: sample-web-port	#端口的名字
    protocol: TCP	    #协议类型 TCP/UDP
    port: 8080	        #集群内的其他容器组可通过 80 端口访问 Service
    nodePort: 8080   #通过任意节点的 8080 端口访问 Service
    targetPort: 8080	#将请求转发到匹配 Pod 的 80 端口
  type: NodePort	#Serive的类型，ClusterIP/NodePort/LoaderBalancer
```

```bash
kubectl apply -f nginx-service.yaml
```



4. 访问微服务
   localhost:32425


#### 查看本机部署情况

```bash
#查看已有的deployment
kubectl get deployment 

#查看已有的pod
kubectl get pod

#查看已有的service
kubectl get services -o wide 

```


#### 在K8S部署Mysql集群
