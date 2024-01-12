---
title: RocketMQ
---

# RocketMQ

# RocketMQ学习笔记

## 参考
Gitee中文开发者文档：[https://gitee.com/apache/rocketmq/tree/master/docs/cn#/apache/rocketmq/blob/master/docs/cn/concept.md](https://gitee.com/apache/rocketmq/tree/master/docs/cn#/apache/rocketmq/blob/master/docs/cn/concept.md)

## 原理

* RocketMQ有哪些角色？
    - NameServer  
      特点：轻量级，无状态，地位是一个注册中心，作用类似于Eureka、Zookeeper，负责记录Broker、Producer、Consumer的路由信息
    - Broker  
      MQ服务器的本体，负责接收、储存、发送消息，多台Broker构成一个MQ集群
    - Producer  
      生产者，消息的发送方
    - Consumer  
      消费者，消息的处理方

  > 这里说的“NameServer是无状态的”是什么意思？
  > 指NameServer间无需同步数据，无需通信，维护的数据无需做到强一致性。

* RocketMQ消息发送、存储、消费的流程？
    - Producer向指定的Topic发送一条消息
    - Producer会从NameServer获得Broker列表中，选择一个Broker向其发送
    - Broker收到消息后，会将其保存到CommitLog文件中

* Broker如何对消息进行持久化？
  主要依靠3类文件：
    - commitLog（数据文件，1G1个文件）
    - consumeQueue（基于Topic的索引文件）
    - indexfile（基于Key或时间的索引文件）  
      有两种方式：
    - 同步刷盘：即保存到硬盘后才给Producer发ACK确认，保证数据不会丢失，但性能较差；
    - 异步刷盘：保存到PageCache（内存）中便给Producer发ACK确认，性能较快，但有数据丢失的可能

* 如何保证数据不丢失？
    - 生产者：
        1. 增加一个重新发送机制：发送消息成功后，我们将Message以Json形式保存到数据库的一张表中，并设置状态“已发送”；
           然后设置一个轮询器（Schedular）,定时查出未发送的Message，并重新发送；
           当消费者端需要我们重发消息，只要修改表中该Message的状态为“未发送”，轮询器便会重新发送。
    - Broker：
        1. 采用同步刷盘的方式持久化消息；
        2. 集群模式下，主Broker和从Broker间采用同步复制，即等待从Broker复制消息完成后才返回ACK确认
    - Consumer：
        1. offset手动提交
        2. 建立一种补偿机制，即把每条需要消费的消息都保存到库里，若因为某些原因，这条消息消费不成功，也可以自己重新消费一遍。


* 如何保证消息按顺序让消费者消费？
    - 保证消息由同一线程发送（默认单线程发送）
    - 保证消息保存到同一个Queue（发送时，可以通过入参MessageQueueSelector选择固定的Queue）
    - 保证消息发送到同一Topic（往同一Topic发送消息即可）
    - 保证消息由同一个线程消费



* 如何避免消息重复消费？
    - 导致重复消费的原因是：Consumer消费完并发送ACK确认，但因网络原因，Broker没收到，因此重新推送了一次消息，导致再消费了一次。
    - 如何避免：
        - 保证消息消费幂等（如下）。

* 消费者如何保证幂等（即如果一条消息发出去多次，保证只会被消费一次）？
    - 消费者是单机：取到数据的ID，存到 ConcurrentHashMap -> putIfAbsent() ，或者guava、cache里
    - 消费者是集群：取到数据的ID，存到Redis；
    - 消费前先看这条数据的ID是否已经被保存了，如果是，则证明之前已经被消费过了，不再重新消费。




* RocketMQ是如何做负载均衡的？
  > 参考资料：https://blog.csdn.net/Weixiaohuai/article/details/123898841

  Topic在多个Broker中分布式存储。生产者、消费者按照一定的策略，向Broker发送、接收消息。

  分为生产者负载均衡（生产者将消息发送给哪个Broker）、消费者负载均衡（消费者向哪个Broker监听消息）。

  【生产者负载均衡】

  原理：Round-Robin（完全轮询）算法，即获取Topic的所有Queue，每次发送按顺序选择一个Queue发送。
  看源码可知，生产者（底层是用DefaultMQProducerImpl）向Topic发送消息时，会调用mqFaultStrategy.selectOneMessageQueue来选择Queue。




【消费者负载均衡】

看源码可知，消费者（DefaultMQPushConsumer）在构造函数中，有一个入参是AllocateMessageQueueStrategy，就是用来配置消费者的负载均衡策略。
AllocateMessageQueueStrategy是一个接口，有以下几个实现类：
- AllocateMessageQueueAveragelyByCircle（环形分配策略）
- AllocateMessageQueueByConfig（手动配置分配策略）
- AllocateMessageQueueConsistentHash（一致性哈希分配策略）
- AllocateMessageQueueAveragely （平均分配策略，默认）
- AllocateMessageQueueByMachineRoom（机房分配策略）
- AllocateMachineRoomNearby（靠近机房策略）

MessageListener默认使用AllocateMessageQueueAveragely。

下面详细说说每种策略的原理。
假设现在有10个Queue，有4个Consumer。这些Queue如何分配给Consumer呢？
Queue：1~10
Consumer：A、B、C、D

**平均分配策略**  
根据avg = QueueCount / ConsumerCount，计算出每个Consumer负责多少个Queue，除不尽多出来的则按顺序分到Consumer上。  
最后：  
A：1、2、9  
B：3、4、10  
C：5、6  
D：7、8

**环形分配策略**  
将Consumer按ID顺序组成一个环形，然后Queue按顺序分配给Consumer。  
最后：  
A：1、5、9  
B：2、6、10  
C：3、7  
D：4、8

**一致性哈希分配策略**  
将Consumer和Queue都求出一个哈希值，然后按照哈希值组成一个环形，离Queue最近的Consumer负责消费它。


* Spring是如何加载和管理RocketMQListener的？

    1. Spring启动时，会加载Rocketmq的自动配置类ListenerContainerConfiguration
    2. ListenerContainerConfiguration实现了SmartInitializingSingleton接口，当Spring加载完所有Bean后，会执行里面的afterSingletonsInstantiated()方法
       此时会为每个RocketMQMessageListener注册一个Container（DefaultRocketMQListenerContainer）。
    3. Container实现了InitializingBean接口，当Spring初始化Container Bean的时候，便会调用其afterPropertiesSet()方法，此时为RocketMQListener初始化consumer
       afterPropertiesSet() -> initRocketMQPushConsumer() -> 配置Consumer（NameServer、超时时间、MessageModel（广播还是集群）、Tag、消费模式（串行还是并发））
    4. 注册完后，会调用container.start()方法，启动Listener去监听对应的Topic

* 不用Spring的时候，如何使用Rocketmq？
```java
public class Test{
    
        /**
        * 生产者
        **/
        public static DefaultMQProducer getRocketMQProducer() {
            DefaultMQProducer producer;
          //生产者组是test-demo
            producer = new DefaultMQProducer("test-demo");
          //NameServer
            producer.setNamesrvAddr("192.168.10.50:9876;192.168.10.22:9876");
          //超时时间定义为10s
            producer.setRetryTimesWhenSendFailed(10000);
            try {
                producer.start();
            } catch (MQClientException e) {
                System.out.println(e);
            }
            return producer;
        }

      /**
      * 发送同步消息 
      **/
      public static void  sendSysMes() throws MQClientException, RemotingException, MQBrokerException, InterruptedException{
          DefaultMQProducer producer = getRocketMQProducer();
            Message msg = new Message();
              msg.setTopic("test-demo");
              msg.setTags("test1");
              msg.setBody("ok".getBytes());
            producer.shutdown();
      }

        /*
        * 消费者监听器  
        */
        public static void consumeMessage() throws MQClientException{
        //消费者组：test-demo
        DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("test-demo");
        consumer.setNamesrvAddr("192.168.10.50:9876;192.168.10.22:9876");
        //订阅主题topic以及tag  tag为*代表全部
        consumer.subscribe("test-demo", "*"); 
        //设置消费者模式  广播或者负载均衡模式   默认为负载均衡模式
        consumer.setMessageModel(MessageModel.CLUSTERING);  
        
        consumer.registerMessageListener(new MessageListenerConcurrently() {
          @Override
          public ConsumeConcurrentlyStatus consumeMessage(List<MessageExt> msgs, ConsumeConcurrentlyContext context) {
            try {
              for (MessageExt message : msgs) {
                String msgbody = new String(message.getBody(), "utf-8");
                System.out.println("消息体内容为    "+msgbody+"           "+"详细信息: " + msgs);
                if (msgbody.equals("HelloWorld - RocketMQ")) {
                  System.out.println("======错误=======");
                }
              }
            } catch (Exception e) {
              e.printStackTrace();
              if (msgs.get(0).getReconsumeTimes() == 3) {
                // 该条消息可以存储到DB或者LOG日志中，或其他处理方式
                return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;// 成功
              } else {
                return ConsumeConcurrentlyStatus.RECONSUME_LATER;// 重试
              }
            }
            return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
          }
        });
        
        consumer.start();
        System.out.println("Consumer Started.");
        }
        
        }
  
      


```



## 实战

### 本机安装&配置&启动

#### 安装

略

#### 修改配置

配置文件所在路径： /usr/local/rocketmq/conf

#### 启动

项目路径：/usr/local/rocketmq/bin



先启动NameServer：

```bash
#指定NameServer的配置文件
nohup sh mqnamesrv -c namesrv.conf >/dev/null 2>&1 &
```



*namesrv.conf主要配置项

| 配置项                | 默认值 | 说明                    |
| --------------------- | ------ | ----------------------- |
| listenPort            | 9876   | 监听端口                |
| serverWorkerThreads   | 8      | Netty业务线程池线程个数 |
| serverSelectorThreads | 3      | NettyIO线程池线程个数   |

再启动Broker：

```bash
#指定Broker的配置文件
nohup sh mqbroker -c ../conf/broker.conf >/dev/null 2>&1 &
```

| 配置项             | 默认值         | 说明                                            |
| ------------------ | -------------- | ----------------------------------------------- |
| brokerClusterName  | DefaultCluster | 监听端口                                        |
| brokerName         |                | Broker名称                                      |
| brokerId           |                | 0表示Master，>0表示Slave                        |
| namesrvAddr        |                | NameServer地址，若有多个用逗号隔开              |
| listenPort         |                | 监听端口                                        |
| storePathRootDir   |                | 文件存储路径                                    |
| storePathCommitLog |                | commitLog存储路径                               |
| flushDiskType      |                | 刷盘方式：ASYNC_FLUST（异步）SYNC_FLUSH（同步） |

查看是否启动成功：

```bash
#查看NameServer是否启动成功
ps -ef|grep mqnamesrv

#查看NameServer是否启动成功
ps -ef|grep mqbroker
```

#### RocketMQ控制台

```
1.下载源码 https://github.com/apache/rocketmq-externals 
2.使用mvn spring-boot:run启动项目
3.访问控制台地址：localhost:8080
```

> 若启动报错，官方说可能是pom文件中rocketmq版本问题，改为4.4.0即可。





### 使用Docker安装&配置&启动（windows）

docker-compose.yml
```yml
version: '3.5'
services:
  rmqnamesrv:
    image: foxiswho/rocketmq:server
    container_name: rmqnamesrv
    ports:
      - 9876:9876
    volumes:
      - ./logs/namesrv:/home/rocketmq/logs/rocketmqlogs
    networks:
        rmq:
          aliases:
            - rmqnamesrv
 
  rmqbroker:
    image: foxiswho/rocketmq:broker
    container_name: rmqbroker
    ports:
      - 10909:10909
      - 10911:10911
    volumes:
      - ./logs/broker:/home/rocketmq/logs/rocketmqlogs
      - ./store/broker:/home/rocketmq/store
      - ./conf/broker.conf:/etc/rocketmq/broker.conf
    environment:
        NAMESRV_ADDR: "rmqnamesrv:9876"
        JAVA_OPTS: " -Duser.home=/opt"
        JAVA_OPT_EXT: "-server -Xms128m -Xmx128m -Xmn128m"
    command: mqbroker -c /etc/rocketmq/broker.conf
    depends_on:
      - rmqnamesrv
    networks:
      rmq:
        aliases:
          - rmqbroker
 
  rmqconsole:
    image: styletang/rocketmq-console-ng
    container_name: rmqconsole
    ports:
      - 8087:8080
    environment:
        JAVA_OPTS: "-Drocketmq.namesrv.addr=rmqnamesrv:9876 -Dcom.rocketmq.sendMessageWithVIPChannel=false"
    depends_on:
      - rmqnamesrv
    networks:
      rmq:
        aliases:
          - rmqconsole
 
networks:
  rmq:
    name: rmq
    driver: bridge
```






### 在SpringBoot项目中使用RocketMQ



maven增加以下依赖

```xml
<dependency>
    <groupId>org.apache.rocketmq</groupId>
    <artifactId>rocketmq-spring-boot-starter</artifactId>
</dependency>
```





application.properties增加以下配置

```properties
#元数据管理（Topic信息、路由信息），类似zookeeper
rocketmq.name-server=http://localhost:9876
#生产者组
rocketmq.producer.group=ysx-group 
#发送消息超时时间
rocketmq.producer.send-message-timeout= 30000
rocketmq.producer.access-key = xxxxx
rocketmq.producer.sercet-key = xxxxx
#重发策略
rocketmq.producer.retryTimesWhenSendFailed = xxxx

#自定义name server集群
myApp.test.rocketmq.name-server = xx.xx.xx.xx:9876,xx.xx.xx.xx:9876
```





配置Topic









配置消费者（Push模式）

```java
@Slf4j
@RocketMQMessageListener(
    topic = "监听的topic name",
    nameServer = "${myApp.test.rocketmq.name-server}", //使用name server集群配置
    selectorExpression = "*",//还可以根据tag，过滤出topic中自己想消费的message 
    consumerGroup = "消费者组的name" ,
    messageModel = MessageModel.CLUSTERING, //消费者组的消费模式：集群(默认) or广播
    consumeMode = ConsumeMode.CONCURRENTLY //是否按顺序消费：并发(默认) or 有序
)
@Component("myListener")
public class MyListener implements RocketMQListener<MyReqBo> {
    
    //自动将JSON转换为泛型指定的MyReqBo对象
    @Override
    public void onMessage(MyReqBo message) {
        
    }
}
```



配置生产者

```java
@Slf4j
@Service
public class MyProducer {

    @Autowired
    private RocketMQTemplate rocketMQTemplate;

    /**
     * 发送普通消息
     * @param msgBody
     */
    public SendResult sendMsg(String msgBody){

    }

}
```





具体的mq操作

```java
public class RocketMQAPILearning{
    
    @Autowired
    RocketMQTemplate rocketMQTemplate;
    
    public void api(){
        //发送消息，无返回值
        //第一个参数：topic name
        //第二个参数：消息内容
        String json = "普通消息";
        rocketMQTemplate.convertAndSend("topic-name",json);
        
        //同步发送消息，发送过程会阻塞，发送成功会有返回值SendResult
        String syncJson = "同步消息";
        SendResult result = rocketMQTemplate.syncSend("topic-name",syncJson);
        
        //异步发送消息，无返回值，需要传入回调类
        String asyncJson = "异步消息";
        rocketMQTemplate.asyncSend("topic-name",asyncJson,
              new SendCallback(){
                  @Override
                  public void onSuccess(SendResult result){
						
                  }
                  
                  @Override
                  public void onException(Throwable throwable){
						
                  }
         });
        
         //单向发送消息，不管发送是否成功，无返回值，不回调
         rocketMQTemplate.sendOneWay("topic-name",json);
            
            
         //发送有序消息
         String hashKey = "";
         String orderlyJson = "有序消息";
         rocketMQTemplate.syncSendOrderly("topic-name",orderlyJson,hashKey);
            
            
         //发送事务消息，用于异步调用场景，实现分布式事务
         TransactionMQProducer producer = new TransactionMQProducer("transaction-producer-group");
         rocketMQTemplate.sendMessageInTransaction();
         
             
         //发送延迟消息
         //延迟等级（从0开始）：1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h
         Message message = new Message("topic-name",("hello world!").getBytes());
         message.setDelayTimeLevel(5);//延迟等级为5，5表示1分钟
         SendResult result = rocketMQTemplate.syncSend(message);
    }
}
```


#### RocketMQ的消息发送、落盘、消费主流程

1. 生产者发送消息

   确认消息类型：单向、同步、异步

   是否选择队列（队列选择器）

   