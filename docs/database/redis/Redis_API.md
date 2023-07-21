---
title: Redis---API速查
sidebarDepth: 2
---

# Redis API


## 【Redis Client】命令

### 命令行-键操作
```shell
##### 键操作
DEL <key>
EXISTS <key>
#【设置过期时间（几秒后）】
EXPIRES <key> <seconds>
#【设置过期时间（时间点）】
EXPIREAT <key> <timestamp>
#【根据给定模式匹配key】
Keys <pattern>
```

### 命令行-键值对操作
```shell
##### 键值对操作
SET <key> <value> 
GET <key>
# SET AND GET
SET name dyz #单值缓存
GET name #单值获取，返回dyz
# MSET：批量插入
MSET dyz_obj:1:name dyz dyz_obj:1:id 1 #json对象缓存 
GET dyz_obj:1:name #获取对象属性，返回dyz

#【批量添加】
MSET <key> <value> <key> <value>
#【批量获取】
MGET <key> <key>
#【若key不存在，才存入该键值对】 
SETNX <key> <value> #常用于分布式锁
#【返回Value的长度】
STRLEN <key>
#【追加字符串】
APPEND <key> <value>
#【返回子字符串】
GETRANGE <key> <start> <end>
#【置新值，返回旧值】
GETSET <key> <value>
```


### 命令行-HASH表操作
````shell
##### HASH表操作
HSET <hashname> <key> <value>
#【批量添加】
HMSET <hashname> <key1> <value1> <key2> <value2> ... 
HGET <hashname> <key>
#【返回所有键值对】
HGETALL <hashname>
#【返回所有键】
HKEYS <hashname>
#【返回所有值】
HVALS <hashname>
#【返回键值对的数量】
HLEN <hashname>
#【移除某个键值对】
HDEL <hashname> <key>
````


### 命令行-双向链表操作
```shell
##### 双向链表操作（栈、队列、有限集合、消息队列）
#【将给定值推入到列表左端】
LPUSH key value1 value2 ...
#【从列表的左端弹出一个值，并返回被弹出的值】
LPOP key
#【通过索引获取列表中的元素。你也可以使用负数下标】
LINDEX key index
#【获取列表在给定范围上的所有值】
LRANGE key startindex endindex
#【当列表没有值时，阻塞等待，直至有值可取时才继续执行】 
BRPOP key
## 双向链表常见用法：
#lrange mylist 0 -1 返回列表所有值
#lpush+lpop=Stack(栈)
#lpush+rpop=Queue（队列）
#lpush+ltrim=Capped Collection（有限集合）
#lpush+brpop=Message Queue（消息队列）
```



### 命令行-集合操作
```shell
##### 集合操作
#【往集合中添加成员】
sadd <setname> <key>
#【返回集合中所有成员】
smembers <setname>
#【获取集合size】
SCARD key
#【判断 member 元素是否是集合 key 的成员】
SISMEMBER key member
#【从集合中随机抽取n个成员】 
SRANDMEMBER key n
#【从集合中随机抽取n个成员并删除】 
SPOP key n
#【交集】
SINTER set1 set2 set3
#【并集】
SUNION set1 set2 set3
#【差集】
SDIFF set1 set2 set3  #第一个集合的元素减去剩余集合的并集的元素
```


### 命令行-有序集合操作
```shell
##### 有序集合操作
#【往集合添加成员，并标记该成员的分值】
zadd <setname> <score> <key> <score> <key> ...
#【获取集合在给定范围上的所有值】
ZRANGE key startindex endindex
#【删除某个成员】
ZREM zset-key member1
```


### 命令行-bitmap操作
```shell
##### bitmap操作（2.2.0版本新增）
#【将某个bitmap的第offset位设置位0或者1】
setBit key <offset> <value> #value=0或者1
#【取某个bitmap的第offset位得值】
getBit key <offset>
#【返回指定区间里，某个bitmap位为1的个数】
bitCount key [start] [end]
```



## 【Java】RedisTemplate