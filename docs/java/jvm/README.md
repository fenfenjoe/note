---
title: JVM
---

# JVM

##### JVM内存模型

* 进程控制块
    * 程序计数器
* 本地接口
* 运行时数据区
    * 堆------------------------------存储对象、字符串常量（1.7之后）
        * 新生代------------------------对象
            * Eden区（80%）
            * Survivor1区（10%）
            * Survivor2区（10%）
        * 老年代------------------------对象
        * 永久代（1.7之前作为方法区）-----静态变量、常量、类信息
    * 方法区--------------------------存储类信息、静态变量和常量值
    * 线程空间
        * 栈----------------------------存储基本类型变量和对象引用
        * 线程控制块
        * 虚拟缓存

1.7之前：
- 基本数据类型变量(int,float,double等) ——  栈帧（线程空间）
- 对象引用 —— 栈帧（线程空间）
- 静态变量 —— 堆->  永久代（被称为方法区）
- 常量值 —— 堆->  永久代（被称为方法区）
- 类信息(.class) —— 堆->  永久代（被称为方法区）
- 字符串常量值 ——  字符串常量池
- 对象 —— 堆 -> 新生代、老年代


1.7之后：
- 基本数据类型变量(int,float,double等) ——  栈帧（线程空间）
- 对象引用 —— 栈帧（线程空间）
- 静态变量 —— 堆
- 常量值 —— 元数据metaspace（也被称为方法区）
- 类信息(.class) —— 元数据metaspace（也被称为方法区）
- 字符串常量值 —— 堆->  字符串常量池
- 对象 —— 堆 -> 新生代、老年代

>简单来讲：
>  - 栈帧：存储基本类型变量和对象引用；
>  - 方法区：存储类信息和常量值；1.7之前在堆里，1.7后独立出来，命名为元数据metaspace；
>  - 堆：存储对象，分为新生代、老年代；永久代只有1.7之前有，1.7后独立出来被称为元数据metaspace；
>  - 字符串常量池：存储字符串常量，1.7之前在堆外、1.7之后移到了堆内。


##### Java对象在内存里占用多少空间？

首先需要知道对象的数据结构：
* 对象头
    * 对象基本信息（锁、线程ID等）：8 bytes
    * 对象指针：4 bytes（开启指针压缩时）、8 bytes（没开启指针压缩时）
    * 数组长度：4 bytes
* 实例内容
    * boolean:1 bytes
    * byte:1 bytes
    * short:2 bytes
    * char:2 bytes
    * int:4 bytes
    * float:4 bytes
    * long:8 bytes
    * double:8 bytes
    * Reference:4 bytes（开启指针压缩时）、8 bytes（没开启指针压缩时）
* 填充内容
    * 仅为了保证对象大小为8 bytes的整数倍

> 指针压缩默认为开启，对应JVM参数：-XX:-UseCompressedOops

示例：
```java
public class Student{
    String name;
    int age;
    boolean isMale;
}
/**
*该类一个对象的大小：（假设开启了指针压缩）
* 对象头：16 bytes
* 实例内容： 9 bytes
* 填充内容： 7 bytes
* 【总共】：32 bytes = 32B = 0.032KB
**/
```

##### JVM如何管理内存？
JVM会自动回收对象。需要被回收的对象被称为“垃圾”。
对象回收又被称为“GC”；
根据回收堆里哪部分的对象，GC又分为：MinorGC（新生代）、Major GC（老年代）、Full GC（新+老）；

##### 怎么样判断对象是否可回收？
JVM通过“可达性分析算法”，来判断对象是否需要被回收。
即维护了多个树表，根节点名为GC Root，若通过遍历GC Root的子树能找到某个对象，则认为该对象是“存活的”，无需被回收。

以下这些都可以作为GC Root：
* 存活的线程（Thread）
* Java虚拟机栈中引用的对象
* 方法区中静态变量引用的对象
* 方法区中常量引用的对象
* 本地方法栈中JNI引用的对象

##### 什么是MinorGC？Major GC？Full GC？
* MinorGC：清理新生代的内存，并将部分存活的对象晋升到老年代
>具体方法是：将Eden区清空，将Eden区和Suvivor区中存活的对象移动到另一个Suvivor区中。将对象的年龄+1。

* MajorGC：清理老年代的内存

* FullGC：清理新生代+老年代+方法区的内存

