# Elastic Search学习笔记

### 参考
Elasticsearch－基础介绍及索引原理分析 [https://www.cnblogs.com/dreamroute/p/8484457.html](https://www.cnblogs.com/dreamroute/p/8484457.html)  
ElasticSearch官方文档<https://www.elastic.co/guide/cn/elasticsearch/guide/2.x/intro.html>  

### 什么是ES

Elastic Search，一个分布式、可扩展的实时搜索和分析引擎；
一个文档型数据库，数据以JSON作为文档序列化的格式；
特点是检索数据的速度快，使用倒排索引而不是B+树索引（关系型数据库）；


ES中的概念  

| Elasticsearch | 说明                                                                                  |
|---------------|-------------------------------------------------------------------------------------|
| 索引（Index）     | 等于RDBMS中**数据库（Database）** 的概念，实质是一个文档的集合。                                           |
| 类型（Type）      | 等于RDBMS中**表（Table）** 的概念，指在一个索引中，可以索引不同类型的文档，如用户数据、博客数据。从6.0.0 版本起已废弃，一个索引中只存放一类数据。 |
| 映射（Mapping）   | 等于RDBMS中**表结构（Schema）** 的概念                                                         |
| 文档（Doc）       | 等于RDBMS中**行（Row）** 的概念 ，以JSON格式来表示                                                  |
| 字段（Field）     | 等于RDBMS中**列（Column）** 的概念 ，以JSON格式来表示                                               |

### 为什么用ES

如果你的系统需要快速的、支持大数据量的全文检索功能；
如果你的系统需要一个可扩展的分布式搜索引擎；

### ES的应用场景
日志分析（ELK框架，还新增了一个FileBeat）

### ES的特性

* 支持分布式架构
* 高性能的搜索引擎
* 支持多种数据结构（文本、数值、日期、地理位置等）

### ES可视化管理工具

    **ElasticHD**
    **Dejavu**
    **Kibana**

### ES索引

#### 创建ES索引
创建ES索引的请求一般是这样的：
```bash
PUT /my_index
{
  "mappings":{
    "dynamic": true,
    "properties":{
      "info":{
        "type":"text",
        "analyzer":"ik_smart"
      },
      "email":{
        "type": "keyword",
        "index": false
      },
      "name": {
        "type": "object",
        "properties": {
          "firstname": {
            "type": "keyword"
          },
          "lastname": {
            "type": "keyword"
          }
        }
      }
    }
  }
}
```

- **mappings**:**字段映射**，配置索引里有哪些字段，以及每个字段的属性。
- **dynamic**:是否可以添加新字段（true(默认)/false/strict）
  - true:当插入的文档有新字段，会自动创建新字段的映射
  - false:当插入的文档有新字段，依然会存储下来，但不能作为查询条件
  - strict:当插入的文档有新字段，抛出异常
- **type**：字段的数据类型，一般有以下几种常用数据类型
  - 字符串：text（可分词的文本）、keyword（精确值）
  - 数值：long、integer、short、byte、double、float
  - 布尔值：boolean
  - 日期：date
  - 对象：object
- **index**:是否创建索引
- **analyzer**:分词器，text数据类型字段需要配置
- **properties**:配置该索引/字段的子字段


创建索引后，还有对索引的查看，删除操作（不支持修改）。

#### 查看索引
```bash
GET /my_index
```

#### 删除索引
```bash
DELETE /my_index
```


### 原理
#### ES存储原理&索引

**docid**

ES数据库里的每条记录，都会分配到一个ID，称为doc id。

| docid | name      | age |
|---    |---        |---  |
|1      |Johnny Depp|25   |
|2      |Aby Homie  |18   |
|3      |Johnny Wei |25   |




**倒排索引（Posting）**

ES会为表中的每个字段都维护一个倒排索引。
倒排索引有两个主要字段，一个负责将表中该字段的每一行分成单词存储起来，一个则负责存储这些单词对应的docid（出现多次则以数组保存）。
查询时，通过分词去匹配索引，匹配到之后，根据后面的ID去查找记录。

name字段的倒排索引：
| Term  | Posting  |
|---    |---       |
|Johnny |[1,3]     |
|Depp   |1         |
|Aby    |2         |
|Homie  |2         |
|Wei    |3         |

age字段的倒排索引：
| Term  | Posting   |
|---    |---        |
|25     |[1,3]      |
|18     |2          |

> 倒排索引提供了模糊搜索的一种解决方案，但是当分词的数量很多（比如千万级），那么检索分词会很慢。
> 因此，ES又引出了分词词典这个概念。




**分词词典（Term Dictionary）**

分词词典，是对分词进行排序后，使其可以通过二分查找达到log(n)级的查询效率。
对倒排索引（posting）排序后获得的就是Term Dictionary。


name字段的分词词典：
| Term  | Posting  |
|---    |---       |
|Aby    |2         |
|Depp   |1         |
|Homie  |2         |
|Johnny |[1,3]     |
|Wei    |3         |

age字段的分词词典：
| Term  | Posting   |
|---    |---        |
|18     |2          |
|25     |[1,3]      |

> 分词词典解决了查询效率问题，但是若数据量太大，则无法将全部数据都加载到内存。
> 为了解决这个问题，分词索引出现了。




**分词索引（Term Index）**

通过分词中的前缀，为分词词典再维护一个B-树索引。
通过分词索引可快速定位到Term Dictionary里的某个offset，再沿着这个offset往下查询。

name字段的分词索引：
| Index | Posting  |
|---    |---       |
|A      |1         |
|Ab     |1         |
|Aby    |1         |
|D      |2         |
|H      |3         |
|J      |4         |
|W      |5         |
|...    |          |

> 若分词索引数据量也很大，内存无法加载完，此时可以通过FST方法，压缩分词索引，提高存储效率。




**FST**
压缩算法，提高存储效率


#### 搜索原理（Lucene）
略


#### 排序原理




### ES的使用
#### 安装ES服务器
略
#### 配置文件

```sql
# 以下是配置文件：
/config
    /elasticsearch.yml
    /logging.yml
 ```
 ```yaml
#elasticsearch.yml
#该文件是ES服务器的主要配置文件
#分为静态属性和动态属性。
#静态属性：ES启动后便不可修改，如cluster.name、node.name
#动态属性：ES启动后，可通过Restful或其他方式修改
cluster.name: myescluster # 集群名字
node.data: true # 当前节点是否数据结点（默认为true）
node.master: true # 当前节点是否候选主结点（默认为true）
node.ingest: false # 当前节点是否吸收节点（默认为false）
discovery.zen.minimum_master_nodes: 1 # 当前集群
```
#### 登录
http://localhost:9200，若是远程服务器则修改一下IP地址



#### 配置分词

**什么是分词器？**

ES将一段文本分成多个单词的工具。

**在哪个步骤会用到分词器？**

1. 保存数据时

ES在将一条数据保存到表之后，为了生成倒排索引，还需要通过分词器，将这条数据的每一个字段，分成多个单词，保存到不同字段对应的倒排索引中。
生成倒排索引的原理，可见本文中的“倒排索引”介绍。

2. 查询数据时（全文检索）

以下是一段全文检索请求（使用match），意思就是查表index1中，字段title匹配"BROWN DOG!"这个查询条件的数据：
```bash
GET /index1/_search

{
  "query":{
    "match":{
      "title":"BROWN DOG!"
    }
  }
}

```

全文检索时，ES会先使用分词器，将查询条件分成多个词（[brown,dog]），只要字段中有其中一个词，便会命中。
比如会命中以下数据：
* title = i like brown,i don't like dog.
* title = there is a brown tree.
* title = a white dog.

> 如果我们想查两个词都有的数据，可以像下面这样请求：
>```bash
>GET /index1/_search
>{
>  "query":{
>    "match":{
>      "title":"BROWN DOG!"
>      "operator":"and" //默认情况下是or
>    }
>  }
>}
>
>```



**有哪些分词器？**

ES自带以下分词器：

* Standard：默认分词器，支持多语言，不分大小写。
* Simple：非字母作为分隔符（即不会将数字分成一个单词）
* Whitespace：空格、制表符、换行作为分隔符
* Keyword：不分词
* Pattern：正则表达式

分词示例：
```
//【1.】假设使用不同分词器对以下句子进行分词。
“text”: “The 2 QUICK Brown-Foxes jumped over the lazy dog’s bone.”

//默认的分词器下，以空格、标点符号作为分隔符，并将单词小写处理
Standard：['the','2','quick','brown','foxes','jumped','over','the','lazy','dog's','bone']

//Simple分词器下，除了空格、标点符号，数字也会作为分隔符，同样也会将单词小写处理
Simple：['the','quick','brown','foxes','jumped','over','the','lazy','dog','s','bone']

//Whitespace分词器下，以空格、制表符、换行作为分隔符，但不会将单词小写处理
Whitespace：['The','2','QUICK','Brown-Foxes','jumped','over','the','lazy','dog's','bone']

//【2.】对中文进行分词。
“text”: “我想买3台空调”

//若用上面的分词器，基本上都会分成['我','想','买','3','台','空','调']
//此时，若搜索'空调'，是搜不出来这条数据的。因为从上面可以看出，没有分出'空调'这个分词
//由此可见，自带的分词对中文搜索不是很友好。此时我们可以使用IK分词器。

```


其他分词器实现：

* IK：更高效的中文分词器

IK分词器有两种模式：ik_max_word和ik_smart模式。

假设对“我是乒乓球冠军”进行分词。

**ik_max_word**：最细粒度分词，会分成：[我，是，乒乓，乒乓球，球，冠军]

**ik_smart**：最粗粒度分词，会分成：[我，是，乒乓球，冠军]


```bash
#测试分词（analyzer：standard、simple、whitespace、keyword、pattern...）
curl -X POST 'localhost:9200/city/_analyze'

{
  "analyzer":"standard",
  "text":"你是"
}

#返回结果
{
  "tokens":[
  {
   "token":"你",
   "start_offset":0,
   "end_offset":1,
   "type":"<IDEOGRAPHIC>"
   "position":0
  },
  {
   "token":"是",
   "start_offset":2,
   "end_offset":3,
   "type":"<IDEOGRAPHIC>"
   "position":1
  }
  ]
}

#创建索引时，为某个字段指定分词（查询时会自动走分词）
curl -X PUT 'localhost:9200/test'
{
  "mapping":{
    "properties":{
      "name":{   #创建一个name字段
        "type":"text", #定义其类型为text
        "analyzer":"ik_max_word" #分词器使用ik_max_word
      },
      "englishname":{   #创建一个englishname字段
        "type":"text", #定义其类型为text
        "analyzer":"standard" #分词器使用standard
      },
      "sex":{   #创建一个sex字段
        "type":"keyword", #定义其类型为keyword，无需分词
      },
      "age":{   #创建一个age字段
        "type":"long", #定义其类型为long，无需分词
      }
    }
  }
}

```



#### ES RESTAPI：增删改查语法

> ES提供RESTful API给用户做数据的增删改查。

ES语句示例：

curl -X [method] 'http://localhost:9200/[index]/[type]/[id]'

* method：POST（增）、DELETE（删）、PUT（改）、GET（查）
* index：索引，对应关系型数据库中“数据库”的概念
* type：类型，对应关系型数据库中“表”的概念（逐渐弃用）

* id：主键字段，可不填

> 在每个type（表）中，存储的每一行数据又被称为”document（文档）“，是因为它存储的数据都是非结构化的

**插入**

```bash
#创建一个city库、一个guangzhou表，并向guangzhou表中插入一条id为1234858的数据
curl -X PUT 'localhost:9200/city/guangzhou/1234858'
{
  "name":"shenzhen",
  "area": [
			 "Nanshan",
			 "Futian"
			]
}
#返回结果
{
 "index":"city",
 "type":"guangzhou",
 "id":"1234858",
 "version":1 #当前数据的版本，从1开始
 "result":"created" #初次创建的状态
 ...
}
#修改guangzhou表中id为1234858的数据（覆盖）
curl -X PUT 'localhost:9200/city/guangzhou/1234858'
{
  "name":"shenzhen222", #修改了名字
  "area": [
			 "Nanshan",
			 "Futian"
			]
}
#返回结果
{
 "index":"city",
 "type":"guangzhou",
 "id":"1234858",
 "version":2 #当前数据的版本
 "result":"updated" #数据被更新
 ...
}
#修改的另一种方式：（追加修改）,推荐用这种方式
curl -X POST 'localhost:9200/city/guangzhou/1234858/_update'
{
  "doc":{
    "name":"shenzhen333"
  }
}
#创建一个test库，并定义其字段的类型
curl -X PUT 'localhost:9200/test'
{
  "mapping":{
    "properties":{
      "name":{   #创建一个name字段
        "type":"text" #定义其类型为text
      },
      "age":{
        "type":"long" #定义其类型为long
      }
      "birthday":{
        "type":"date" #定义其类型为date
      }
    }
  }
}
```

> ES的数据类型：
>
> text：会被分词器解析，比如某条记录的 name（text字段）为“我是猪”，查 match:{name=“我”} 的时候也会返回这条记录
>
> keyword：不能再被分词器解析，会被当作一个整体去查询
>
> date

**查询**

```bash
# 查询city库所有数据
curl -X GET 'localhost:9200/city'
# 也等同于以下语句
curl -X POST 'localhost:9200/city/_search'
{
 "query":{
   "match_all":{}
 }
}
# 返回结果
{
 "took": 5, #耗费时间
 "hits":{
  "total":1, #命中的数据 总数
  "hits":[
    {
        "_index": "city", #数据属于city库
        "_type": "guangzhou", #数据属于guangzhou表
        "_id": "1234858", #id值
        "_score": 0.251234 #匹配度，匹配度越高，分值越高
        "_source": {  #该文档的其他字段
			"name": "Shenzhen",
			"area": [
			 "Nanshan",
			 "Futian"
			]
        }
    }
  ]
 }
}

# 简单查询：根据id查询
curl -X GET 'localhost:9200/city/guangzhou/1234585'

# 简单查询：查询name字段为shenzhen的文档
curl -X GET 'localhost:9200/city/_search?q=name:shenzhen'

# 单查询条件&排序：查询city库中province='guangdong'的行，并且以city_name来排序
curl -X POST 'localhost:9200/city/_search'
{
 "query":{ #查询条件（相当于where）
   "match":{ #match：先通过分词器解析，再查询
     "province": "guangdong"
   }
 },
 "sort":[ #排序（相当于order by）
  {
   "city_name":{
     "order": "asc" #asc 升序；desc 降序；
   }
  }
 ]
}

# 多查询条件： 查询city表中province='guangdong',country="china"的行
curl -X POST 'localhost:9200/city/_search'
{
 "query":{
   "bool":{ #bool：子查询
     "must":[ #must = and ,还有should = or , must_not = !
         {
            "match":{ #match：先通过分词器解析，再查询（分词查询、模糊查询）
               "province": "guangdong"
             }
         },
         {
            "term":{ #term：直接从倒排索引查询（精确查询）
               "country": "china"
             }
         }
     ]
   }
 }
}
# 只查询需要的列：只查询city表中所有数据的province，city_name字段
curl -X POST 'localhost:9200/city/_search'
{
 "_source":["province","city_name"],
 "query":{
   "match_all":{}
 }
}
# 分页查询：返回city表中的一页数据，设置一页最多为30条数据
curl -X POST 'localhost:9200/city/_search'
{
 "query":{
   "match_all":{}
 },
 "size": 30, #每页30条
 "from": 0 #取第1页
}
# 范围查询：查询查询年龄大于等于10，小于等于20的数据
curl -X POST 'localhost:9200/city/_search'
{
  "query":{
    "match_all":{}
  },
  "filter":{
    "range":{
      "age":{ 
        "gte":10, #大于等于：greater than and equal，gt：大于
        "lte":20 #小于等于：less than and equal，lt：小于
      }
    }
  }
}
# 范围查询另一种写法：查询查询年龄大于等于10，小于等于20，且名字为shenzhen的数据
curl -X POST 'localhost:9200/city/_search'
{
  "query":{
    "bool":{
      "must":[
        "range":{
          "age":{ 
            "gte":10, #大于等于：greater than and equal，gt：大于
            "lte":20 #小于等于：less than and equal，lt：小于
          }
        },
        "term":{
          "name":{
            "value":"shenzhen"
          }
        }
      ]
    }
    
  },
  "filter":{
    
  }
}
# 聚合查询：类似于sql里的group by，常用于查询统计信息。
# 我们这里返回city表中总共的city数量
# 聚合还分为：指标聚合(avg,max,min,count,cardinality)、桶聚合(groupby)、矩阵聚合、管道聚合

#select city_name as city_name_groupby from city group by city_name
curl -X POST 'localhost:9200/city/_search'
{
 "aggs":{
   "city_name_groupby"：{ #需要自己定义一个聚合的名字
     "terms" : { #聚合类型：groupby 
       "field":"city_name.keyword"
     }
   }
 }
}
#返回参数
{
 "aggregations":{
   "city_name_groupby":{
    "sum_other_doc_count" : 41,
    "buckets": [
      {
       "key": "广州",
       "doc_count":31
      },
      {
       "key": "厦门",
       "doc_count":10
      }
    ]
   }
 }
}

#select city_name as city_name_groupby from city where personNum > 10000 group by city_name
curl -X POST 'localhost:9200/city/_search'
{
 "query":{
   "range":{
     "personNum":{
       "lte":10000
     }
   }
 }
 "aggs":{
   "city_name_groupby"：{ #需要自己定义一个聚合的名字
     "terms" : { #聚合类型：groupby 
       "field":"city_name.keyword"
     }
   }
 }
}

#select count(*) as city_id_count from city group by city_id
curl -X POST 'localhost:9200/city/_search'
{
 "aggs":{
   "city_id_count"：{ #需要自己定义一个聚合的名字
     "terms" : { #聚合类型：groupby and count 
       "count":{
         "field":"city_id.keyword"
       }
     }
   }
 }
}
#返回参数
{
 "aggregations":{
   "city_id_count":{
    "value": 10000
   }
 }
}

#select max(personNum),min(personNum),avg(personNum) as personNum_sum from city group by city_id
curl -X POST 'localhost:9200/city/_search'
{
 "aggs":{
   "city_id_groupby"：{ #需要自己定义一个聚合的名字
     "terms" : { #聚合类型：groupby 
       "field":"city_id.keyword"
     },
     "aggs":{
       "personNum_sum":{
         "stats":{
           "field":"personNum"
         }
       }
     }
   }
 }
}
#返回参数
{
 "aggregations":{
   "city_id_groupby":{
    "buckets":[
      "key": "guangzhou",
      "doc_count":41,
      "personNum_sum":{
        "count":41,
        "avg":20,
        "min":1,
        "max":32,
        "sum":1234
      }
    ]
   }
 }
}

# 分词搜索：查询city库中，area中有nanshan或者futian的文档
curl -X POST 'localhost:9200/city/_search'
{
  "query":{
    "match":{
      "area":"nanshan futian" #条件通过空格隔开,满足其一即可
    }
  }
}
# 查看表结构
curl -X GET 'localhost:9200/city'
# 返回结果
# 略

# 查看ES的基本情况（有哪些索引，索引有多少数据）
curl -X GET 'localhost:9200/_cat/indices?v'
```

**删除**

```bash
#删除文档
curl -X DELETE 'localhost:9200/city/guangzhou/12345858'
#删除city库
curl -X DELETE 'localhost:9200/city'
```



### ES集群
ES集群通过结点组成。

ElasticSearch集群中，共有五种结点类型：
* 主结点（Master）
* 候选主结点（Master-eligible）
* 数据结点（Data）
* 吸收结点（Ingest）
* 部落结点（Tribe）

**主结点**
每个集群只有一个主结点，负责：
* 管理集群（管理其他结点）
* 集群级别的操作（如索引的创建或删除、跟踪其他结点的状态等）

**候选主结点（相当于热备）**
当集群中的主结点出现故障时，集群会从候选主结点中进行选举，一个候选主结点被选中后会成为新的主结点。
只有候选主结点有投票权，其他结点没有投票权。

**数据结点**  
略

### 其他数据库与ES交互

**ES从其他数据源同步数据**：
mysql、oracle（关系型数据库）： logstash-input-jdbc
mongo： mongo-connector
kafka、文件、日志：Logstash或Apache Flume

### 在JAVA项目中集成ES

#### 使用HTTP调用ES API

```java
public class ElasticsearchHttpClient {
    public static void main(String[] args) {
        // Elasticsearch 配置
        String elasticsearchUrl = "http://localhost:9200";
        String indexName = "your_index_name";

        // 构建查询体
        String queryBody = "{\"query\": {\"match_all\": {}}}";

        // 创建 HttpClient
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            // 构建请求 URL
            String requestUrl = elasticsearchUrl + "/" + indexName + "/_search";

            // 创建 POST 请求
            HttpPost httpPost = new HttpPost(requestUrl);

            // 设置请求头部
            httpPost.setHeader("Content-Type", "application/json");

            // 设置请求体
            httpPost.setEntity(new StringEntity(queryBody, ContentType.APPLICATION_JSON));

            // 发送请求并获取响应
            HttpResponse response = httpClient.execute(httpPost);

            // 处理响应
            HttpEntity entity = response.getEntity();
            if (entity != null) {
                String responseBody = EntityUtils.toString(entity);
                System.out.println(responseBody);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### 使用ES官方JAVA库生成查询条件、发起查询请求

添加依赖
```xml
<dependencies>
    <dependency>
        <groupId>org.elasticsearch.client</groupId>
        <artifactId>elasticsearch-rest-high-level-client</artifactId>
        <version>7.15.1</version>
    </dependency>
</dependencies>

```

示例代码：
```java
public class ElasticsearchJavaAPI {
    public static void main(String[] args) {
        // Elasticsearch 配置
        String elasticsearchHost = "localhost";
        int elasticsearchPort = 9200;
        String indexName = "your_index_name";

        // 创建 Elasticsearch 客户端
        RestHighLevelClient client = new RestHighLevelClient(
                RestClient.builder(elasticsearchHost, elasticsearchPort));

        try {
            // 构建查询请求
            SearchRequest searchRequest = new SearchRequest(indexName);
            SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
            sourceBuilder.query(QueryBuilders.matchAllQuery());
            searchRequest.source(sourceBuilder);

            // 发送请求并获取响应
            SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);

            // 处理响应
            System.out.println(searchResponse.toString());
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            // 关闭 Elasticsearch 客户端连接
            try {
                client.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

#### 使用Spring Boot Data集成ES

添加依赖
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
    </dependency>
</dependencies>
```

添加配置
```yaml
spring:
  data:
    elasticsearch:
      cluster-name: your_cluster_name
      cluster-nodes: your_cluster_nodes
```

实体类定义
```java
@Document(indexName = "books")
public class Book {
    @Id
    private String id;
    private String title;
    private String author;

    // 省略构造函数、getter 和 setter 方法
}
```

方法1：定义Mapper，通过Mapper对索引进行操作
```java
public interface BookRepository extends ElasticsearchRepository<Book, String> {
    // 可以定义自定义的查询方法
}
```

方法2：使用ElasticSearchRestTemplate对索引进行操作

略


#### 使用Spring Boot Data封装查询条件

略

