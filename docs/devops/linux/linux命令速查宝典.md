---
title: Linux运维速查宝典
---


# Linux运维速查宝典

### 常用命令
#### PS ：查看当前进程状态
```
ps aux|grep ktin 
//查看包含"ktin"字眼的进程的信息，其中第2列为PID

ps -ef|grep srm-esb-*
//查看以srm-esb-开头的进程的信息
```
#### DF：查看磁盘占用情况
df -h

#### TOP ：查看负载、查看内存使用情况、查看进程

示例：
```
# 该行跟命令uptime显示的内容相同。
# up 2 days：已使用2天
# 3 users：有3个当前用户
# load average：1分钟内、10分钟内、15分钟内系统的平均负载。
#
top - 16:14:33 up 2 days, 4:27, 3 users, load average: 0.00, 0.01, 0.02

Tasks: 199 total, 1 running, 198 sleeping, 0 stopped, 0 zombie

%Cpu(s): 0.0 us, 0.2 sy, 0.0 ni, 99.8 id, 0.0 wa, 0.0 hi, 0.0 si, 0.0 st

MiB Mem : 5959.4 total, 3277.3 free, 776.4 used, 1905.8 buff/cache

MiB Swap: 2048.0 total, 2048.0 free, 0.0 used. 4878.4 avail Mem

 

# PID — 进程id
# USER — 进程所有者
# PR — 进程优先级
# NI — nice值。负值表示高优先级，正值表示低优先级
# VIRT — 进程使用的虚拟内存总量，单位kb。VIRT=SWAP+RES
# RES — 进程使用的、未被换出的物理内存大小，单位kb。RES=CODE+DATASHR — 共享内存大小，单位kb
# S —进程状态。D=不可中断的睡眠状态 R=运行 S=睡眠 T=跟踪/停止 Z=僵尸进程
# %CPU — 上次更新到现在的CPU时间占用百分比
# %MEM — 进程使用的物理内存百分比
# TIME+ — 进程使用的CPU时间总计，单位1/100秒
# COMMAND — 进程名称（命令名/命令行）

  PID USER PR NI VIRT RES SHR S %CPU %MEM TIME+ COMMAND

23026 alvin 20 0 46340 7820 6504 S 0.0 0.1 0:00.05 systemd

23033 alvin 20 0 149660 3140 72 S 0.0 0.1 0:00.00 (sd-pam)

23125 alvin 20 0 63396 5100 4092 S 0.0 0.1 0:00.00 sshd

23128 alvin 20 0 16836 5636 4284 S 0.0 0.1 0:00.03 zsh
```

#### NETSTAT：查看端口占用情况
```
#查看某个端口
lsof -i:8080

#查看所有端口
netstat -tunlp
```

#### FIND：文件查找

默认从当前目录查找；查找时默认包括子目录；

1.按文件名查找  
find test.txt  
--在当前目录下查找test.txt文件  
find / -name httpd.conf  
--在根目录下查找文件httpd.conf  
find /etc -name '\*httpd\*'  
--在etc目录下查找名字含有"httpd"的文件

2.**查询大文件**  
find . -type f -size +500M  
--找出目录下（包括子目录）所有大小大于500M的文件

#### CURL：文件上传、下载

#### VIM：文本编辑

***i*** #进入编辑模式  
编辑模式下：  
***ESC*** #退出编辑模式  
***x***         #删除后面的字符  
***X***          #删除前面的字符  
***u***          #回滚

非编辑模式下：  
***:wq*** #保存并退出  
***:q!***   #直接退出不保存  
***:w [filename]*** #另存为  
***/ [关键字]***        #查找关键字（然后输入n搜索下一个）  
***Ctrl+F***  #下一页  
***Ctrl+B***  #上一页


#### HOSTNAMECTL：查看Linux发行版本
#### GREP：全文检索
grep --help   
查看帮助

grep -lr 'string' /etc/  
-l: 找出含有该字符串的文件  
-r: 同时从子目录查找  
-i: 忽略大小写

#### SOURCE:执行某段shell脚本
假设有以下shell脚本：
```bash
# test.sh
echo 'hello world'
```
可通过source命令执行该脚本。
```bash
source ./test.sh
```
#### SUDO：以管理员身份运行命令
```bash
sudo vim /usr/bin/yum
```
#### 文件操作：touch、rm、mkdir、vim、cp、mv

touch <filename>   
创建文件

mkdir <uriname>  
创建目录

rm -f <filename>  
强行删除文件或目录（不包括子目录）

rm -rf <filename>  
强行删除文件或目录（包括子目录）

cp <source> <target>  
拷贝文件

cp -r <source> <target>  
拷贝目录

mv <source> <target>  
移动文件/文件重命名


#### 在后台运行脚本：nohup

nohup 英文全称 no hang up（不挂起），用于在系统后台不挂断地运行命令，退出终端不会影响程序的运行。  
nohup 命令，在默认情况下（非重定向时），会输出一个名叫 nohup.out 的文件到当前目录下，如果当前目录的 nohup.out 文件不可写，输出重定向到 $HOME/nohup.out 文件中。

```shell
#【错误用法】后面没有带上 &
nohup pwd 
#nohup.out文件内容：nohup: ignoring input


#打印当前路径到nohup.out
nohup pwd &
#nohup.out文件内容：/apps/svr

#在后台运行Test.jar，生成日志文件Test_2022-01-01.log并打印日志到里面（终端里仍会看到日志）
nohup java -jar Test.jar > Test_$(date +%Y-%m-%d).log &

#在后台运行test.sh，生成日志文件out.txt并打印日志到里面（终端不会看到日志）
nohup ./test.sh > out.txt 2>&1 &
```