##### 怎么触发新生代晋升到老年代？
1. Eden区满，触发了MinorGC
2. 大对象，直接进入老年代（XX:PretenureSizeThreshold）
3. Survivor中年龄超过一定临界值的（XX:+MaxTenuringThreshold）
4. Survivor区中对象占用空间的大小之和超过50%
5. MinorGC后对象过多，无法完全放入Survivor区，就会向老年代借用内存存放对象，以完成MinorGC

##### 怎么触发GC?

Minor GC触发条件：
* Eden区域满了
* 新生对象需要分配到新生代的Eden，当Eden区的内存不够时需要进行MinorGC

Major GC触发条件：
* Survivor区中对象占用空间的大小之和超过50%

Full GC触发条件：
* 上面Minor GC时介绍中Survivor空间不足时，判断是否允许担保失败，如果不允许则进行Full GC。如果允许，并且每次晋升到老年代的对象平均大小>老年代最大可用连续内存空间，也会进行Full GC。

* MinorGC后存活的对象超过了老年代剩余空间

* 方法区内存不足时

* System.gc()，可用通过-XX:+ DisableExplicitGC来禁止调用System.gc

* CMS GC异常，CMS运行期间预留的内存无法满足程序需要，就会出现一次“Concurrent Mode Failure”失败，会触发Full GC

##### JVM如何实现GC？有哪些GC算法？

默认垃圾回收器：
JDK1.3之前
* 新生代：Serial（串行的Copying算法）
* 老年代： Serial Old（串行的Mark-Compact算法）

JDK1.8之前
* 新生代：Parallel Scavenge（并行的Copying算法）
* 老年代：Serial Old（串行的Mark-Compact算法）、Parallel Old（1.8，并行的Mark-Compact算法）

JDK1.9
新生代、老年代均用：G1

JDK1.11之后
ZGC

***垃圾收集器简述***

**Serial垃圾回收器（既有新生代的：Serial、也有老年代的Serial Old）**
只使用一个GC线程进行回收（串行），会暂停所有的用户线程，不适合服务器环境。

**Parallel垃圾回收器（既有新生代的：ParNew、Parallel、也有老年代的：Parallel Old）**
多个GC线程进行垃圾回收（并行），也会暂停所有用户线程，适用与和前台交互不强的场景，如科学计算/大数据处理等若交互场景。

***CMS垃圾回收器：老年代回收器，推荐配合ParNew使用***
基于Mark-Sweep（“标记-清除”）算法
若干次GC后需要进行一次碎片整理。
优点：大部分时间能与用户线程并行运行。
缺点：有内存碎片，若需要为较大的对象分配内存，容易又会触发GC

过程：
- 初始标记(CMS-initial-mark) ,会导致stw;
- 并发标记(CMS-concurrent-mark)，与用户线程同时运行；
- 预清理（CMS-concurrent-preclean），与用户线程同时运行；
- 可被终止的预清理（CMS-concurrent-abortable-preclean） 与用户线程同时运行；
- 重新标记(CMS-remark) ，会导致stw；
- 并发清除(CMS-concurrent-sweep)，与用户线程同时运行；
- 并发重置状态等待下次CMS的触发(CMS-concurrent-reset)，与用户线程同时运行。

***G1垃圾回收器***
基于Mark-Compact（“标记-整理”）算法
优点：回收得到的内存空间是连续的。

过程：
Eden区满，触发Minor GC：回收新生代；
Full GC：回收新生代、老年代、永久代（JDK1.8后为metaspace）

**一般的垃圾回收器搭配&如何选择垃圾回收器**
1. 串行收集器：Serial（yong区）+ SerialOld（old区）
   对应参数：
   -Xms10m -Xmx10m -XX:+PrintGCDetails -XX:+UseSerialGC
   > 最古老的垃圾收集器，单个GC线程，GC时会阻塞用户线程。
   > 适合：单核CPU或者小内存，单机程序

2. 并行收集器：ParNew（Yong） + SerialOld（old）**（已被废弃）**
   对应参数：
   -XX:+UseParNewGC
   >很多java虚拟机运行在server模式下新生代的默认垃圾收集器。
   >多线程GC，但仍然会阻塞用户线程。

3. 并行收集器：ParallelScavenge（Young） + ParallelOld（old）
   对应参数：
   -XX:+UseParallelGC（同时会激活-XX:+UseParallelOldGC参数）
   >ParallelScavenge提供了一种自适应调整策略，会收集系统性能监控信息，尽量让GC时间占JVM运行时间越少，提高系统吞吐量。
   >吞吐量=用户线程运行时间/（GC线程运行时间 + 用户线程运行时间）
   >适合：多CPU，后台计算型应用

