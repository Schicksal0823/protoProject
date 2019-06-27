@echo off
::启动服务器
start node start.js

::启动代理服务器
cd "%~dp0nginx"
start nginx.exe
echo %~dp0nginx\nginx.exe
::打开主页
start chrome "%~dp0index.html"
echo OK
pause