#### yum、rpm、apt-get：下载、安装、卸载软件

**Debian系：（Debian, Ubuntu, Xandros, Linspire）**

下载并安装：apt-get install [package-name]
```bash
#同步/etc/apt/sources.list中最新安装包的来源（docker容器一般需要先执行该命令，然后再install）
apt-get update
#安装ifconfig、netstat命令
apt-get install net-tools
#安装ping命令
apt-get install iproute2
#安装telnet命令
apt-get install telnet
```


**RedHat系：（Fedora, CentOS, Red Hat Enterprise Linux, OpenSUSE, Mandriva, PCLinuxOS）**

没有安装yum的情况下：
```bash
#查看所有已安装的软件
rpm -qa
#查看某个软件是否有安装
rpm -qa|grep [软件名（模糊搜索）]
#卸载某个软件
rpm -e [软件名]
#强制卸载某个软件
rpm -e --nodeps [软件名]
```

使用yum：
```bash
#查看是否有安装yum包
rpm -qa|grep yum
#升级系统的所有软件以及系统内核
yum update
#查看仓库中某个package的所有版本
yum list [package-name] --showduplicates | sort -r
#下载并安装
yum install [package-name]
```
#### ROUTE：查看Linux的路由表
```bash
[root@VM_139_74_centos ~]# route
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
default         gateway         0.0.0.0         UG    0      0        0 eth0
10.0.0.10       10.139.128.1    255.255.255.255 UGH   0      0        0 eth0
10.139.128.0    0.0.0.0         255.255.224.0   U     0      0        0 eth0
link-local      0.0.0.0         255.255.0.0     U     1002   0        0 eth0
172.17.0.0      0.0.0.0         255.255.0.0     U     0      0        0 docker0
172.18.0.0      0.0.0.0         255.255.0.0     U     0      0        0 br-0ab63c131848
172.19.0.0      0.0.0.0         255.255.0.0     U     0      0        0 br-bccbfb788da0
172.20.0.0      0.0.0.0         255.255.0.0     U     0      0        0 br-7485db25f958
```

#### firewalld：防火墙操作

firewall-cmd --version

#### ENV：查看环境变量
```bash
#显示所有环境变量
$ env
#查看某个环境变量
$ env |grep JAVA_HOME
#查看某个环境变量
$ echo $JAVA_HOME
```

#### CAT:文件内容检索、修改
```bash
#查看text.txt的所有内容
cat text.txt 

#显示行数
cat -n text.txt

#查看所有内容，通过翻页由上到下
#(空格：下一页  Ctrl+C 或者q：退出  Enter：下一行)
cat text.txt | more

#查看所有内容，通过翻页由上到下
#(空格：下一页  q：退出   上下箭头：下一行)
cat text.txt | less



#查看有“异常”两字的行的后100行
cat text.txt |grep '异常'-A 100 

#查看有“异常”两字的行的前100行
cat text.txt |grep '异常'-B 100

#查看有“异常”两字的行的前、后100行
cat text.txt |grep '异常'-C 100

#从第100行开始，翻页向下查看
cat -n text.txt|tail -n +100|more


```

#### LESS:滚动查看文件
```bash
#进入并查看文件
LESS text.txt

查看文件后，若文件过大，打通过以下命令滚动文件：
j    下一行
k    上一行
f    向下滚动一屏幕
b    向上滚动一屏幕
g    定位到文档头部
G    定位到文档最尾部
q    退出less模式


```

#### TAIL:查看日志
```bash
#滚动式查看日志
tail -f ./2022-10-10.log

#显示日志文件最末尾的200行内容
tail -n 200 ./2022-10-10.log

#滚动式查看日志，并且只查看有'ERROR'字符串的行
tail -f ./2022-10-10.log | grep 'ERROR'
```

### Linux文件系统结构
***/*** ：根目录  
***/usr/bin*** ：系统安装的可执行程序（如ping、ls、man等）  
***/usr/local*** ：用户级应用（如TOMCAT、MYSQL），类比C:/Progrem Files/  
***/usr/lib*** ：可执行程序的共享库（如JAVA、PYTHON），类比C:/Windows/System32  
***/opt*** ：临时上传到Linux里的软件，类别D:/Sotfware/  
***/etc*** ：系统的配置文件（包括host文件）


### Shell脚本语法

```shell
#!/bin/bash
#指此脚本使用/bin/bash来解释执行
#脚本解析器除了bash，还有sh、ksh、tsh...
#不写则脚本会默认当前用户登录的shell，为脚本解释器

#打印语句
echo "hello world!" #打印hello world

#打印当前时间
echo "$(date)"
echo "$(date+%F)" #格式化显示年月日(yyyy-MM-dd)
echo "$(date+%Y/%m/%d)" #格式化显示年月日(yyyy/MM/dd)
echo "$(date +%H:%M:%S)" #格式化显示时分秒(hh:mm:ss)

#定义一个参数并打印
myname="jack"
echo "hello $myname!"

#条件语句
if["$myname"!=""];then
  echo "hello $myname!"
fi

#执行命令并返回结果
pids = `ps -ef|grep springboot-*|grep -v grep|awk '{print $2}'` #查询名字带"springboot"的进程id

#执行命令并打印结果
echo `ps -ef|grep springboot-*|grep -v grep|awk '{print $2}'`
echo `pwd` #显示当前目录的路径



```

### 查看系统配置


```
#CPU个数、核数
lscpu

#CPU核数、进程数
cat /proc/cpuinfo

#内存情况
free -m

#磁盘总量
df -h

#linux发行版本
cat /etc/redhat-release

#linux内核版本
uname -a

```

