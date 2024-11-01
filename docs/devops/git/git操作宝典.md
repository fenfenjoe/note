---
title: git操作宝典
---

# git操作宝典


## 远程代码覆盖本地（reset）

```
git reset --hard origin/master
```

## 暂存本地的更改（stash）

```
#暂存
git stash
#恢复
git stash pop
```

## 撤销某次提交（revert）

原理是“反做”，即对那次提交修改过的所有文件，生成一个逆向的修改记录

```
# 撤销
git revert -n 版本号 
# 提交
git commit -m 版本名 
```


## 回退到某个版本（reset）

```
# 查看版本号
git log
# 回退到目标版本
git reset --hard 目标版本号
# 强制推送
git push -f 
```