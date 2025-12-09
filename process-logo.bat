@echo off
chcp 65001 >nul
echo 处理logo图片去除白边...

python process-logo.py

if %errorlevel% neq 0 (
    echo.
    echo 如果Python未安装PIL，请运行:
    echo pip install Pillow numpy
    pause
)

