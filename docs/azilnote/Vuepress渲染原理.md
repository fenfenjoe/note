---
title: Vuepress渲染原理
---


# Vuepress渲染原理

你写的markdown -> ``` # 这是一个标题 ```

渲染成html -> ``` <h1> 这是一个标题 </h1>```

再将html内容交给vue编译器解析 -> ``` <h1> 这是一个标题 </h1> ```

> 因此，如果你在markdown中添加vue组件，只要直接写进去就可以了。  
> 比如 ``` # 这是一个标题 <MyComponent/> ```  
> 这样到vue解析就会将MyComponent组件解析成html。  

然后解析成最终的html内容展示 -> ``` <h1> 这是一个标题 </h1> ```