4. 并发标记清除收集器：CMS **（1.9后被废除）**
   对应参数：
   -XX:+UseConcMarkSweepGC（同时会激活-XX:+UseParNewGC参数）
   >是一种以获取最短回收停顿时间为目的的收集器。适用于互联网站或者B/S系统的服务器上。
   >ParNew（yong）+CMS（Old）+SerialOld收集器的组合，Serial Old将作为CMS出错的后备收集器。
   >适合：多CPU，追求低停顿时间，快速响应如互联网应用
   >jdk1.7或更低、jdk8内存较低（低于4G）时可选择CMS。

5. G1收集器
   对应参数：
   -XX:+UseG1GC
   >从1.7版本之后就开始有的垃圾回收器。
   >G1意为“Garbage First”，即垃圾优先，哪一块垃圾多先清理那一块。
   >特点为：并发并行（）、没有内存碎片（基于标记整理算法）、可预测的停顿（STW）
   >适合：内存较大（8G以上）、多CPU的服务器

###### 垃圾回收算法简述
***Copying（标记复制）算法：新生代的算法***
将内存分为大小相等的两份（即现在的Eden区和Survivor区）
1.Eden区满后，触发一次GC：标记Eden区的存活对象，将存活对象移至其中一个Survivor区（Survivor0）
2.清空Eden区
3.Eden区又满，触发一次GC：标记Eden区及Survivor区的存活对象，将存活对象移至另一个Survivor区（Survivor1）
4.清空Eden区和Survivor0区
5.若存活对象经历GC的次数达到一个阙值（-XX:MaxTenuringThreshold），则会被移进老年代

优点：无需清除和整理、效率较高；不会产生内存碎片。适合会有大量失活的新生代
缺点：需要两倍的内存空间

***Mark-Sweep（“标记-清除”）算法：老年代的算法***
1. 标记需要清除的对象
2. 清除

优点：快速简单
缺点：有内存碎片，若需要为较大的对象分配内存，容易又会触发GC

***Mark-Compact（“标记-整理”）算法：老年代的算法***
1. 标记需要清除的对象
2. 让存活对象移至一端
3. 清除

##### 与垃圾回收相关的系统参数
-XX:+MaxTenuringThreshold =15 晋升到老年代需要的年龄

-XX:TargetSurvivorRatio =50% Survivor空间占用超过50%，会将年龄较大的晋升到老年代

-XX:NewRatio=1:2 新生代与老年代的比例（默认1:2）

-XX:SurvivorRatio=8:1:1 Eden区与Survivor区的比例（默认8:1:1）

-XX:PretenureSizeThreshold= 对象大于此参数的值，则绕过新生代，直接分配到老年代（只对Serial及ParNew有效）

-Xms —— 堆的初始大小（young+old+perm）

-Xmx —— 最大堆内存

-Xmn —— 年轻代大小（young，推荐配置为整个堆的3/8）

-XX:NewSize / XX:MaxNewSize — 设置新生代大小/新生代最大大小（young，默认young:old=1:2）

-XX：MaxPermSize —— 最大方法区内存（perm，1.8之后该参数无效，因为metaspace无限大）

###### 开启垃圾回收器类的参数
-XX:+UseSerialGC （新生代用：Serial 老年代用：Serial Old）

-XX:+UseParNewGC（新生代用：ParNew 老年代默认用：Serial Old）

-XX:+UseParallelGC（新生代用：Parallel Scavenge 老年代默认用：Serial Old(1.8前)、Parallel Old(1.8后)）

-XX:+UseParallelOldGC（老年代用：Parallel Old，新生代：自动激活-XX:+UseParallelGC使用）

-XX:+UseConcMarkSweepGC （老年代用：CMS，新生代：自动激活-XX:+UseParNewGC使用）

-XX:+UseG1GC （新生代用：G1 老年代用：G1）

##### 其他常用参数
-XX:InitialHeapSize              初始堆大小（与Xms一样）

-XX:MaxHeapSize                  最大堆大小（与Xmx一样）

-Xss                             每个线程的堆栈大小

-XX:+HeapDumpOnOutOfMemoryError  JVM发送OOM时，自动生成Dump文件（内存快照）

-XX:HeapDumpPath=$1_dump.hprof   Dump文件路径

-XX:+PrintGCDetails              打印GC日志

