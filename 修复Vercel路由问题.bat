@echo off
chcp 65001 >nul

echo ╔══════════════════════════════════════════════════════════════╗
echo ║            🔧 修复Vercel路由问题 - 接口不存在               ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo ✅ 好消息：Vercel部署成功了！
echo ⚠️ 问题：API路由配置需要调整
echo.

echo 🔍 "接口不存在" 错误说明：
echo    1. Vercel成功部署了应用
echo    2. 但是路由配置不正确
echo    3. 需要修复vercel.json配置
echo.

pause

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   🔧 创建修复配置                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📝 正在创建正确的Vercel配置...

REM 备份原有配置
if exist "vercel.json" (
    copy vercel.json vercel-backup.json >nul
    echo ✅ 原配置已备份为 vercel-backup.json
)

REM 创建新的正确配置
(
echo {
echo   "version": 2,
echo   "builds": [
echo     {
echo       "src": "server.js",
echo       "use": "@vercel/node"
echo     }
echo   ],
echo   "routes": [
echo     {
echo       "src": "/api/.*",
echo       "dest": "/server.js"
echo     },
echo     {
echo       "src": "/health",
echo       "dest": "/server.js"
echo     },
echo     {
echo       "src": "/(.*)",
echo       "dest": "/server.js"
echo     }
echo   ],
echo   "env": {
echo     "NODE_ENV": "production"
echo   }
echo }
) > vercel.json

echo ✅ 新的vercel.json配置已创建

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  📝 检查Server.js路由                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔍 确认server.js中的基础路由存在...

findstr /C:"app.get('/'," server.js >nul
if %errorlevel% equ 0 (
    echo ✅ 根路由 / 存在
) else (
    echo ⚠️ 根路由可能缺失
)

findstr /C:"/health" server.js >nul
if %errorlevel% equ 0 (
    echo ✅ 健康检查路由 /health 存在
) else (
    echo ⚠️ 健康检查路由可能缺失
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   📤 提交修复                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔄 提交修复到GitHub...

git add vercel.json
if %errorlevel% neq 0 (
    echo ❌ git add 失败
    goto :manual_commit
)

git commit -m "Fix Vercel routing configuration - resolve interface not found error"
if %errorlevel% neq 0 (
    echo ❌ git commit 失败
    goto :manual_commit
)

git push
if %errorlevel% neq 0 (
    echo ❌ git push 失败
    goto :manual_commit
)

echo ✅ 修复已提交到GitHub！
goto :wait_deploy

:manual_commit
echo.
echo 📝 请手动执行以下命令：
echo.
echo    git add vercel.json
echo    git commit -m "Fix Vercel routing configuration"
echo    git push
echo.
pause

:wait_deploy
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  ⏳ 等待Vercel重新部署                     ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🚀 Vercel会检测到配置更改并自动重新部署
echo ⏱️ 通常需要1-2分钟完成
echo.

echo 📋 修复说明：
echo    • 更新了vercel.json路由配置
echo    • 添加了API路径匹配规则
echo    • 确保所有请求正确转发到server.js
echo.

echo 🎯 测试端点：
echo    • GET / → 应用基本信息
echo    • GET /health → 健康检查
echo    • GET /api/* → API路由
echo.

echo 要现在打开Vercel控制台监控重新部署吗？ (Y/N)
set /p open_vercel=请选择: 

if /i "%open_vercel%"=="Y" (
    echo 🌐 正在打开Vercel控制台...
    start https://vercel.com/dashboard
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    📊 验证修复                             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo ✅ 修复成功的标志：
echo    • 访问根域名显示JSON响应而不是"接口不存在"
echo    • /health 端点返回健康状态
echo    • API调用正常工作
echo.

echo ⏰ 请等待1-2分钟后测试，然后告诉我结果！
echo.

echo 💡 如果仍有问题，可能需要检查：
echo    1. 环境变量是否正确配置
echo    2. server.js中的路由定义
echo    3. Vercel部署日志中的错误信息
echo.

pause