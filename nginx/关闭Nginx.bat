@echo off
tasklist|find /i "nginx.exe" > NUL
if %errorlevel%==0 (
	%cd%/nginx -s quit
	echo Service Closed...
) else (
    echo Service is not running...	
)

pause