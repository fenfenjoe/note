---
title: Kafka
sidebar: 'auto'
---

# Kafka

### 简介
作用：分布式消息队列中间件  
语言：scala（0.9版本之前）、java（新版）  
依赖：zookeeper（0.5.x后kafka内置了zookeeper的单机版环境）

### 参考
【kafka的版本号与版本演进】[https://blog.csdn.net/liuxiao723846/article/details/106020738/](https://blog.csdn.net/liuxiao723846/article/details/106020738/)  
【apache kafka技术分享系列(目录索引)】[https://blog.csdn.net/lizhitao/article/details/39499283](https://blog.csdn.net/lizhitao/article/details/39499283)  
【知乎：kafka(一) 消息队列的本质】[https://zhuanlan.zhihu.com/p/355343254](https://zhuanlan.zhihu.com/p/355343254)  
【Kafka知识总结之Broker原理总结】[https://blog.csdn.net/yhflyl/article/details/123582735](https://blog.csdn.net/yhflyl/article/details/123582735)

### 使用场景
1. 日志分析、系统监控、用户行为追踪（Kafka是著名的ELK系统中的一部分）
2. 大数据中做数据分流：（流数据处理、离线数据分析、在线数据分析）
    * 分流到离线存储平台（HDFS）
    * 分流到离线计算平台（Hive仓库）
    * 分流到实时流水计算（Storm，Spark）
    * 分流到海量数据查询（HBase）
    * 分流到及时查询（ElasticSearch）
3. 应用程序

### 基本概念

![kafka.png](/images/Kafka.png)

**生产者（Producer）**  
发送消息的程序

**消息（Message）**  
存储在分区中，一个分区就是一个消息队列；  
无论是否被消费，消息都会存储在消息队列中；  
消息有过期时间，过期后会被自动清除；

**代理（Broker）**  
相当于一台物理主机。上面运行着kafka进程。存储kafka消息的实际地方。  
Broker又分为Controller Broker和普通的Broker。

> Controller Broker，又称为Leader Broker，主要作用是在ZooKeeper 的帮助下管理和协调整个 Kafka 集群。
> * 创建、删除主题，增加分区并分配leader分区
> * 集群Broker管理（新增 Broker、Broker 主动关闭、Broker 故障)
> * preferred leader选举
> * 分区重分配
    > 集群启动时，会从所有Broker中选举出一个作为Controller。

**Zookeeper**  
负责存储Broker的元信息，包括Broker保存了哪些Topic，有哪些分区Partition等。

**消费者（Consumer）**  
接收消息的程序

**消费者组（Consumer Group）**  
多个消费者可以划分成一个消费者组。每个消费者组对一条消息只能处理一次。  
消费者默认属于default消费者组。

**主题（Topic）**  
逻辑上的一个消息组。一个Topic还可以分成多个Partitions，存在不同的Broker里。

**分区（Partitions）**  
Partitions是存储的最小单位。  
一个Broker里可存储多个Partitions。  
同一消费者组中，每个Partition只能由一个消费者负责。


**副本（Replication）**  
Replication是分区的副本，副本不会跟分区存到同一个Broker上。  
分区的副本数不能大于Broker的数量。否则会抛出异常。

**偏移量（Partition Offset）**  
可理解为“指针”、“分区消息数组的下标”；  
分区会为不同的消费者组维护各自的偏移量；  
表示消费者组消费到分区中的哪一条消息；


### FAQ
#### 1.kafka是做什么的？
一个分布式消息队列中间件（MQ）。

kafka负责接收生产者（APP）发送过来的消息，并将这些消息转发给消费者（另一些APP）；

#### 2.kafka消息类型
* Avro消息（官方推荐）
* Json
* XML
* Java Bean
#### 3.kafka消息如何流转

**创建主题**  
需要先在kafka创建好**主题（Topic）**，kafka会根据接收到的消息按主题进行分类；  
创建主题时，还需要指定主题的**分区数（partitions）** 和**副本（replication-factor）数**。

**消息发送**  
生产者在发送消息前，需要指定消息发送到哪个主题(Topic)。

kafka实际用分区(partition)来存储消息。因此生产者还需要指定将消息发送到哪个分区。

> **生产者如何选择分区(partition)?** 
> 生产者可从kafka集群的任意broker中，获得所有kafka broker的元信息。包括topic有多少个分区(partition)，各个分区的leader在哪个broker等。  
> 取得partition地址列表后，Producer需要指定负载均衡策略，主动选择消息发送到分区的策略。  
> 有以下几种策略：
> * 轮询
> * 随机
> * 基于某个key

配置好负载均衡策略后，每次Producer发送消息时，便会自动根据策略选择分区(partition)。



**消息接收**  
发送消息时会指定**主题（Topic）**，消费者只接收自己关注的主题的消息；

>就像微博、Twitter这样，关注某个博主后就会收到该博主的动态信息。

还可以对消费者分组（Group）。但同一组内的消费者，不会接收到同一分区的消息。

>这样设计是为了确保分组（Group）接收到主题（Topic）的消息是没有重复的


**消息消费**  

1. 消费者和Kafka各自维护着该Topic的一个偏移量（offset），表示它已经成功消费到哪个位置。
2. 当有新消息到达Kafka中，Kafka不会主动推新消息给消费者；相反，由消费者在下一次拉取请求中发现这些新消息。
3. 消费者通过**长轮询（long poll）** 机制，去监听Topic是否有新消息。
4. 消费者通过比较**上次提交的偏移量**和**Kafka中存储的偏移量**来确定Topic中是否有新消息可以消费。
5. 当处理完消息后，消费者可以选择**手动提交偏移量**或**自动提交偏移量**



#### 4.kafka的消息如何持久化？
消息保存在**日志文件**中；新增一条消息 = 向日志文件追加内容。

通过内存来缓存消息，并会尽快写入到日志文件中。

写入到日志文件的消息**默认会保留7天**。



#### 5.kafka如何做负载均衡？
**对Producer的负载均衡：**  
对于某个Topic，kafka会将Zookeeper中维护的该Topic的“存活Broker列表/存活Partition列表”提供给Producer，由Producer自己决定将消息发送到哪里（由Producer自己做负载均衡）。

**对Consumer的负载均衡：**  
在Consumer Group中，有Consumer的加入或离开，便会触发Partition均衡：  
- 假设有4个Consumer（ABCD），8个Partition（12345678）  
    每个Consumer两个分区：A=12,B=34,C=56,D=78  

- 假设有8个Consumer（ABCDEFGH），4个分区（1234）  
    因为同一Group中的Consumer不能消费同一个分区，因此：A=1,B=2,C=3,D=4,E=null,...

#### 6.kafka的副本（replication）机制？
kafka可为每个partition设置副本，副本会被存储到不同的Broker上，并且副本的数据与partition本身会保持一致。

副本分为两种类型：Leader和Follower；

Leader负责处理read-write请求，Follower负责同步Leader中的数据；

每个partition的副本中，都会有1个Leader和0~N个Follower；

只要有一个副本存活，那么该partition也能正常工作；

**当有新消息进来，所有Follower都将消息保存成功后，这条消息才算Commited，Consumer才能消费这条消息。**

#### 7.什么是AR、ISR、OSR？
AR：Assigned Repllicas，即副本。分区的所有副本统称AR。  
ISR：In-Sync Replicas，分区中能与leader保持一定程度同步的副本，统称ISR。  
OSR：Out-Sync Relipcas，分区中与leader相比滞后过多的副本，统称OSR。  
因此AR=ISR+OSR。  
kafka可以忍受的“滞后”的程度可以通过参数配置。


#### 8.kafka的选举机制
kafka在三个地方用到了选举机制：
- Broker之间选leader
- Partition的多副本之间选leader
- 消费者组中消费者之间选leader

【Broker Leader】
Leader的作用：
* 创建、删除主题，增加分区并分配leader分区
* 集群Broker管理（新增 Broker、Broker 主动关闭、Broker 故障)
* preferred leader选举
* 分区重分配

怎样触发Leader选举：
* kafka集群启动

【Replica Leader】
Leader的作用：

怎样触发Leader选举（Rebalance）：
* Leader 副本下线
* 手动运行 kafka-reassign-partitions 命令
* 设置broker端参数auto.leader.rebalance.enable为true（默认值），这样controller定时自动调整preferred leader
* Leader 副本所在Broker 正常关闭

如何选举：
* 从Zookeeper中读取当前分区的所有ISR(in-sync replicas)集合
* 调用配置的分区选择算法选择分区的leader(默认：当前分区副本列表(AR)中首个存活且处于 ISR 列表中的副本作为 Leader 副本)


#### 9.kafka集群的异常情况：脑裂

略


#### 10.Zookeeper在Kafka集群中有什么作用？
Broker、Consumer的注册中心；  
监控Partition Leader的存活性；

#### 11.kafka能保证消息按顺序消费吗？
可以，但需要生产者在发消息时，设置一个key，然后kafka会根据这个key将消息都发往同一个partition中；  
然后，因为一个partition只能由同一消费者组中的一个消费者消费，所以便保证了顺序消费。

#### 12.kafka的事务控制

1. 假设你的是SpringBoot项目，需要application.properties处添加事务的配置

```properties
# 启用幂等性生产者（使用事务必须）
spring.kafka.producer.properties.enable.idempotence=true
# 隔离级别（默认值是read_uncommitted‌）
spring.kafka.producer.properties.isolation.level=read_committed
```

2. 创建KafkaTemplate并添加事务管理器

```java
@Configuration
public class KafkaProducerConfig {

    @Bean
    public ProducerFactory<String, String> producerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
        // 其他配置...

        return new DefaultKafkaProducerFactory<>(configProps);
    }

    @Bean
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    @Bean
    public KafkaTransactionManager<String, String> kafkaTransactionManager() {
        return new KafkaTransactionManager<>(producerFactory());
    }
}
```

3. 使用KafkaTemplate发送事务消息

```java
@Service
public class KafkaService {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendTransactionalMessage() {
        kafkaTemplate.executeInTransaction(operations -> {
            try {
                operations.send("topic1", "key1", "value1");
                operations.send("topic2", "key2", "value2");
                // 其他业务逻辑...
                // 如果一切正常，事务会自动提交
            } catch (Exception e) {
                // 如果发生异常，事务会自动回滚
                throw e;
            }
        });
    }
}
```


### 实际操作
#### 下载
http://kafka.apache.org/downloads

#### 安装
解压即可
#### 配置
**/config/server.properties（重要）**  
Kafka服务器配置  
broker.id ：当前Kafka服务器在集群中的唯一ID  
listeners ： 当前Kafka服务器监听的端口（默认9092）  
zookeeper.connect ： 当前Kafka服务器连接的zookeeper地址（默认为localhost:2181）


**/config/consumer.properites**  
消费者配置   
**/config/producer.properties**  
生产者配置

#### 启动
0. 注意事项
* JDK路径中不能有空格或括号，不然会遇到以下情况：
```bash
F:\DataBase\kafka_2.12-3.0.0\bin\windows>zookeeper-server-start.bat ../../config/zookeeper.properties

此时不应有 \Java\jdk1.8.0_73\lib
```
* JDK的bin文件夹下需要有server文件夹，若没有，则需要到jre/bin中拷贝过来，否则会遇到以下情况：
```bash
F:\DataBase\kafka_2.12-3.0.0\bin\windows>zookeeper-server-start.bat ../../config/zookeeper.properties

Error: missing `server' JVM at `F:\jdk\jdk1.8.0_60\bin\server\jvm.dll'.
Please install or use the JRE or JDK that contains these missing components.
```
1. 启动Zookeeper
```bash
#在Kafka解压目录下，启动Kafka自带的Zookeeper
#Linux
bin/zookeeper-server-start.sh config/zookeeper.properties
#Windows
bin/windows/zookeeper-server-start.bat ../config/zookeeper.properties
```
2. 启动Kafka服务器
```bash
#在Kafka解压目录下
bin/kafka-server-start.sh config/server.properties
```
#### Topic操作
**创建Topic**
```bash
#注意！这个创建Topic的同时还会导入数据。
#数据量比较大（差不多有1G），建议单机版不要用这个进行测试
bin/kafka-topics.sh --create --zookeeper 
localhost:2181 --replication-factor 1 --partitions 1 --topic test
```
**查看Topic**
```bash
bin/kafka-topics.sh --list --zookeeper localhost:2181
```

### Java Spring-Boot集成Kafka

#### kafka生产者

maven -- pom.xml
```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

application.yml
```yaml
# 更多配置见：https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#appendix.application-properties
spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      # 消息重发的次数
      retries: 0
      # 一个批次可占多少内存
      # 批次（batch）：生产者可以以批次的形式推送消息，一个批次包含多条消息；
      # 可设置什么时候推送批次：批次中消息累计数量（500条）、时间间隔（100ms）、批次大小（64KB）等
      batch-size: 16384
      # 生产者内存缓冲区大小
      buffer-memory: 33554432
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
      acks: all
```

#### kafka消费者

略