-XX:+PrintGCDateStamps           打印GC日志时间

-Xloggc:$1_gc_trace.log          GC日志路径

##### JVM启动参数

可以通过“java -Dxxx=xxx"设置JVM启动参数。示例：
```bash
java -Dname=Joe -version 
```

启动参数分为三类：
* 标准参数（-）：所有JVM必须实现，向后兼容；
    * -version
    * -classpath
    * -server
    * ...
  > 可以通过在cmd中输入 “java -help” 查看有哪些标准参数
* 非标准参数（-X）：默认JVM有实现，但其他JVM不一定实现，不一定向后兼容；
    * -Xmn
    * -Xmx
    * -Xloggc:<filename>
  > 可以通过在cmd中输入 “java -X” 查看有哪些非标准参数
* 非Stable参数（-XX）

##### 类加载过程
类加载过程
1. 查找.class文件
* Bootstrap ClassLoader 从JAVA_HOME/lib根据全类名查
* ExtClassLoader（继承Classloader） 从JAVA_HOME/lib/ext根据全类名查
* AppClassLoader（继承ExtClassLoader） 从项目Classpath根据全类名查
2. 解析.class(二进制)，将.class的信息保存在方法区
3. 生成一个Class对象，保存在对象实例池
4. 在方法区，为类的静态变量分配空间（赋默认值：0,null,0L,false）
5. 初始化执行，顺序如下：
    * 静态变量、静态代码块（先执行父类，若在同一个类，则按顺序执行）
    * 成员变量、成员代码块（先执行父类，若在同一个类，则按顺序执行）
    * 构造器（先执行父类，若在同一个类，则按顺序执行）



