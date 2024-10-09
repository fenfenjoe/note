# Nginx学习笔记

### 命令速查

修改nginx.conf后不停机重新加载配置：

```
nginx -s reload
```

### 目录结构
```
nginx
  /conf
    nginx.conf
  /html
    index.html
    50x.html
  /log
    nginx.pid
    error.log
    
```


### nginx的作用

#### 1. 反向代理：我们的系统部署在自己的局域网中，外部用户一般情况下无法访问我们的网络；
Nginx的反向代理等于开了一个“口子”，提供一个到多个端口，让外部用户能从nginx访问到局域网内的机器。

配置示例：
```
#nginx监听ip地址为192.168.134.105、端口为9001的请求
server {
    listen       9001;
    server_name  192.168.134.105;

    #若请求像 192.168.134.105:9001/edu/...   则将请求转发给8080端口
    location ~/edu/ {
        proxy_pass http://127.0.0.1:8080;
    }

    #若请求像 192.168.134.105:9001/vod/...   则将请求转发给8081端口
    location ~/vod/ {
        proxy_pass http://127.0.0.1:8081;
    }
}

```

#### 2. 负载均衡：nginx能将请求按照一定的策略，转发给其他的服务器去处理；当发现请求太多了，便可以添加服务器去处理；
转发策略有很多种：
* 轮询
* weight权重
* iphash
* fair（第三方）

配置示例（轮询）:
```
    #定义一个负载均衡器，会将进来的请求转发
    upstream myserver{
        server 192.168.134.105:8080;
        server 192.168.134.105:8081;
    }

    #用户发送请求至192.168.134.105:80/...时，请求会被转发到负载均衡器myserver上
    server {
        listen       80;
        server_name  192.168.134.105;
        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
          root   html; #会从本机中的/html中寻找资源
          index index.html index.htm; #配置默认首页(/html/index.html)
          proxy_pass http://myserver;
        }
	}

```

#### 3. 动静分离：将html、图片等资源文件放到nginx上，动态请求则转发给tomcat处理。

```
    
    #tomcat负载均衡器
    upstream tomcat{
        server 192.168.134.105:8080;
        server 192.168.134.105:8081;
    }

    #用户发送请求至192.168.134.105:80/...时，请求会被转发到负载均衡器myserver上
    server {
        listen       80;
        server_name  www.helloworld.com;

        #处理/**的请求
        location / {
          root   /data/html; #会从本机中的/data/html中寻找资源
          index index.html index.htm; #配置默认首页
        }

        #处理/image/**的请求
        location /image {
          root   /data; #会从本机中的/data/image中寻找资源
          autoindex on; #打开目录功能
        }

        #处理/back/**的请求
        location /back {
          proxy_pass http://tomcat; #转发给tomcat
        }
	}

```



### nginx.conf

更详细的配置见：[这里](https://gitee.com/fun_zil/dyz-docker-compose-temple/blob/master/docker/nginx/conf/nginx.conf)