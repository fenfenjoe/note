---
title: Hadoop学习笔记
sidebar: 'auto'
---

# Hadoop学习笔记

### 参考
《Hadoop权威指南》

### 简介
底层语言：Java  
Apache官网：https://hadoop.apache.org/

特点：
* 数据本地化：在计算节点上存储数据，实现数据的快速访问；（区别于“高性能计算”和“网格计算”）
* 无共享（shared-nothing）框架：各台机器上的任务彼此独立，而且MapReduce提供失败检测

设计目标：
1. 为只需几分钟或几小时可完成的作业提供服务；（意思是最好一天内？）
2. 运行于一个内部有高速网络连接的数据中心；（意思是不要跨区域的机器）
3. 数据中心内的计算机都是可靠、定制的硬件；（意思是尽量自己部署的机器）

版本兼容性：  
大版本之间是允许破坏API兼容性的（即1.x的版本和2.0版本的API会不兼容）；

两大组件：
* HDFS
* MapReduce



### HDFS

HDFS是Hadoop体系内的一个分布式文件系统框架。

用户在Linux上安装好HDFS后，启动HDFS的客户端（client），通过HDFS提供的命令行操作，便可在该分布式文件系统中做增加、删除、查询文件等的操作。

#### 优点
* 高容错：数据冗余、多副本，数据丢失可恢复
* 高可用：NameNode HA、安全模式
* 高扩展：支持10000个节点规模
* 海量数据存储：典型文件大小GB~TB，PB以上数据规模
* 构建成本低：可部署到价格低廉的服务器上
#### 缺点
* 不支持低延迟访问
* 不适合大量小文件存储
* 不支持文件的并发写入（可并发读）
* 不支持文件的随机修改


#### 架构
HDFS集群是由一个NameNode节点（也可以多一台做热备）和多个DataNode节点组成。  
简单的说，DataNode负责存储文件，NameNode负责管理DataNode节点。


##### NameNode（管理节点）
相当于一个管理进程，负责内容如下：
* 负责集群中DataNode的元数据维护、状态同步；
* client端发送过来的请求后，NameNode负责将DataNode的信息返回给client端（相当于路由的功能），然后client端直接与DataNode联系
* 管理Block副本策略（什么是Block？见DataNode的说明）：默认是3个副本，即默认一个块在3个DataNode节点中都有保存副本。

NameNode还提供**热备功能**：
* Active NameNode：活动的Master管理节点（唯一）
* Standby NameNode：热备管理节点，Master挂掉后自动顶上，升级为Master；

> Hadoop3.0后才支持有多个Standby NameNode


NameNode维护的元数据信息都保存在内存中。这些元数据信息是怎么持久化的呢？
> 通过周期性同步的方式，将内存中的元数据信息以fsimage和edits的形式保存到硬盘。  
> 其中，fsimage相当于内存快照，即某段时间内存里的数据；  
> edits是操作日志，只会记录写操作；


###### 元数据文件详解
**fsimage（元数据检查点镜像文件）**  
NameNode运行期间内存的元数据信息，会在执行**元数据检查点（Checkpoint）** 后，被持久化成一个fsimage，保存到文件系统中。元数据信息包括：  
目录下有哪些文件、文件名、副本数、文件由哪些Block组成等。

**edits（操作日志文件）**  
保存了**元数据检查点**后的所有文件更新操作。

> 对**元数据检查点（Checkpoint）** 的理解：  
> 实质是一次将fsimage与edits合并的，生成一个新的fsimage的操作。  
> 因为对fsimage执行edits中的操作后，就可以得到最新的数据。因此可通过Checkpoint还原当时内存里的数据情况。  
> 当集群规模过大，为了减轻NameNode的负担，可将Checkpoint交由**Secondary NameNode** 或者**Standby NameNode** 负责




##### DataNode（存储节点）

HDFS将需要存储的大文件切割成块（Block），存储在DataNode进程所在的节点中。一般一个节点部署一个DataNode进程。  
不同版本，块切割的大小不一样：
* Hadoop1.0 1Block=64MB
* Hadoop2.0 1Block=128MB

DataNode的特点：
* 可大规模扩展
* 保存Block
* 通过心跳机制（默认3s）向NameNode汇报自己的状态和Block信息
* 执行client的读写请求


#### HDFS命令行操作
**启动集群**
```bash
/usr/local/hadoop/sbin/start-dfs.sh
```
**查看集群中节点信息**
```bash
hdfs dfsadmin -report
```
**文件操作（hdfs dfs）**
```bash
#跟hadoop fs命令一样
hdfs dfs 
    -mkdir <目录名> #创建目录
    -touchz <文件名> #创建文件
    -rmr <目录名> #删除目录
    -rm <文件名> #删除文件
    -ls #查看目录
    -cat <文件名> #查看文件内容
    -put <本地路径> <hdfs路径> #上传文件或目录到HDFS
    -copyToLocal <hdfs路径> <本地路径> #从HDFS下载文件或目录
```


#### HDFS的配置


#### 源码学习部分

### MapReduce

分为map和reduce两个步骤，处理输入的数据。

#### MapReduce示例
以下简单示例：用MapReduce统计每月出生最多人数。

第一阶段：初始输入参数（本地文本数据）
```txt
#出生年月|姓名|性别
200001张三男
200001李四女
200101王五男
200002梁六女
040510王琪男
...
```


第二阶段：map函数  
以年为key、姓名为value，提取文本数据；  
并将脏数据过滤掉（如040510王琪男这一行）。  
得到key-value数据数组
```
（200001,张三）,
（200001,李四）,
（200101,王五）,
（200002,梁六）
```

第三阶段：MapReduce框架（shuffle）  
1.根据键进行分组；  
2.根据键进行排序；  
得到```Map<key,List<value>>```
```
200001,[张三,李四]
200002,梁六
200101,王五
```

第四阶段：reduce函数  
取出分组中的人数。
```
200001,2
200002,1
200101,1
```
统计完成，整个流程结束。

以上展示了少量数据的情况下MapReduce的执行流程。然而在涉及到大量数据时，数据需要存储在分布式文件系统（HDFS）。

#### 概念

**分片（split）**
Hadoop会将输入数据分成等长的分片，并为每个分片执行map任务。  
一个分片的默认大小是HDFS的一个块，64MB。

**任务**
MapReduce将任务分词若干小任务（task）：

* map任务：
>一个分片对应一个map任务；  
>多个map任务会在多个节点上执行；  
>输出数据保存到文件系统而非HDFS

* reduce任务:
>将所有map任务的输出合并，作为输入；  
>自定义执行的数量；输出到HDFS


**分区（partition）**  
当reduce任务有多个时，会将map任务的输出按reduce进行分区（partition）；  
分区会按照用户指定的partition函数进行，每个reduce一个分区；  
默认的分区函数是按哈希函数来分区；  
每个分区有许多键，同一个键的键值对记录都会保存在同一分区；

**combiner**



**节点（物理机器）**  
JobTracker节点：负责调度MR（MapReduce）任务，来协调整个系统上运行的任务  
TaskTracker节点：负责运行MR任务，并将报告发送给JobTracker节点  


