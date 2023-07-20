# 国内访问Github加速的方法

## 访问官网慢

【方法1】获取github的ip地址，手动写到hosts文件里  
1. hosts文件下载：<https://raw.hellogithub.com/hosts>  

> 链接下载的hosts内容会定时更新

2. 将内容追加到本机的hosts文件里。
本机host文件在：
   Windows系统：修改C:\Windows\System32\drivers\etc\hosts文件
   Linux系统：修改C:\Windows\System32\drivers\etc\hosts文件
3. 刷新网络  
```shell
# 网络刷新
ipconfig /flushdns
```


> 想要自动更新，可以使用SwitchHosts工具：<https://github.com/oldj/SwitchHosts>