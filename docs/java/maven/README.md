---
title: 'Maven'
sidebar: 'auto'
sidebarDepth: 2
---

# Maven使用宝典

## 配置文件：pom.xml

每一个maven项目，都会有一个pom.xml。

maven项目通过pom.xml来描述自己的以下信息：
* 本项目的基础信息（groupId、artifactId、version...）
* 本项目继承自哪个父pom（parent）
* 本项目聚合了哪些pom（modules）
* 本项目依赖哪些pom（dependencies）
* 本项目的生命周期中需要使用哪些插件（plugins）
* 与本项目相关的maven仓库（repositories）
* 本项目有哪些全局变量（properties）
* 本项目在不同运行环境（集成测试环境sit、用户测试环境uat、生产环境prod等）（profiles）
* 本项目有哪些资源文件（resources）
* ...

### 基础信息
* packaging：pom | jar(默认)
* scope: test | compile(默认) | runtime | provided | system
* name
* description
* licenses
* scm
* developers

### pom的继承（parent）

通过"parent"标签，来表示当前pom继承自哪个项目pom。

若没有写明，则默认继承的是super pom（超级pom）。

> 超级pom：存储在 %MAVEN_HOME%/lib 的某个jar包中。
> 定义了以下内容：
> * jar包仓库：默认从中心仓库拉取（http://repo1.maven.org/maven2）
> * plugin仓库：默认从中心仓库拉取（http://repo1.maven.org/maven2）
> * 定义好了每个生命周期执行时，默认使用哪些plugins
> 超级pom无需定义artifactId、groupId、version。

继承后，子pom相当于拥有了父pom的以下配置：
* groupId :项目组ID,项目坐标的核心元素
* version :项目版本,项目坐标的核心元素
* description :项目的描述信息
* organnization :项目的组织信息
* inceptionYear :项目的创始年份
* url :项目的URL地址
* developers :项目的开发者信息
* dependencies :项目的依赖配置
* dependencyManagement :项目的依赖管理配置
* repositories :项目的仓库配置
* build :包括项目的源码目录配置、输出目录配置、插件配置、插件管理配置等
* properties ：定义一些当前项目使用的变量名称，在子类中可以通过$获取直接使用

-------------------------------------------------

### pom的依赖管理（dependencies）

以前，在维护老旧的、没有使用maven的项目，当我们需要引入第三方库时（例如Spring、Mybatis等等），我们需要人工从
网上把JAR包下载，并放到项目的/lib目录下才能使用；

而使用maven后，只要你在pom.xml中写明你需要哪些第三方库（dependencies），maven会在构建项目（Build）时，
去相应的仓库下载你需要的JAR包下来。

存储在仓库中的这些第三方库（JAR），本质上也是一个maven项目，也有自己的pom.xml文件，描述着自己依赖着哪些第三方库。

假设你的项目是A，A依赖于第三方库B，B依赖于C，那么A项目在Build时，会同时把B、C两个库下载下来。

这就叫**传递依赖（Transitive Dependencies）**。



> 现在考虑一种情况，下面箭头表示依赖：
>
> A->B->C->D1（版本为1的D库）
>
> E->F->G->D2（版本为2的D库）
>
> A项目在Build时，会下载B、C和D1库；
>
> 当A需要依赖E时，E需要D2库，那此时A是下载D1库还是D2库呢？

以上情况叫**依赖冲突**，即项目有可能依赖同一个库的不同版本。

针对这种情况，maven有一套机制叫**依赖调解**，来选择使用哪个版本的库。

**机制1：根据依赖的深度来判断，深度越低越优先。**

回到上面的情况，D1的深度是3（A->D1经历3个节点），D2的深度是4（A->E->F->G-D2),因此最终会选择D1库。

> 若我想使用的其实是D2库，那我该怎么办？

很简单，A直接显式依赖D2库即可。直接依赖D2后，D2的深度变为1。

下面再介绍几种“依赖冲突”的情况。



