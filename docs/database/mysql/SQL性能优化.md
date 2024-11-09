---
title:SQL性能优化
---

# SQL性能优化

## 1. 分析SQL的执行计划

通过关键字```explain```，我们可以获取到某条sql的执行计划：

```
explain
select * from student where name like '%haha%'
```
执行计划示例：

| id  | select_type | table    | type   | possible_keys                                                                                              | key                             | key_len | ref                       | rows | Extra                                                     |
|-----|-------------|----------|--------|------------------------------------------------------------------------------------------------------------|---------------------------------|---------|---------------------------|------|-----------------------------------------------------------|
| 1   | PRIMARY     | derived2 | ALL    |                                                                                                            |                                 | 2934    |                           |      |                                                           |
| 1   | PRIMARY     | rll      | eq_ref | PRIMARY                                                                                                    |                                 | 8       | tmp.LINE_LOCATION_ID      | 1    |                                                           |
| 1   | PRIMARY     | rl       | eq_ref | PRIMARY                                                                                                    |                                 | 8       | srm_price.rll.PO_LINE_ID  | 1    |                                                           | 
| 1   | PRIMARY     | rh       | eq_ref | PRIMARY                                                                                                    |                                 | 8       | srm_price.rl.PO_HEADER_ID | 1    | Using where                                               |
| 2   | DERIVED     | h        | ref    | PRIMARY, srm_po_headers_n1                                                                                 | srm_po_headers_n1               | 42      | const                     | 326  | Using where; Using index; Using temporary; Using filesort |
| 2   | DERIVED     | l        | ref    | PRIMARY, srm_po_lines_n1                                                                                   | srm_po_lines_n1                 | 8       | srm_price.h.PO_HEADER_ID  | 3    | Using where; Using index                                  |
| 2   | DERIVED     | ll       | ref    | PRIMARY, srm_po_line_locations_102000_n3, srm_po_line_locations_102000_n6, srm_po_line_locations_102000_n7 | srm_po_line_locations_102000_n3 | 8       | srm_price.l.PO_LINE_ID    | 3    | Using index condition; Using where                        |



下面我们看看执行计划有哪些内容：
 
### id

id值越大，执行优先级越高；  
id值相同，则从上往下执行；id为null最后执行。  

### select_type

select_type表示对应行是简单还是复杂的查询

* simple：简单查询。查询不包含子查询和union
* primary：复杂查询中最外层的select
* subquery：包含在 select 中的子查询(不在 from 子句中)
* derived：包含在 from 子句中的子查询。MySQL会将结果存放在一个临时表中，也称为派生表(derived的英文含义)
* union：在 union 中的第二个和随后的 select

### table

table表示正在访问哪个表


### type

这一列表示关联类型或访问类型，即MySQL决定如何查找表中的行，查找数据行记录的大概范围。  

依次从最优到最差分别为：```system > const > eq_ref > ref > range > index > ALL  ```

一般来说，得保证查询达到range级别，最好达到ref  

* system: 表里只有一条数据时  
```sql
select * from student; -- student表里只有一条数据
```

* const: 查询条件 “主键=常量”
```sql
select * from student where student_id = 1; 
```

* eq_ref: 查询条件是**唯一索引**，只对应一条记录  
```sql
select * from student left join teacher on student.teacher_id = teacher.teacher_id;
```

* index: 用到了覆盖索引，即需要查询的数据可以直接通过索引表获取，而不需要访问实际的数据行。  

* ref: 查询条件是 **普通索引**，可能对应多条记录  
```sql
select * from student left join teacher on student.teacher_name = teacher.teacher_name;
```

* range: 范围扫描。查询条件里含 in(),between,大于,小于,大于等于 等操作  
```sql
select * from student where student_id > 1;  -- 唯一索引，也会触发范围扫描
select * from student where student_name > 'John'; -- student_name有一个普通索引，此时也是range
select * from student where age > 10; -- age没索引，此时就不是range，而是ALL（全表扫描）
```

* ALL: 全表扫描（完全没走索引，一条一条地查）


### possible_keys

列出查询可能使用的索引。


### key

实际采用哪个索引。


### key_len

表示mysql实际在索引里使用的字节数。

假如是单个索引：  
* char(n) --- n个字节
* varchar(n) --- 2个字节储存字符串长度，如果是utf-8，则3n+2个字节
* tinyint --- 1个字节
* smallint --- 2个字节
* int --- 4个字节
* bigint --- 8个字节
* date --- 3个字节
* timestamp --- 4个字节
* datetime --- 8个字节

假如是联合索引：  

假设student表有一个联合索引：class_id + student_name
```sql
-- 1
select * from student where class_id = 3
-- 2
select * from student where class_id = 3 and student_name = 'John';
```

如上2条sql都使用了这个联合索引。  
sql1，只用到了第1个列，class_id是bigint，所以key_len是8；  
sql2，2个列都用上了，student_name是varchar(10)，所以key_len是8+30+2=40。  


### ref

表示在key列的索引中，表查找用到的列或常量。  
```sql
select * from student where class_id = 3 and student_name = 'John';
```
如上sql，ref = 'const,const'  


### rows

表示估计要读取的行数。  

### Extra 

额外信息。从额外信息中我们也可以看到sql哪里需要优化：  

* Using index
* Using where
* Using index condition
* Using temporary: 使用了临时表（**需要优化**）
* Using filesort: Server层需要做额外的排序操作（**需要优化**）
* Select tables optimized away