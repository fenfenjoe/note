---
title: Freemarker
sidebar: 'auto'
sidebarDepth: 2
---

# 模板引擎框架：freemarker


## 参考资料

官方中文文档：<http://freemarker.foofun.cn/>   

在线试用FreeMarker：<https://try.freemarker.apache.org/>


## 简介

**FreeMarker** 是一款 **模板引擎**，是一款用户自己编写好模板，然后再输入一些数据，便可以按模板输出文本的Java工具。  

现在已是Apache软件基金会的项目。  

常用场景：  
* 动态HTML（对标JSP）
* 电子邮件
* 代码生成
* ...

下面从**数据**、**模版**两方面介绍Freemarker。  

## 数据

可以这么理解：FreeMarker为每个模板维护了一个**Map对象**；  
用户调用模板前，往该Map对象中输入数据；  
FreeMarker渲染时，就从该Map对象中获取数据。  


## 模板

FreeMarker模板是一个以.ftl作后缀的文本文件。下面是一个示例FTL文件：

```html
<html>
<head>
  <title>Welcome!</title>
</head>
<body>
  <h1>
    Welcome ${user}<#if user == "Big Joe">, our beloved leader</#if>!
  </h1>
  <p>Our latest product:
  <a href="${latestProduct.url}">${latestProduct.name}</a>!
</body>
</html>
```

可以看出，这是一个动态HTML的模板。其中，除了一些HTML标签外，还有```${user}```、```<#if user == "Big Joe">```这样的**标签**。  
这些就是FreeMarker的**指令**。  

FreeMarker的指令可以分成3类：
* **插值**：```${...}```，FreeMarker将会输出真实的值来替换大括号内的表达式
* **注释**：```<#-- and -->```，注释不会出现在输出中
* **FTL标签**：以 “#”开头的标签。（用户还可以自定义标签，自定义标签用@开头）


## 语法

### 模板中创建变量：assign

创建一个数组
```html
<#assign seq = ["foo", "bar", "baz"]>
```

更新变量的值
```html
<#assign x++>
```

也可以同时执行
```html
<#assign
  seq = ["foo", "bar", "baz"]
  x++
>
```

你还可以这么写
```html
<#assign x="Hello ${user}!">
```

### 异常捕捉：attempt & recover

假设你的模板中有这么一段：
```html
Our chief is:${user}
```

渲染时，如果发现数据中没有user这个变量，freemarker会抛出异常，导致渲染失败；  
如果我们想处理这个异常，可以这么写：  
```html
<#attempt>
  Our chief is:${user}
<#recover>
  Ops! We don't have chief.
</#attempt>
```

其中，当user变量不存在时，便会输出```<#recover>```标签后面的内容。  

> [!note]
> 如果想“变量不存在时，则默认给空值”，可以写成：```${user!}```


### 在模板中定义函数：function & return 

创建一个计算2个数平均值的、名字为avg的函数
```html
<#function avg x y>
  <#return (x + y) / 2>
</#function>
${avg(10, 20)}
```

创建一个计算多个数平均值的、名字为avg的函数
```html
<#function avg nums...>
  <#local sum = 0>
  <#list nums as num>
    <#local sum = sum + num>
  </#list>
  <#if nums?size != 0>
    <#return sum / nums?size>
  </#if>
</#function>
${avg(10, 20)}
${avg(10, 20, 30, 40)}
```


### 定义全局变量：global

```html
<#-- 定义全局变量 -->
<#global x=1>

<#-- 使用全局变量 -->
${.global.x}
```


### 条件判断语句：if & elseif & else

```html
<#if x == 1>
  x is 1
<#elseif x == 2>
  x is 2
<#elseif x == 3>
  x is 3
<#elseif x == 4>
  x is 4
<#else>
  x is not 1 nor 2 nor 3 nor 4
</#if>
```

### 模板A中嵌套模板B：include

模板B：
```html
Copyright 2001-2002 ${me}<br>
All rights reserved.
```

模板A中嵌套模板B的内容：
```html
<#assign me = "Juila Smith">
<h1>Some test</h1>
<p>Yeah.
<hr>
<#include "/common/copyright.ftl">
```

### 对数组迭代处理：list & else & items & sep & break

输出1~10，每行1个数字
```html
<#list 1..10 as x>
  ${x}
</#list>
```

在一列中，输出students数组中所有人名，并用英文逗号隔开：sep
```html
<#assign students=['Amy','Joe','Jackson']>

<#list students as student>${student}<#sep>,</#sep></#list>
```

数组为空时的处理：else
```html
<#assign students=[]>
<#list students as student>
${student}<#sep>,</#sep>
<#else>
<p>no user</p>
</#list>

```

在迭代过程中退出：break
```html
<#list 1..10 as x>
  ${x}
    <#if x == 3>
        <#break>
    </#if>
</#list>
```


### 不想渲染某段内容：noparse

```html
<html>
<#noparse>
<#list animals as animal>
<tr><td>${animal.name}<td>${animal.price} Euros
</#list>
</#noparse>
</html>

```

模板渲染后，noparse里面的FTL标签不会被渲染
```html
<html>
<#list animals as animal>
<tr><td>${animal.name}<td>${animal.price} Euros
</#list>
</html>
```

### 去掉首尾的空白：t & lt & rt

* lt: 忽略本行中首部的空格、制表符
* rt: 忽略本行中尾部的换行符（尾部的空格、制表符不会去掉）
* t: 忽略本行中首部的空格、制表符，尾部的换行符（尾部的空格、制表符不会去掉）

示例1
```html
  1  <#t>
2
```
结果1
```html
1  2
```

示例2
```html
  1  <#lt>
2
```
结果2
```html
1  
2
```

示例3
```html
  1  <#rt>
2
```
结果3
```html
  1  2
```