情况1：
> A->B->C->D1（版本为1的D库）
>
> A->F->G->D2（版本为2的D库）

此时产生冲突，且冲突的两个库深度一样（均为3），这种情况下，先定义的优先（B比F先定义，因此选择D1库），

**机制2：深度一致时，先定义的库优先级更高**




情况2：
> A继承项目B，且B依赖D1
>
> A->C->D2

“A继承项目B，且B依赖D1”，其实就等于A直接依赖了D1，因此D1优先级更高





情况3：
> A继承项目B，且B依赖D1
>
> A->D3
>
> A->C->D2

因为A直接依赖了D3，所以D3优先级肯定最高；其次D1；最低是D2。



**机制3：显式直接依赖，优先级最高；其次是继承依赖（来自父pom的依赖）；最后是传递依赖（来自依赖的依赖）**

-------------------------------------------------

### 依赖的作用域（dependency.scope）
* compile（默认）：编译时需要依赖，会在编译时把JAR包放到项目中
* provided：依赖由web容器提供，JAR包不会被放到项目中
* runtime：运行时需要依赖，编译时不需要（例如JDBC API包）
* test：测试编译和测试阶段需要依赖
* import：只能用在dependencyManagement、且type为pom的情况下。可理解为“继承某个库的依赖”、**多继承模式**。
* system：本地提供的JAR包，不会去maven仓库下载，需要用到systemPath标签
```xml
<project>
  <dependencies>
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>5.7.4</version>
      <scope>system</scope>
      <systemPath>${java.home}/../lib/mysql-connector-java.jar</systemPath>
    </dependency>
  </dependencies>
</project>
```

-------------------------------------------------

### 依赖的类型（dependency.type）

type 有 jar 、 war 、 bar 、 pom几种类型，默认为jar。

* jar：依赖dependency对应的Jar包
* pom：继承dependency的pom文件中，定义在dependencyManagement的dependency

-------------------------------------------------

### 依赖管理器的作用（dependencyManagement）

* 限制子pom只能使用某些Jar包的固定版本

-------------------------------------------------

### pom的聚合（modules）

> 聚合跟继承的相同点以及区别？

相同点；
* 都是描述父pom与子pom的关系。

父pom的特征：
* packaging = pom
* 只有dependencyManagement，没有dependency

子pom的特征：
* packaging = jar


不同点：
* 继承是为了减少重复配置，将通用配置都写到父pom；聚合则是为了提供按业务将系统分成多个模块的功能


-------------------------------------------------


## 配置文件：setting.xml
## Maven仓库
Maven仓库有三种类型：本地仓库（Local）、中央仓库（Central）、远程仓库（Remote）

***本地仓库***

***中央仓库***

中央仓库地址：https://repo1.maven.org/maven2/

依赖包搜索地址：https://mvnrepository.com/



***远程仓库***

***Maven仓库镜像（Mirror）***
* 在setting.xml 中的<mirrors></mirrors>可配置Maven的仓库镜像；
* 仓库镜像配置示例如下：
```xml
<!-- 
【id】 即镜像ID，在pom.xml可通过镜像ID指定从哪个仓库进行下载
【mirrorOf】镜像类型。可填：1. "*"、2."central"、3."仓库id1,仓库id2..."
若镜像类型为*，表明所有下载均通过该镜像来进行（无论配置了多少个镜像）
若镜像类型为central，则表明该镜像为中央仓库的镜像

【name】
【url】
-->
<!-- 阿里云仓库 -->
<mirror>
    <id>alimaven</id>
    <mirrorOf>central</mirrorOf>
    <name>aliyun maven</name>
    <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
</mirror>

<!-- 中央仓库1 -->
<mirror>
    <id>repo1</id>
    <mirrorOf>central</mirrorOf>
    <name>Human Readable Name for this Mirror.</name>
    <url>http://repo1.maven.org/maven2/</url>
</mirror>
```
* 若配置了多个仓库，则默认只会使用第一个仓库（除非第一个仓库连接不上，则使用下一个）


