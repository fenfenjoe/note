---
title: JAVA8实战
sidebar: 'auto'
sidebarDepth: 2
---

# JAVA8实战


## 参考资料

《JAVA8实战》



## Lambda表达式

用来替代“匿名内部类”。

```java
//比如以下场景：需要你定义一个TreeSet，并传入一个自定义的Comparator用于排序
//在Lambda表达式出现之前，自定义的Comparator一般用匿名内部类来定义

//旧的写法：定义一个匿名内部类
Comparator<String> comparator= new Comparator<String>(){
    public int compare(String o1,String o2){
        return o1>o2;
    }
}

TreeSet<String> set = new TreeSet<String>(comparator);


//Java1.8后的写法：使用Lambda表达式
Comparator<String> comparator = (x,y)-> x>y;

TreeSet<String> set = new TreeSet<String>(comparator);



```

### 什么是Lambda表达式

上面的 (x,y)-> x>y 就是一个Lambda表达式，它返回了一个Comparator接口的实现对象，并实现了它的compare方法。



(x,y) 对应compare方法的两个入参；

-> 是Lambda操作符，表明这是一个Lambda表达式；

x>y 对应compare方法的方法体;



使用Lambda的方便之处：

* 不用新建一个匿名内部类

* 不用写方法名（compare）

* 不用写入参的类型（String）：编译器会对入参做“类型推断”

* 单条语句时可以不用写大括号、return



> 注意，使用Lambda表达式的前提，就是它只能返回像Comparator接口一样，只有一个抽象方法的接口的实现对象。
>
> 这种只有一个抽象方法的接口也称为【函数式接口】，函数式接口一般都通过@FunctionalInterface注解来修饰。
>
> 函数式接口有例如：Runnable、Callable、Comparator、Consumer、Supplier
>
> Java8内置的四大函数式接口：
>
> ```java
> Consumer<T>  void consumer(T t);//消费型接口（有入参，无出参）
> Supplier<T> T get();//生产型接口（无入参，有出参）
> Function<T,R> R apply(T t); //函数型接口（有一个入参，有一个出参）
> Predicate<T> boolean test(T t);//断言型接口（有一个入参，出参为boolean值）
> ```
>
> 还有一些拓展的函数式接口：
>
> BiPredicate<T,U>：两个入参，出参为boolean
>
> BiFuction<T,U,V>：两个入参，有一个出参
>
> ...





还有以下的一些情况：

1. 无入参

```java
Runnable runnable = () -> System.out.println("haha"); 
```



2. 有入参，方法体只有一条语句

```java
//方法体只有一条语句，则可以省略return和大括号
Comparator<String> comparator = (x,y)-> x>y;

Consumer<String> consumer = (x)->System.out.println(x);
//也可以省略括号
Consumer<String> consumer2 = x->System.out.println(x);
```



3.方法体有多条语句，则需要加大括号

```java
Comparator<String> comparator = (x,y)-> {
    System.out.println("x:"+x+"y:"+y);
    return x>y;
}
```



### Lambda表达式的应用

> 拓展： Lambda表达式可应用于策略模式。
>
> 【策略模式】就是将你需要的策略定义成一个接口（只有一个方法的接口），这样通过不同的实现类去达到不同的策略。
>
> 例如有1w个员工，需要根据某种策略，选出一部分员工进行颁奖。
>
> 我们就定义一个Filter接口，对应策略这个概念；
>
> 筛选时（filterList方法），具体要用什么策略，我们可以通过入参（Lambda表达式）去实现该接口。

```java
public interface Filter<T> {
    public boolean filter(T object);
}
//入参传入一个接口的对象
public List filterList(List list,Filter filter){
    List<User> resultList;
    for(User user:userList){
        if(filter.filter(user)){
            resultList.add(user);
        }
    }
    return resultList;
}
public void test(){
    List<User> userList;
    //过滤出30岁以上的人
    //通过Lambda表达式传入接口的实现对象
    List<User> result1List = filterList(userList, (user) -> user.getAge()>30 );

    //过滤出40岁以上的人
    //通过Lambda表达式传入接口的实现对象
     List<User> result2List = filterList(userList, (user) -> user.getAge()>40 );
}
```

