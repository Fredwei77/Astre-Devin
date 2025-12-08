@echo off
chcp 65001 >nul
echo ========================================
echo JWT Secret 生成器
echo ========================================
echo.

echo 正在生成安全的 JWT Secret...
echo.

node generate-jwt-secret.js

if errorlevel 1 (
    echo.
    echo ❌ 生成失败
    echo.
    echo 备用方案 - 使用 PowerShell 生成：
    echo.
    powershell -Command "[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))"
    echo.
)

echo.
pause
