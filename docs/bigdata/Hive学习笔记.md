---
title: Hive学习笔记
sidebar: 'auto'
---

# Hive学习笔记

## 参考
【Hive Wiki（维基百科，英文）】 [https://cwiki.apache.org/confluence/display/HIVE](https://cwiki.apache.org/confluence/display/HIVE)

## 简介

简单来说，Hive可以理解为一个**将SQL转换MapReduce的任务**的工具。

甚至更进一步，可以说hive就是一个MapReduce的客户端。

Hive能让用户感觉自己在操作关系型数据库（Mysql、Oracle），让学习、编写**查询任务**成本大大降低。

Hive是基于Hadoop的一个数据仓库工具，可以将结构化的数据文件映射为一张数据库表，并提供类SQL查询功能。  

其本质是将SQL转换为MapReduce的任务进行运算，底层由HDFS来提供数据的存储。  


## 结构

与mysql结构类似，可创建数据库、创建表；不同的是Hive中，表以下多了“分区”、“桶”这些概念；

**分区：** 表中每行数据通过“分区字段”表明自己属于哪个分区；但分区字段实际上不保存数据。

**桶：** 表中每行数据通过“分桶字段”表明自己属于哪个桶；分桶字段是实实在在存在的表中的字段，会先求出字段的哈希值，然后除以桶数求余来确定属于哪个桶。


## HDFS
Hive就是从HDFS集群中存取数据的一个工具，因此了解HDFS对我们学习Hive有一定帮助。
详细见“Hadoop学习笔记”。

## Hive的数据类型
**原始类型**

Integers（整型）
- TINYINT －1位的整型
- SMALLINT －2位的整型
- INT －4位的整型
- BIGINT －8位的整型

布尔类型
- BOOLEAN －TRUE/FALSE

浮点数
- FLOAT －单精度
- DOUBLE －双精度定点数
- DECIMAL －用户可以指定范围和小数点位数

字符串
- STRING －在特定的字符集中的一个字符串序列
- VARCHAR －在特定的字符集中的一个有最大长度限制的字符串序列
- CHAR －在特定的字符集中的一个指定长度的字符串序列

日期和时间
- TIMESTAMP －一个特定的时间点，精确到纳秒。
- DATE －一个日期

二进制
- BINARY －一个二进制位序列

**复杂类型**

结构体类型（struct）
```sql
#定义
CREATE TABLE test(
name STRING,
test_struct STRUCT<course STRING,score INT>
ROW FORMAT DELIMITED 
FIELDS TERMINATED BY '\t' #字段之间通过制表符隔开
COLLECTION TERMINATED BY ',' #数组、结构体之间通过逗号隔开
MAP KEY TERMIATED BY ':' #map的key和value通过冒号隔开
);
#插入的数据格式如下：
张三 语文:90
张三 数学:85

#访问
SELECT t.test_struct.course FROM test;
```
数组类型(array)
```sql
#定义
CREATE TABLE test(
test_arr ARRAY<INT>
ROW FORMAT DELIMITED 
FIELDS TERMINATED BY '\t' #字段之间通过制表符隔开
COLLECTION TERMINATED BY ',' #数组、结构体之间通过逗号隔开
MAP KEY TERMIATED BY ':' #map的key和value通过冒号隔开
);
#插入的数据格式如下
#1,2,3,4
#2,5,10,14
#访问
SELECT t.test_arr[0] FROM test t;
```

Map类型
```sql
#定义
CREATE TABLE test(
name STRING,
score MAP<STRING,INT>
ROW FORMAT DELIMITED 
FIELDS TERMINATED BY '\t' #字段之间通过制表符隔开
COLLECTION TERMINATED BY ',' #数组、结构体之间通过逗号隔开
MAP KEY TERMIATED BY ':' #map的key和value通过冒号隔开
);
#插入的数据格式如下
#王强  '语文':80,'数学':'100',英语:'95'
#张三  '语文':82,'数学':'100',英语:'90'

#查询所有语文成绩
SELECT name,t.score["语文"] from test;
```

## Hive SQL语法

Hive提供通过编写SQL的形式去查数据，称为**Hive SQL**；

而因为Hadoop是一个存储海量数据的分布式存储框架，数据存储在不同的机器上，因此Hive SQL语法会跟平时的关系型数据库（Mysql、Oracle）有所区别；

Hive SQL一般只用于查询，而且是离线查询。（不像Mysql实时返回数据，而是生成任务在后台查询，查出的数据再缓存起来）；

不支持对行级数据的增、删、改；

**创建表**
```sql
CREATE TABLE page_view(
                viewTime INT, 
                userid BIGINT,
                page_url STRING, 
                referrer_url STRING,
                ip STRING COMMENT 'IP Address of the User' )#列备注
COMMENT 'This is the page view table' #表备注
PARTITIONED BY(dt STRING, country STRING) #分区字段
CLUSTERED BY(userid) SORTED BY(viewTime) INTO 32 BUCKETS #分桶字段
ROW FORMAT DELIMITED
        FIELDS TERMINATED BY '1' #字段与字段之间的分隔符
        COLLECTION ITEMS TERMINATED BY '2' #复杂类型(array，struct)字段的各个item之间的分隔符
        MAP KEYS TERMINATED BY '3' #复杂类型(map)中key value之间的分隔符
STORED AS SEQUENCEFILE; #表示以二进制形式存储在hdfs中

#创建表（拷贝某个表的结构）
CREATE TABLE phone_info_like LIKE phone_info;

#创建临时表
CREATE TABLE temp_info
AS
SELECT id phone_id，name phone_name,price 
FROM phone_infoSORT BY phone_id;
```

**查看表**
```sql
SHOW TABLES; #查看所有表
SHOW TABLES 'page.*'; #查看page数据库的所有表
```
**查看特定表的信息**
```sql

DESCRIBE EXTENDED page_view; #列出表的列和列的类型
DESCRIBE page_view; #列出表page_view的所有分区
```

**删除表**
```sql
#删除表
DROP TABLE pv_users;
#删除分区
ALTER TABLE pv_users DROP PARTITION (ds='2016-08-08');
```
**加载数据**
```sql
#本地文件->Hive表（Load方式）
load data local inpath '/home/xudong/xxx.txt' into table phone_info;

#HDFS文件->Hive表（Load方式）
load data inpath '/input/xxx.txt' overwrite into table phone_info;

#HDFS文件->Hive表（Insert方式）
#先创建一个外部表（本地文件系统）
CREATE EXTERNAL TABLE page_view_stg(viewTime INT, userid BIGINT, page_url STRING, referrer_url STRING, ip STRING COMMENT 'IP Address of the User', country STRING COMMENT 'country of origination') 
COMMENT 'This is the staging page view table' 
ROW FORMAT DELIMITED 
FIELDS TERMINATED BY '44' 
LINES TERMINATED BY '12' 
STORED AS TEXTFILE 
LOCATION '/user/data/staging/page_view'; 
#将本地文件添加到外部表中
hadoop dfs -put /tmp/pv_2016-06-08.txt /user/data/staging/page_view 
#将外部表数据加载到Hadoop的page_view表的分区中
FROM page_view_stg pvs
INSERT OVERWRITE TABLE page_view PARTITION(dt='2016-06-08', country='US') SELECT pvs.viewTime, pvs.userid, pvs.page_url, pvs.referrer_url, null, null, pvs.ip WHERE pvs.country = 'US';



#Hive表->Hive表
#将结果保存到Hive表user_active中
#INTO是追加数据、OVERWRITE是覆盖数据
INSERT OVERWRITE TABLE user_active
SELECT user.*
FROM user
WHERE user.active = 1;



#Hive表->Hive表（加载到某个分区）
FROM page_view_stg pvs 
INSERT OVERWRITE TABLE page_view PARTITION(dt='2008-06-08', country='US') SELECT pvs.viewTime, pvs.userid, pvs.page_url, pvs.referrer_url, null, null, pvs.ip WHERE pvs.country = 'US' 

#Hive表->Hive表（动态分区插入）
#1. 此例中country为需要动态分区插入的列
#2. PARTITION中country不用指定值；select中需要把country查出来
FROM page_view_stg pvs
INSERT OVERWRITE TABLE page_view PARTITION(dt='2008-06-08', country)
       SELECT pvs.viewTime, pvs.userid, pvs.page_url, pvs.referrer_url, null, null, pvs.ip, pvs.country

#Hive表->Hive表、HDFS
FROM pv_users 
INSERT OVERWRITE TABLE pv_gender_sum SELECT pv_users.gender, count_distinct(pv_users.userid) GROUP BY pv_users.gender
INSERT OVERWRITE DIRECTORY '/user/data/tmp/pv_age_sum' SELECT pv_users.age, count_distinct(pv_users.userid) GROUP BY pv_users.age;

#Hive表->本地文件
INSERT OVERWRITE LOCAL DIRECTORY '/tmp/pv_gender_sum' 
SELECT pv_gender_sum.* FROM pv_gender_sum;
```

**查询数据**
```sql
#将结果保存到Hive表user_active中
INSERT OVERWRITE TABLE user_active
SELECT user.*
FROM user
WHERE user.active = 1;

#将结果保存到HDFS中
INSERT OVERWRITE DIRECTORY '/user/data/tmp/pv_age_sum' 
SELECT pv_users.age, count_distinct(pv_users.userid) 
GROUP BY pv_users.age;
```

**基于分区的查询**
```sql
#其中，date是page_views的一个分区字段
INSERT OVERWRITE TABLE xyz_com_page_views
SELECT page_views.*
FROM page_views
WHERE page_views.date >= '2008-03-01' AND page_views.date <= '2008-03-31' AND
      page_views.referrer_url like '%xyz.com';
```

**表连接**
```sql
#普通的内连接
INSERT OVERWRITE TABLE pv_users
SELECT pv.*, u.gender, u.age
FROM user u JOIN page_view pv ON (pv.userid = u.id)
WHERE pv.date = '2008-03-03';

#左连接
INSERT OVERWRITE TABLE pv_users
SELECT pv.*, u.gender, u.age
FROM user u LEFT OUTER JOIN page_view pv ON (pv.userid = u.id)
WHERE pv.date = '2008-03-03';

#返回user表中，id存在于page_view中的记录
INSERT OVERWRITE TABLE pv_users
SELECT u.*
FROM user u LEFT SEMI JOIN page_view pv ON (pv.userid = u.id)
WHERE pv.date = '2008-03-03';

#多表连接
#最大的表放最右边，性能最好
INSERT OVERWRITE TABLE pv_friends
SELECT pv.*, u.gender, u.age, f.friends
FROM page_view pv JOIN user u ON (pv.userid = u.id) 
JOIN friend_list f ON (u.id = f.uid)
WHERE pv.date = '2008-03-03';
```

**抽样**
```sql
#仅查询某些桶中的内容
#假设表pv_gender_sum有100个桶，则下面语句中取第3个
#语法为BUCKET x OUT OF y
#y必须为桶数量的因子
INSERT OVERWRITE TABLE pv_gender_sum_sample
SELECT pv_gender_sum.*
FROM pv_gender_sum TABLESAMPLE(BUCKET 3 OUT OF 20);
```

**运行Map/Reduce脚本**
```sql
FROM (
     FROM pv_users
     MAP pv_users.userid, pv_users.date
     USING 'map_script'
     AS dt, uid
     CLUSTER BY dt) map_output

 INSERT OVERWRITE TABLE pv_users_reduced
     REDUCE map_output.dt, map_output.uid
     USING 'reduce_script'
     AS date, count;
```