### 方法引用

通过上面的介绍，我们知道了Lambda表达式实际就是一个方便开发者创建一个【函数式接口】的实现对象的语法糖。

而写Lambda表达式跟写函数很像，有方法头、方法体，只不过Lambda表达式比较方便，可以在某些时候省略函数定义时的一些内容（入参类型、return关键字、大括号等等）。

而方法引用提供了一种“更省”的方式，去写Lambda表达式。

**语法1**

```java
//Lambda表达式（不用方法引用）
Consumer<String> consumer = (str) -> System.out.println(str);

//使用方法引用
Consumer<String> consumer = System.out::println;
```

> 注意，只有当【函数式接口】的方法的函数入参和出参，与【方法引用】对应的函数的入参和出参类型、个数相同，才可以使用方法引用。对于上面的Consumer：
>
> 【函数式接口的方法】 void consume(T t)
>
> 【方法引用对应的方法】void System.out.println(String str)
>
> 两者的入参、出参一致，因此可以用方法引用。

**语法2**

```java
 BiPredicate<String,String> bp = (x,y) -> x.equals(y);

 BiPredicate<String,String> bp = String::equals;
```

### 构造器引用

```java
//Lambda表达式（不用构造器引用）
Supplier<Employee> sup = ()-> new Employee();
Employee emp = sup.get();
//使用构造器引用（无参）
Supplier<Employee> sup2 = Employee::new;
Employee emp2 = sup2.get();
```



## Stream API

上面的例子1，通过Stream API有更简捷的写法：

```java
//无需定义Filter接口，即可实现
List<User> userList;
//过滤出30岁以上的人并打印出来
userList.stream().filter((user) -> user.getAge()>30)
    .forEach(System.out::println);
//过滤出40岁以上的人并打印出来
userList.stream().filter((user) -> user.getAge()>40)
    .forEach(System.out::println);

```

#### Stream API是干什么的

提供了一种高效、方便的处理集合数据的方式。（如何体现方便？）

* 语法类似SQL，配合lambda表达式，不用频繁for、while等遍历语句
* 提供了集合平时需要的数据过滤、map转list等操作的函数实现（也称为Stream操作）

#### Stream API有什么特性

* 对数据过滤、map转list等，不会影响原来的数据源（返回的对象是新的对象）
* Stream操作是延迟执行的，即等到需要结果时（执行终止操作）才执行
* 步骤分为：获取Stream、中间操作、终止操作

#### 创建、获取Stream对象的方法

```java

//1. 数据源是集合类（Collection）
List list = new Arraylist();
Stream<> stream = list.stream();
stream = list.parallelStream();//并行流

//2. 数据源是数组创建（Object[]）
Object[] objs = {"a","b"};
Stream<> stream = Arrays.stream(objs);
//3. 数据源是多个值（"a","b","c"...）
Stream<> stream = Stream.of("a","b","c")
//4. 无数据源
Stream<> stream = Stream.iterate(Object seed,UnaryFunction function) //有入参
Stream<> stream = Stream.generate(Consumer action) //无入参
```

无数据源Stream用法是，只要提供一个初始对象（种子），就可以根据它生成一个无限流

无数据源示例：（获取所有正复数）
```java
Stream<Integerstream4 = Stream.iterate(0, (x) -> x+2); //0是种子，表示从0开始
stream4.forEach(System.out::println);
//执行后控制台打印：0,2,4,6,8,10......一直打印下去
//如果想返回前10个复数，也可以：
stream4.limit(10).forEach(System.out::println);
```


#### 中间操作（操作完返回的还是Stream）

* 筛选与切片
    * filter：接收Lambda，从流中排除某些元素
    * limit：截断流，返回不超过某个数量的元素
    * skip：忽略前n个元素
    * distinct：去重，通过元素的hashcode() 和 equals()进行

```java
//示例
```



* 映射（重要）
    * map：对流中的所有元素都执行某个操作，然后返回一个新流
    * flatMap：对流中的所有元素都执行某个操作，然后返回一个新流

