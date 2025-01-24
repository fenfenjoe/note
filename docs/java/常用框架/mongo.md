


## 依赖包

```xml
<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-mongodb</artifactId>
    <version>3.4.1</version>
</dependency>
<dependency>
    <groupId>org.mongodb</groupId>
    <artifactId>mongodb-driver-sync</artifactId>
    <version>4.5.0</version>
</dependency>
```

## API

使用```MongoTemplate```类，就可以完成对MongoDB的增删改查。
- 增
  - insert(T object)：插入一个文档
  - insertAll(Collection<T> objects)：插入多个文档
  - save(T object)：保存或更新一个文档
- 删
  - remove(T object)：删除一个文档
  - removeAll(Collection<T> objects)：删除多个文档
  - remove(Query query)：删除符合条件的文档
- 改
  - save(T object)：保存或更新一个文档
  - updateFirst(Query query, Update update)：更新第一个符合条件的文档
  - updateMulti(Query query, Update update)：更新所有符合条件的文档
- 查
  - findAll(Class<T> entityClass)：查询所有文档
  - findOne(Query query, Class<T> entityClass)：查询第一个符合条件的文档
  - find(Query query, Class<T> entityClass)：查询所有符合条件的文档

### 查询详解

1. select * from student;

```
List<Student> students = mongoTemplate.findAll(Student.class);
```

2. select * from student where id = 1;

```
Query query = new Query(Criteria.where("id").is(1));
Student student = mongoTemplate.findOne(query, Student.class);
```

3. select name,age from student where id = 1;

```
Query query = new Query(Criteria.where("id").is(1)); 
query.fields().include("name").include("age"); 
Student student = mongoTemplate.findOne(query, Student.class);
```

4. select * from student where name='Mike' and age=14;

```
Query query = new Query(Criteria.where("name").is("Mike").and("age").is(14));
List<Student> students = mongoTemplate.find(query, Student.class);
```

5. select * from student where age>14;

```
Query query = new Query(Criteria.where("age").gt(14)); 
List<Student> students = mongoTemplate.find(query, Student.class);
```

6. select * from student where name != 'Mike';

```java 
Query query = new Query(Criteria.where("name").ne("Mike"));
List<Student> students = mongoTemplate.find(query, Student.class);
```

7. select max(age) as maxAge,min(age) as minAge from student where grade = 4 and class = 3;

```
Aggregation aggregation = Aggregation.newAggregation(
    Aggregation.match(Criteria.where("grade").is(4).and("class").is(3)),
    Aggregation.group().max("age").as("maxAge").min("age").as("minAge")
);
AggregationResults<Map> results = mongoTemplate.aggregate(aggregation, "student", Map.class);
Map result = results.getUniqueMappedResult();
Integer maxAge = (Integer) result.get("maxAge");
Integer minAge = (Integer) result.get("minAge");
```

8. select age,count(1) from student group by age;

```
Aggregation aggregation = Aggregation.newAggregation(
    Aggregation.group("age").count().as("count")
);
AggregationResults<Map> results = mongoTemplate.aggregate(aggregation, "student", Map.class);
List<Map> resultList = results.getMappedResults();
```

9. select * from student where create_date>'2024-12-01';

``` 
Query query = new Query(Criteria.where("create_date").gt(new Date("2024-12-01"))); 
List<Student> students = mongoTemplate.find(query, Student.class);
```

10. select age+10 from student;

``` 
Aggregation aggregation = Aggregation.newAggregation(
    Aggregation.project("age")
        .and("age").plus(10).as("newAge")
);

AggregationResults<Student> results = mongoTemplate.aggregate(aggregation, "student", Student.class);

List<Student> students = results.getMappedResults();
```

11. select * from student where age = 14 order by name limit 10;

``` 
Aggregation aggregation = Aggregation.newAggregation(
    Aggregation.match(Criteria.where("age").is(14)),
    Aggregation.sort(Direction.ASC, "name"),
    Aggregation.limit(10)
);
AggregationResults<Student> results = mongoTemplate.aggregate(aggregation, "student", Student.class);
List<Student> students = results.getMappedResults();
```

12. select * from student where name in('Mike','Joe');

``` 
Query query = new Query(Criteria.where("name").in(Arrays.asList("Mike", "Joe")));
List<Student> students = mongoTemplate.find(query, Student.class);
```

13. select age * 2 as doubleAge from student;

``` 
Aggregation aggregation = Aggregation.newAggregation(
    Aggregation.project("name", "age")
        .and("age").multiply(2).as("doubleAge")
);
AggregationResults<Student> results = mongoTemplate.aggregate(aggregation, "student", Student.class);
List<Student> students = results.getMappedResults();
```