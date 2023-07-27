---
title:SQL速查
---

# SQL速查


## 列转行

```sql
select 
teacher_name,
GROUP_CONCAT(student_name,',') students
from student
group by teacher_name
```
student表：  

|teacher_name|student_name|
|---|---|
|黄老师|小明|
|黄老师|小红|
|红老师|小黑|

结果：  

|teacher_name|students|
|---|---|
|黄老师|小明,小红|
|红老师|小黑|


## 获取子字符串 

```sql 
-- 获取前2个字符（黄老师 -> 黄老）
select SUBSTRING(student_name,1,2) 
from student;

-- 获取第2个字符开始，后面的子字符串（黄老师 -> 老师）
select SUBSTRING(student_name,2) 
from student;

-- 获取倒数2个字符串（我是黄老师 -> 老师）
select SUBSTRING(student_name,-2) 
from student;
```

## 字符串拼接

```sql 
-- 用CONCAT函数。支持多个入参
select
CONCAT('A','B',student_name,'HAHAHA')
from student;
```


## DISTINCT 的用法

加在SELECT之后，比如：
```sql
select distinct name,age from person;
```

用于对查出来的行进行去重。  

也可以用于group by的语句：
```sql 
select student_name,count(distinct subject) 
from course group by student_name;
```