```java
//map和flatMap的区别：
//map():针对元素中非集合的字段（如下面的name）
//flatMap():针对元素中的集合字段（如下面的nickNames）
class Student{
    String name;
    List<String> nickNames;
}
//定义一个元素Student的List
List<Student> list =new ArrayList();
List<String> names = list.stream().flatMap(Student::getNickNames).collect(Collectors.toList());


//示例

//需求：打印List中所有员工的名字（比如有员工：[{employee:"张三"}，{employee:"李四”}，{employee:"陈五”}]）
//map:先获取所有员工的名字，组成一个新流
//forEach:终止操作，对所有员工名字组成的新流遍历，打印出来。
list.stream().map(Employee::getName) //map将 员工流（实体） 转换成 名字流（字符串） ["张三"，"李四"，“陈五]
    .forEach(System.out::println); //对名字流进行打印
/**
*结果：
*张三
*李四
*王五
**/

//打印List中的所有员工的名字，每行一个字
//用map的结果：
list.stream()
  .map((e) -> {
   List<Character> charList = e.getTenantCode().chars()
       .mapToObj(i -> (char)i).collect(Collectors.toList()); //将名字转换成单字List
    return Stream.of(charList); //最终返回流：[["张","三"],["李","四"],["王","五"]]
}).forEach(
    (e) -> e.forEach(System.out::println)
   );
/**
*结果：
*[张,三]
*[李,四]
*[王,五]
**/

//这里应该要用flatmap：
list.stream()
  .flatmap((e) -> {
   List<Character> charList = e.getTenantCode().chars()
       .mapToObj(i -> (char)i).collect(Collectors.toList()); //将名字转换成单字List
    return Stream.of(charList); //最终返回流：["张","三","李","四","王","五"]
}).forEach(
    (e) -> e.forEach(System.out::println)
   );
/**
*结果：
*张
*三
*李
*四
*王
*五
**/
```

* 排序
    * sorted()：自然排序（Comparable）
    * sorted(Comparator c)：定制排序

  ```java
  //使用示例
  
  /**
  *自然排序：
  *集合中的元素必须实现Comparable接口；
  *根据元素的compareTo()方法进行排序；
  **/
  List newList = whouseItemReqDTOList.stream().sorted();
  
  /**
  *自定义排序：
  *先按WhouseType排序（默认升序，即1,2,3...，由小到大）
  *再按CartQuanlity排序（倒序，即由大到小）
  **/
  List newList = whouseItemReqDTOList.stream()
                  .sorted(Comparator.comparing(AddCartWhouseItemReqDTO::getWhouseType)
                  .thenComparing(AddCartWhouseItemReqDTO::getCartQuanlity
                      ,Comparator.reverseOrder()))
                  .collect(Collectors.toList());
  ```



#### 终止操作（操作完返回最终结果）

* void **forEach**：对流中所有元素进行操作
* 查找与匹配
    * boolean **allMatch**：流中是否所有元素都满足某个条件
    * boolean **anyMatch**：流中是否至少有一个元素满足某个条件
    * boolean **noneMatch**：流中是否没有元素满足某个条件
    * Optional **findFirst**：返回流中第一个满足条件的元素
    * Optional **findAny**：返回流中任意一个满足条件的元素
    * Long **count** ：返回流中元素的个数
    * Optional **max**（Comparator c）：返回流中最大值
    * Optional **min**（Comparator c）：返回流中最小值
* 归约
    * T **reduce**(T t,BinaryOperator o)：将元素T反复结合起来，最后得到一个T（常见场景，求和）

> 冷知识，看以下示例：
>
> Integer salarySum = list.map(Employee::getSalary).reduce(0 , (x,y) -> x=x+y));
>
> 通过map、reduce方法，从员工数组中查出所有员工的工资总额。
>
> map和reduce的一起使用通常都被称为map-reduce模式，在大数据中非常常见。
>
> 例如Hadoop的底层数据处理框架就叫**MapReduce**。

* 收集
    * Collection **collect**(Collector c)：将流中的元素以集合的形式返回（List、Map、Set）；统计；分组；（功能强大！）

