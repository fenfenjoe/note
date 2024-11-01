# ELK学习笔记

## 什么是ELK

ELK是一套日志分析系统，由Elastic Search + Logstash + Kibana三个组件组成。

三个组件的分工：

|组件           |分工|
|---            |---|
|Logstash       |负责监控日志文件的变化的进程，负责将增量数据推送至Elastic Search|
|Elastic Search |负责保存日志文件数据，保存时会将数据结构化|
|Kibana         |日志数据可视化查询界面|

## 数据结构化？

```log
 17536  
 17537  2023-07-07 10:41:33 | WARN  | main | AbstractConfig.java:231 | org.apache.kafka.clients.consumer.ConsumerConfig | (The configuration 'fetch.message.max.bytes' was supplied but isn
't a known config.
 17538  
 17539  2023-07-07 10:41:33 | INFO  | main | AppInfoParser.java:109 | org.apache.kafka.common.utils.AppInfoParser | (Kafka version : 1.0.0
 17540  
 17541  2023-07-07 10:41:33 | INFO  | main | AppInfoParser.java:110 | org.apache.kafka.common.utils.AppInfoParser | (Kafka commitId : aaa7af6d4a11b29d
 17542  
 17543  2023-07-07 10:41:33 | INFO  | main | ExecutorConfigurationSupport.java:171 | org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler | (Initializing ExecutorService 
 17544  
 17545  2023-07-07 10:41:33 | INFO  | main | AbstractConfig.java:223 | org.apache.kafka.clients.consumer.ConsumerConfig | (ConsumerConfig values: 
```

上面是常见的日志数据。Logstash以行为一个单位，发送给ES。同时还会发送一些环境的信息（文件名、路径、文件所在计算机IP等）  
报文大概如下：
```json
{
 "message":"2023-07-07 10:41:33 | WARN  | main | AbstractConfig.java:231 | org.apache.kafka.clients.consumer.ConsumerConfig | (The configuration 'fetch.message.max.bytes' was supplied but isn't a known config."
 "ip":"10.18.62.18",
 "log_path":"/apps/svr/srmprice/logs/test.log",
 ...
}
```

ES将接收到的JSON串保存下来。

然后就可以通过KQL（类似于SQL的查询语法），在Kibana上面按字段、或者按全文搜索，查日志的数据了。


## KQL

下面记录一些KQL常用语句。

```
# 查询任意字段中包含"Hello"的记录
Hello 

# 查询任意字段中包含"Hello"或者"World"的记录
Hello World 

# 查询任意字段中包含"Hello World"的记录
"Hello World"

# 查询name字段中包含"Hello"的记录
name:Hello

# 查询name字段中包含"Hello"或者"World"的记录
name:Hello World 

# 查询name字段中包含"Hello"，并且age<14的记录
name:Hello and age<14  

# 查询name字段中包含"Hello"，或者age<14的记录
name:Hello or age<14  

# 查询age不等于14的记录
not age=14 
```