---
title: Clickhouse学习笔记
sidebar: 'auto'
---

# Clickhouse学习笔记


## 概览

- 开发语言：C++语言
- 主要特性：
  - 列式存储
  - 提供了实时数据更新和索引功能
  - 支持类SQL查询
  - 支持毫秒级查询返回数据
  - 支持分布式部署
  - 支持TB级别甚至PB级别数据量（数万亿行）
  - 支持多表关联查询
- 缺点
  - 不适合频繁写操作
  - 不支持事务

## 搭建

单台机器安装完Clickhouse后，文件目录是这样的：

- /usr
  - /bin（可执行文件目录）
    - clickhouse-client（客户端工具）
    - clickhouse-server（服务端工具）
- /etc
  - /clickhouse-server（服务端的配置文件目录）
    - /config.xml（主要的服务端配置文件）
    - /users.xml（用户权限配置文件）
    - /config.d/（额外的配置文件目录）
- /var
  - /log
    - /clickhouse-server（默认的保存日志的目录）
      - clickhouse-server.log
      - clickhouse-server.err.log
  - /lib
    - /clickhouse（默认的数据目录）
      - /data（存储实际的数据文件）
      - /metadata（存储数据库和表的元数据）
      - /user_files（用户数据目录）
      - /tmp（临时数据目录）

Clickhouse可以单机运行，但既然用到Clickhouse，我们就是看中了它支持大数据量、支持分布式部署的优点。  

下面是集群部署的步骤。  

- 1.安装并配置Zookeeper
- 2.config.xml中配置ClickHouse集群参数
- 3.config.xml中配置Zookeeper参数
- 4.启动Clickhouse

集群架构如下：

- 集群
  - 分片1
    - 副本1（Clickhouse）
    - 副本2（Clickhouse）
  - 分片2
    - 副本3（Clickhouse）
    - 副本4（Clickhouse）
- 注册中心（Zookeeper集群）



## Clickhouse客户端

推荐**DBeaver**

## 数据类型

整数类型‌：  
有符号整数型：Int8、Int16、Int32、Int64，分别使用1、2、4、8个字节存储。
无符号整数型：UInt8、UInt16、UInt32、UInt64，分别使用1、2、4、8个字节存储。

‌浮点数类型‌：  
Float32和Float64，分别使用4、8个字节存储。

‌定点数类型‌：  
Decimal(P, S)，支持指定精度和小数位数。P代表精度，S代表小数位数。

‌日期和时间类型‌：  
Date，使用4个字节存储，表示自1970年1月1日以来的天数。
DateTime，使用8个字节存储，精确到纳秒级。
Date32和DateTime64，提供了额外的精度选项。

‌字符串类型‌：  
String，变长字符串类型，使用相对较少的内存来存储字符串。
FixedString(N)，定长字符串类型，占用N个字节存储。

‌枚举类型‌：  
Enum8和Enum16，分别使用1、2个字节存储，可以表示8、16种不同的值。

‌布尔类型‌：  
没有专门的布尔类型，但可以使用UInt8类型，取值限制为0或1。

UUID类型‌：  
使用16个字节存储，通过全局唯一标识符算法生成。

IP地址类型‌：  
IPv4和IPv6，用于存储和操作IP地址数据。

‌数组类型‌：  
Array(T)，可以存储任意类型T的数组。但请注意，在MergeTree表引擎中是不允许出现数组嵌套的。

‌可为空类型‌：  
Nullable(T)，可以为任意类型T添加空值。

‌元组类型‌：  
Tuple，用于存储和操作具有不同数据类型的数据集合。


## 建数据库、建表

```mysql
-- 创建数据库
CREATE DATABASE my_database;

-- 切换数据库
USE my_database;

-- 创建表，并指定表引擎为MergeTree，orderby语句也是必须的
CREATE TABLE users (
    id Int64 PRIMARY KEY,
    name String,
    email String
) ENGINE = MergeTree() ORDER BY id;

-- 创建表，引擎为Distributed（分表的逻辑表）
-- cluster是在配置文件定义的集群名称；
-- database、table是数据库名和表名；
-- sharding_key是分片键名称
CREATE TABLE my_distributed_table AS my_local_table
ENGINE = Distributed(cluster, database, table, sharding_key);


--创建表，引擎为LOG。LOG、MEMORY 不需orderby语句
CREATE TABLE my_log_table
(
    event_time DateTime,
    event_type String,
    event_description String
)
ENGINE = Log;
```

> 关于**表引擎**  
> - MergeTree系列
>   - MergeTree：最常用，支持索引和数据分区
>   - ReplacingMergeTree：用于处理包含相同主键的重复数据，在合并分区时删除重复的数据。但请注意，它不能完全保证数据不重复
>   - SummingMergeTree
>   - AggregatingMergeTree
>   - CollapsingMergeTree
> - Log系列
>   - Log：用于存储日志和其他机器数据，不支持索引和数据分区
>   - TinyLog
>   - StripeLog
> - Memory系列‌：缓存数据，所有数据存储在RAM中，读写速度快，但重启数据会丢失
> - Distributed：不直接存储数据，而是作为一个中间层。对Distributed的查询会被转换成对不同节点上分表（通常是MergeTree表）的查询
> - Kafka：与Kafka集成，可用于实时数据流处理，适用于实时数据处理场景
> - MaterializedView：用于预处理数据，可以提高查询性能
> - File和URL：用于对文件进行操作，如CSV、Parquet等
> - 其他

## 增删改查

增：
```sql 
-- 直接插入值
INSERT INTO my_distributed_table (column1, column2, ...)
VALUES (value1, value2, ...), (value3, value4, ...), ...;

-- 取其他表数据进行插入
INSERT INTO my_distributed_table
SELECT column1, column2, ...
FROM another_table;
```

查：
```sql 
-- 多表关联查询
SELECT u.user_id,u.user_name,o.order_id,o.order_date,o.amount
FROM users u INNER JOIN orders o ON u.user_id = o.user_id;
```

删和改：  
注意，Clickhouse是一个以插入为主的分布式数据库，因此删除和修改数据的效率会比较差，而且它们是后台的异步操作。  

```sql 
-- 修改（方法1）
UPDATE table_name SET column1 = value1 WHERE column2 = value2;

-- 修改（方法2）
ALTER TABLE table_name UPDATE column1 = value1 WHERE condition;

-- 删除
ALTER TABLE table_name DELETE WHERE condition;

```

## springboot项目中集成clickhouse

1. 添加依赖  
```xml 
<dependency>
    <groupId>ru.yandex.clickhouse</groupId>
    <artifactId>clickhouse-jdbc</artifactId>
    <version>0.3.1</version>
</dependency> 
```

2. 添加配置
```properties
spring.datasource.url=jdbc:clickhouse://localhost:8123/default
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=ru.yandex.clickhouse.ClickHouseDriver
```

3. 创建实体类，并使用JdbcTemplate或CrudRepository进行数据操作。  
略。  