### JVM调优操作
参考：[https://blog.csdn.net/weixin_43238110/article/details/93793357](https://blog.csdn.net/weixin_43238110/article/details/93793357)

**调优的目的**
1. 尽量减少Full GC的频率


**调优手段**
1. 配置更多/更少的内存给JVM（配置Xmx）
2. 若经常发生FullGC，则可以配置更大的老年代内存（配置XX:NewRatio，老年代越大，新生代Gc越频繁，但Full GC频率越少）
3. 线程堆栈的设置（默认为1M，可设置位256K）


**查看JVM参数**

查看默认参数：（初始堆大小、最大堆大小、使用哪种垃圾回收器、JVM版本等）
```bash
java -XX:+PrintCommandLineFlags -version
```

查看所有参数：
```bash
#方法1
java -XX:+PrintFlagsFinal -version

#方法2
jinfo -flags [pid]
```


查看某个JVM参数：
```bash
#查看所有包含GC字段的JVM参数
java -XX:+PrintFlagsFinal -version|grep GC

#查看所有包含Size字段的JVM参数
java -XX:+PrintFlagsFinal -version|grep Size


```



**查看JVM情况**

jmap -heap pid：输出堆内存设置和使用情况（JDK11使用jhsdb jmap --heap --pid pid）

jmap -histo pid：输出所有实例对象在堆中的占比


查看内存使用情况、GC情况：

```bash
> jstat -gc [pid]

S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT
28672.0 28672.0 15921.7  0.0   29696.0   2233.7   65536.0    47813.5   57856.0 54674.3 8960.0 7947.5     40    0.114   4      0.166    0.279
```

|S0C  |  S1C  |  S0U  |  S1U   |   EC    |   EU  |      OC    |     OU   |    MC  |   MU |   CCSC |  CCSU  | YGC |    YGCT  |  FGC  |  FGCT |    GCT|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|Suvivor0区容量|Suvivor1区容量|Suvivor0区使用量|Suvivor1区使用量|Eden区容量|Eden区使用量|Old区容量|Old区使用量|Metaspace容量|Metaspace使用量|压缩类空间大小|压缩类空间使用率|Young GC次数|Young GC时间|Old GC次数|Old GC时间|总GC时间|
|28672.0 |28672.0 |15921.7  |0.0   |29696.0  | 2233.7   |65536.0    |47813.5   |57856.0 |54674.3 |8960.0 |7947.5     |40    |0.114   |4      |0.166    |0.279|


查看内存使用率：

```bash
> jstat -gcutil [pid]

  S0     S1     E      O      M     CCS    YGC     YGCT    FGC    FGCT     GCT
  0.00  98.78  15.75  75.47  94.12  88.70     83    0.192     4    0.166    0.357
```

|  S0  |   S1   |  E   |   O  |    M  |   CCS  |  YGC   |  YGCT  |  FGC  |  FGCT  |   GCT |
|---|---|---|---|---|---|---|---|---|---|---|
|Suvivor0使用率|Suvivor1使用率|Eden使用率|Old使用率|Metaspace使用率|压缩类空间使用率|Young GC次数|Young GC时间|Old GC次数|Old GC时间|总GC时间|
|  0.00  |98.78  |15.75 | 75.47  |94.12 | 88.70   |  83  |  0.192  |   4  |  0.166  |  0.357|


**查看DUMP文件**
1. 主动型
* 首先通过top命令获取到jvm的pid
* 使用jmap命令生成dump文件
```bash
#test.dump为dump文件名，1246为jvm的pid，这些都根据实际情况来传参
jmap -dump:format=b,file=test.dump 1246
```
* 进入java/bin目录下，打开jvisualvm工具。选择 文件->装入，将文件类型改为堆Dump，选择test.dump文件即可。
* 也可以选择jprofile工具（需要下载）

2. 被动型
* 当JVM内存溢出时，会自动生成dump文件。（需要-XX:+HeapDumpOnOutOfMemoryError该参数打开）
```bash
#查看dump文件生成位置
java -XX:+PrintFlagsInitial | findstr HeapDumpPath
```
* 取到dump文件后，通过jvisualvm工具分析即可。


**查看GC情况**
```bash
#设置打印GC日志
-XX:+PrintGCDetails
#设置打印GC日志时间
-XX:+PrintGCTimeStamps
#设置GC日志文件位置（输出到gc.log）
-Xloggc:gc.log
```

触发GC后，便会看到日志中有类似如下内容：
```bash
#日志开头，是JVM的启动参数
CommandLine flags: -XX:InitialHeapSize=10485760 -XX:MaxHeapSize=10485760 -XX:MaxNewSize=5242880 -XX:NewSize=5242880 -XX:OldPLABSize=16 
-XX:PretenureSizeThreshold=10485760 -XX:+PrintGC -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:SurvivorRatio=8 -XX:+UseCompressedClassPointers 
-XX:+UseCompressedOops -XX:+UseConcMarkSweepGC -XX:-UseLargePagesIndividualAllocation -XX:+UseParNewGC

#在JVM启动后的0.383秒，发生了第一次GC，原因是Allocation Failure，即给对象分配内存时内存不足
#此时使用了ParNew收集器进行young GC
#gc后，新生代占用内存由 3543K 变为 512K，新生代总内存为4608K；
#gc后，堆占用内存由 3543K 变为 1828K，堆总内存为9728K；
0.383: [GC (Allocation Failure) 0.384: [ParNew: 3543K->512K(4608K), 0.0024598 secs] 3543K->1828K(9728K), 0.0026607 secs] [Times: user=0.00 sys=0.00, real=0.00 secs]
#又一次GC
#gc后，新生代占用内存由 2627K 变为 0K，新生代总内存为4608K；
#gc后，堆占用内存由 3943K 变为 1828K，堆总内存为9728K；
0.386: [GC (Allocation Failure) 0.387: [ParNew: 2627K->0K(4608K), 0.0015255 secs] 3943K->1828K(9728K), 0.0015985 secs] [Times: user=0.00 sys=0.00, real=0.00 secs]

#堆内存使用快照
Heap
 par new generation   total 4608K, used 2089K [0x00000000ff600000, 0x00000000ffb00000, 0x00000000ffb00000)
  eden space 4096K,  51% used [0x00000000ff600000, 0x00000000ff80a558, 0x00000000ffa00000)
  from space 512K,   0% used [0x00000000ffa00000, 0x00000000ffa00000, 0x00000000ffa80000)
  to   space 512K,   0% used [0x00000000ffa80000, 0x00000000ffa80000, 0x00000000ffb00000)
 concurrent mark-sweep generation total 5120K, used 1828K [0x00000000ffb00000, 0x0000000100000000, 0x0000000100000000)
 Metaspace       used 3101K, capacity 4620K, committed 4864K, reserved 1056768K
  class space    used 327K, capacity 392K, committed 512K, reserved 1048576K
```


**查看当前启用的垃圾回收器类型**
```bash
#查看所有JVM参数
java -XX:+PrintFlagsInitial

#查看当前使用的垃圾回收器
java -XX:+PrintCommandLineFlags -version

#查看垃圾回收器启用情况
java -XX:+PrintFlagsInitial|findstr Use.*GC
```