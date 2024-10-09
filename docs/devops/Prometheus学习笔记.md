# Prometheus学习笔记


## 参考资料

中文文档：[https://daichangya.github.io/prometheus.io/#/?id=readme](https://daichangya.github.io/prometheus.io/#/?id=readme)

Prometheus架构及实践（主讲人：杨波）：[https://www.bilibili.com/video/BV1pE411W7Pn/?spm_id_from=333.1007.top_right_bar_window_view_later.content.click](https://www.bilibili.com/video/BV1pE411W7Pn/?spm_id_from=333.1007.top_right_bar_window_view_later.content.click)


## 简介

一个时间序列数据库。主要的应用场景为监控系统。

> 常见的监控系统，一般通过以下的某种方式来监控某个系统的信息：
> * Log（监控日志）
> * Tracing（监控调用函数链）
> * Metric（监控度量）
> * Healthcheck（健康检查）
    > Prometheus属于Metric方式。


Prometheus从不同的主机、不同的应用程序（target）定期拉取一种结构化的字符串（叫Metric），并存储到自己的时间序列Database（TSDB）中，这就是Prometheus的基本原理。



## 如何拉取监控数据？

假设，你想监控自己电脑操作系统的情况（CPU、内存、硬盘使用情况等等）。

Prometheus提供了一个叫node-exporter的工具。

它相当于一个代理，负责收集你机器的信息，并将这些信息整理成一个一个metric。

在Prometheus Server上注册该exporter的信息后（prometheus.yml），Prometheus就会定期地通过node-exporter拉取你机器的信息。

同样，除了操作系统，其他的中间件（例如Mysql、Redis、Oracle、kafka、RabbitMQ）、硬件，官方都提供了exporter工具。

> 那如果是要监控自己开发的应用程序呢？比如微服务？

Prometheus也提供了一些API，供微服务暴露自己的Metric，若想实现统计用户登录次数、接口访问频率这些业务功能，可以用这种方式。这种方式也叫“埋点”。



## 时间序列&Metric

“时间序列”是一种数据结构，若跟一般的关系型数据库类比：

时间序列的“表名”，由“指标名称”和“标签”组成。格式如下：

```
#api_http_requests_total是指标名
#method、handler是标签

api_http_requests_total{method="POST", handler="/messages"}
```


表有固定的两个字段：时间戳（timestamp）和样本值（value）。

存储格式如下：

|||
|---|---|---|
|指标名称|api_http_requests_total|
|标签1|method="POST"||
|标签2|handler="/messages"||
|||
|1|2022-01-01 00:00:00|5|
|2|2022-01-01 00:01:00|13|
|3|2022-01-01 00:02:00|17|
|...||

**时间序列表的创建：**

**时间序列表中数据的查询：** 跟SQL一样，Prometheus提供了一种叫PromQL的语法，方便用户查询数据。




## 样本值类型

在Prometheus中，有四种样本值类型：

* Counter（计数器，数值自增）
* Gauge（仪表盘，任意数值）
* Histogram（直方图）
* Summary（摘要）




