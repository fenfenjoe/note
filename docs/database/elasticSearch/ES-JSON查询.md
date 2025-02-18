
# ES-JSON查询


## 查询详解

1. ```select * from student;```

```json 
GET /student/_search
{
  "query": {
    "match_all": {}
  }
}
```

2. ```select * from student where id = 1;```

```json 
GET /student/_search
{
  "query": {
    "term": {
      "id": 1
    }
  }
}
```

3. ```select name,age from student where id = 1;```

```json 
GET /student/_search
{
  "query": {
    "term": {
      "id": 1
    }
  },
  "_source": {
    "includes": ["name", "age"]
  }
}
```

4. ```select * from student where name='Mike' and age=14;```

```json 
GET /student/_search
{
  "query": {
    "bool": {
      "filter": [
        { "term": { "name": "Mike" } },
        { "term": { "age": 14 } }
      ]
    }
  }
} 
```


5. ```select * from student where age>14;```

```json 
GET /student/_search
{
  "query": {
    "range": {
      "age": { "gt": 14 }
    }
  }
}

```

6. ```select * from student where name != 'Mike';```

```json 
GET /student/_search
{
  "query": {
    "bool": {
      "must_not": [
        { "term": { "name": "Mike" } }
      ]
    }
  }
}
```

7. ```select max(age) as maxAge,min(age) as minAge from student where grade = 4 and class = 3;```

```json 
GET /student/_search
{
  "query": {
    "bool": {
      "filter": [
        { "term": { "grade": 4 } },
        { "term": { "class": 3 } }
      ]
    }
  },
  "aggs": {
    "maxAge": { "max": { "field": "age" } },
    "minAge": { "min": { "field": "age" } }
  }
}
```

8. ```select age,count(1) from student group by age;```

```json 
GET /student/_search
{
  "aggs": {
    "age": {
      "terms": { "field": "age" },
      "aggs": {
        "count": { "value_count": { "field": "_index" } }
      }
    }
  }
}
```

9. ```select * from student where create_date>'2024-12-01' and create_date<'2025-03-01';```

```json 
GET /student/_search
{
  "query": {
    "bool": {
      "filter": [
        { "range": { "create_date": { "gt": "2024-12-01" } } },
        { "range": { "create_date": { "lt": "2025-03-01" } } }
      ]
    }
  }
}

```

10. ```select age+10 from student where name='Joe';```

```json 
GET /student/_search
{
  "query": {
    "term": {
      "name": "Joe"
    }
  },
  "script_fields": {
    "age_plus_10": {
      "script": {
        "source": "doc['age'].value + 10"
      }
    }
  }
}
```

11. ```select * from student where age = 14 order by name limit 10;```

```json 
GET /student/_search
{
  "query": {
    "term": {
      "age": 14
    }
  },
  "sort": [
    { "name": "asc" }
  ],
  "size": 10
}
```

12. ```select * from student where name in('Mike','Joe');```

```json 
GET /student/_search
{
  "query": {
    "terms": {
      "name": ["Mike", "Joe"]
    }
  }
}

```

13. ```select age * 2 as doubleAge from student;```

```json 
GET /student/_search
{
  "script_fields": {
    "doubleAge": {
      "script": {
        "source": "doc['age'].value * 2"
      }
    }
  }
}
```