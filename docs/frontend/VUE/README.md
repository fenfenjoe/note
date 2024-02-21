---
title: VUE笔记
---


# VUE笔记

## 参考资料
[VUE官方文档(https://cn.vuejs.org/)](https://cn.vuejs.org/)   



## 笔记

### 关于 javascript的 import、export、require

CommonJS 规范下：

【导出模块】
```javascript
const myModule = {
   myFunction: function() {
       console.log('This is my function');
   },
   myVariable: 'This is my variable'
};

module.exports = myModule;
```

【导入模块】  
```javascript
// 导入模块
   const importedModule = require('./myModule');

   // 使用导入的模块
   importedModule.myFunction(); // 输出 'This is my function'
   console.log(importedModule.myVariable); // 输出 'This is my variable'
```


ES6规范下：  

【导出模块】  
```javascript
// 导出模块
const myFunction = () => {
   console.log('This is my function');
};

const myVariable = 'This is my variable';

export { myFunction, myVariable };
```


【导入模块】  
```javascript 
// 导入模块
import { myFunction, myVariable } from './myModule.js';

// 使用导入的模块
myFunction(); // 输出 'This is my function'
console.log(myVariable); // 输出 'This is my variable'
```

> **注意！** 用CommonJS规范导出的模块，可以用ES6规范进行导入；同样，用ES6规范导出的模块，也可以用CommonJS规范进行导入

### var、let、const的区别

var用于声明变量，且具有”变量提升“的特性，因而不推荐使用。

> 什么是变量提升？

let、const是ES6后新增的关键字。

let负责声明变量；const负责声明常量。  

const声明的常量只可读，不可被修改。定义时必须初始化。