```java
//重要！需要留意Collectors的用法

//返回名字List
List<String> nameList = list.stream().map(Employee::getName).collect(Collectors.toList()); 

//返回名字Set
Set<String> nameList = list.stream().map(Employee::getName).collect(Collectors.toSet()); 

//返回Map
Map<String,MrpAllocationItemDetailRespDTO> map =
    	list.stream().collect(Collectors.toMap(
                MrpAllocationItemDetailRespDTO::getBillItemNo,dto->dto))

//返回自定义的Collection（比如需要linkedlist、linkedhashmap等等）
LinkedList<String> nameList = list.stream().map(Employee::getName).collect(Collectors.toCollection(LinkedList::new)); 

//返回元素的总数
Long count = list.stream().map(Employee::getName).collect(Collectors.counting());

//平均值、总和、最大值、最小值...

//分组
Map<String,List<Employee>> map = list.stream().collect(Collectors.groupingBy(Employee:getStatus));

//多级分组
Map<String,Map<String,Employee>> map = list.stream().collect(
    Collectors.groupingBy(Employee:getStatus,Collectors.groupingBy( (e)-> {
        if(e.getAge()<20){
            return "青年";
        }else{
             return "老年";
        }
    })));

//分区（感觉跟分组一样...）
Map<String,List<Employee>> map = list.stream().collect(Collectors.partitioningBy(Employee:getStatus));

//员工名字数组转字符串，加分隔符
String names = list.stream().map(Employee::getName).collect(Collector.joining(","));
```



### Optional

官方：提供更优雅的判断、处理空指针异常的API。

说人话：

* 通过Optional API，不用再写 if(object==null)的代码或担心NPE（空指针异常）的出现。
* 当你的方法返回Optional，相当于提醒调用者，返回的T可能为空。
* 更容易对属性进行空判断，特别是含有多层List的那种对象（这点比较有实际性的意义！！！）

```java
/**
*【Optional的静态方法】
**/

//创建一个空的Optional对象
Optional<T> Optional.empty();

//创建一个非空的Optional对象（若t为null，则在调用of的时候会直接抛出空指针异常）
//相当于“必填”
Optional<T> Optional.of(T t);

//创建一个可接收空对象的Optional对象（若t为null，不会抛出空指针异常）
//相当于“非必填”
Optional<T> Optional.ofNullable(T t);


/**
*【Optional的对象方法】
**/

//判断optional中的T对象是否null
boolean optional.isPresent();

//获取T对象，若T为null，则抛出noSuchElementException
T optional.get();

//若T为null，则给个默认值t2
T optional.orElse(T t2);

//若T为null，则通过方法生成个默认值。如 optional.ofNullable(t).orElseGet(()->"hahaha");
T optional.orElseGet(Supplier<? extends T> s);

//若T为null，则通过方法抛出一个异常。
T optional.orElseThrow(Supplier<? extends T> s);

//若T不为null，则执行某段代码。如optional.ifPresent(e->System.out.println(e));
void optional.ifPresent(Consumer<T> consumer);

/**
* 【配合Stream API的中间操作使用】
**/
//Optional还可以使用map、flatMap、filter这三种函数
//例如，按以下写法，不用写多层for循环，就可以对子属性判断空指针
//若a、a.b、a.b.c、a.b.c.d其中一个为空，都会返回null，而不会报空指针。
return Optional.ofNullable(a)
    		.map(A::getB)
    		.map(B::getC)
    		.map(C::getD)
    		.orElse(null);

```



### stream的常见使用场景

**对List进行分批操作**
```java
List<A> list; //需要分批操作的list
List<B> resultList; //结果list

int size = list.size();
int batchsize = 100; //每次操作100个
int opcount = size / batchsize +1 ; //需要操作多少次

List<List<B>> batchB = Stream.iterate(0, n -> n + 1)
.limit(opcount)
.parallel()
.map(i -> list.stream().skip(i * batchsize)
	          .limit(batchsize)
              .parallel()
              .map( a->{
                  B b = convert(a);
                  return b;
              })
	          .collect(Collectors.toList()))
.collect(Collectors.toList());

//将List<List<B>>转换为List<B>
resultList = batchB.stream().collect(ArrayList::new,List::addAll,List::addAll);
```