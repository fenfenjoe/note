---
title:Mysql使用笔记
---

# Mysql使用笔记


### 1. 当查询条件中含有不等于号（!=），是查不出NULL的数据的

示例：  
Teacher表

| ID  | NAME  | AGE |
|-----|-------|-----|
| 1   | JOHN  | 28  |
| 2   | ALICE | 35  |
| 3   | NULL  | 29  |

查询SQL：```sql SELECT * FROM TEACHER WHERE NAME != 'JOHN'```

结果：  

| ID  | NAME   | AGE |
|-----|--------|-----|
| 2   | ALICE  | 35  |
