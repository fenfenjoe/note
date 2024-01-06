---
title: mongoDB
---

# MongoDB

### 为什么使用mongodb

1. 在“三高”问题上，mongodb相对传统关系型数据库有更好的表现：
* 高并发
* 海量数据
* 高可扩展性&高可用性

2. 当你的数据：
* 是低价值数据（比如是日志数据）
* 没有复杂的业务需求（mongo不支持事务）

3. 当你属于以下应用场景：
* 大数据分析
* 移动应用开发（mongo支持地理位置的存储和处理）
* 实时数据处理
* 云计算
  mongodb是一个很好的选择



### 语法

#### 查询

```shell
#查询userInfo表的所有数据
db.userInfo.find();

#查询userInfo表的所有数据，并根据name字段去重
db.userInfo.distinct("name");

#查询age=22的记录
db.userInfo.find({"age": 22});

#查出name=zhangsan and age=22的记录
db.userInfo.find({name: 'zhangsan', age: 22});

#查出age=22 or age = 25的记录
db.userInfo.find({$or: [{age: 22}, {age: 25}]});

#查出age in(22,25)的记录
db.userInfo.find({age :{$in:[22,25]}});

#返回记录数
db.userInfo.find().count();

#查询23<=age<=25的记录
db.userInfo.find({age: {$gte: 23, $lte: 25}});

#查询age!=25的记录
db.userInfo.find({age: {$ne: 25}});

#模糊查询（等于where name like %mongo%）
db.userInfo.find({name: /mongo/});

#只查出name字段和age字段（1：查询；0不查询）
db.userInfo.find({}, {name: 1, age: 1});

#按照age升序查出（1：升序；-1：降序）
db.userInfo.find().sort({age: 1});

#查出前5条数据
db.userInfo.find().limit(5);

#查出10条之后的数据
db.userInfo.find().skip(10);


```



