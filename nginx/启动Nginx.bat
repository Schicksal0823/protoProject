::关闭回显
@echo off
::先查看服务是否已经运行，如果已经运行，则先关闭再启动。
tasklist|find /i "nginx.exe" > NUL
::上一次执行结果是否成功
if %errorlevel%==0 (
	%cd%/nginx -s quit
	echo Service Closed...
)
start %cd%/nginx -c conf/nginx.conf
echo Service has been opened...

pause