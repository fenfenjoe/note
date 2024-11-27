---
title: 'Windows命令速查宝典'
sidebar: 'auto'
---

# Windows命令速查宝典


##### 查看进程号：tasklist |findStr "进程名称"

##### 查看端口占用情况：netstat -ano
```bash
#查看所有端口占用情况
netstat -ano 
#查看某个端口占用情况
netstat -ano|findstr [端口号]
```

##### 杀死某个进程：tskill
```bash
tskill [进程号]
```

##### 从返回的结果中搜索：findstr
```bash
#打印JVM参数，并且只返回带有“Use”的行
java -XX:+PrintFlagsFinal|findstr Use

```



## .bat脚本常见格式

**注释**
```bat
@echo on
:: 注释
%注释%
```

