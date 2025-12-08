@echo off
chcp 65001 >nul

echo ╔══════════════════════════════════════════════════════════════╗
echo ║            🚑 紧急切换到超级简化版本                       ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🎯 这个脚本将：
echo    1. 备份当前文件
echo    2. 切换到只有Express的超级简化版本
echo    3. 准备GitHub提交
echo    4. 测试Railway是否能成功部署基础服务
echo.

echo ⚠️ 这是诊断步骤，确定基础环境是否正常工作
echo.

pause

echo.
echo 🔄 开始切换...
echo.

REM 备份原始文件
if exist "server.js" (
    copy server.js server-original.js >nul
    echo ✅ server.js → server-original.js (已备份)
)

if exist "package.json" (
    copy package.json package-original.json >nul
    echo ✅ package.json → package-original.json (已备份)
)

REM 切换到超级简化版本
if exist "server-ultra-minimal.js" (
    copy server-ultra-minimal.js server.js >nul
    echo ✅ server.js (已替换为超级简化版本)
) else (
    echo ❌ server-ultra-minimal.js 文件不存在
    pause
    exit /b 1
)

if exist "package-ultra-minimal.json" (
    copy package-ultra-minimal.json package.json >nul
    echo ✅ package.json (已替换为超级简化版本)
) else (
    echo ❌ package-ultra-minimal.json 文件不存在
    pause
    exit /b 1
)

echo.
echo ✅ 文件切换完成！
echo.

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   📤 提交到GitHub                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 现在需要提交到GitHub触发Railway重新部署：
echo.

echo 执行以下命令：
echo.
echo git add .
echo git commit -m "Emergency fix: ultra minimal version for debugging"  
echo git push
echo.

echo 要现在自动执行这些Git命令吗？ (Y/N)
set /p auto_git=请选择: 

if /i "%auto_git%"=="Y" (
    echo.
    echo 🔄 执行Git命令...
    
    git add .
    if %errorlevel% neq 0 (
        echo ❌ git add 失败
        goto :manual_git
    )
    
    git commit -m "Emergency fix: ultra minimal version for debugging"
    if %errorlevel% neq 0 (
        echo ❌ git commit 失败
        goto :manual_git
    )
    
    git push
    if %errorlevel% neq 0 (
        echo ❌ git push 失败
        goto :manual_git
    )
    
    echo ✅ 代码已成功推送到GitHub!
    goto :wait_deploy
)

:manual_git
echo.
echo 📝 请手动执行以下命令：
echo.
echo    git add .
echo    git commit -m "Emergency fix: ultra minimal version for debugging"
echo    git push
echo.

:wait_deploy
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                 ⏳ 等待Railway重新部署                     ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📋 超级简化版本特点：
echo    • 只使用Express，无其他依赖
echo    • 无数据库连接
echo    • 无API密钥要求
echo    • 无复杂逻辑
echo    • 只提供基础的HTTP响应
echo.

echo 🎯 测试端点：
echo    • GET / → 基本信息
echo    • GET /health → 健康检查
echo    • GET /env-status → 环境变量状态
echo.

echo 📊 如果这个版本能成功部署：
echo    ✅ Railway环境正常
echo    ✅ 基础配置正确
echo    ✅ 问题在于原始代码的复杂性
echo.

echo 📊 如果这个版本仍然失败：
echo    ❌ Railway账户或配置问题
echo    ❌ 需要检查Railway服务状态
echo    ❌ 可能需要重新创建项目
echo.

echo 要现在打开Railway控制台监控部署吗？ (Y/N)
set /p open_railway=请选择: 

if /i "%open_railway%"=="Y" (
    echo 🌐 正在打开Railway控制台...
    start https://railway.app/dashboard
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🔄 恢复原始版本                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 测试完成后，恢复原始版本的命令：
echo.
echo    copy server-original.js server.js
echo    copy package-original.json package.json  
echo    git add .
echo    git commit -m "Restore: back to original version"
echo    git push
echo.

echo 💡 等待2-3分钟让Railway完成部署，然后告诉我结果！
pause