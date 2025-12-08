@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                 🚀 Destiny AI Railway 一键部署              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📋 步骤概览:
echo    1. 环境检查
echo    2. 安装 Railway CLI
echo    3. 登录和初始化
echo    4. 部署项目
echo    5. 配置环境变量指导
echo.

pause
cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    1️⃣ 环境检查                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔍 检查必要文件...
set "check_passed=true"

if not exist "package.json" (
    echo ❌ package.json 不存在
    set "check_passed=false"
) else (
    echo ✅ package.json 存在
)

if not exist "server.js" (
    echo ❌ server.js 不存在
    set "check_passed=false"
) else (
    echo ✅ server.js 存在
)

if not exist "railway.json" (
    echo ❌ railway.json 不存在
    set "check_passed=false"
) else (
    echo ✅ railway.json 存在
)

echo.
echo 🔧 检查系统环境...

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js 18+
    set "check_passed=false"
) else (
    for /f "delims=" %%i in ('node --version') do set node_version=%%i
    echo ✅ Node.js !node_version! 已安装
)

if "!check_passed!"=="false" (
    echo.
    echo ❌ 环境检查失败，请修复上述问题后重试
    pause
    exit /b 1
)

echo.
echo ✅ 环境检查通过！
timeout /t 2 >nul

cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                 2️⃣ 安装 Railway CLI                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📥 Railway CLI 未安装，正在安装...
    npm install -g @railway/cli
    if %errorlevel% neq 0 (
        echo ❌ Railway CLI 安装失败
        echo 💡 请尝试以管理员身份运行此脚本
        pause
        exit /b 1
    )
    echo ✅ Railway CLI 安装成功！
) else (
    for /f "delims=" %%i in ('railway --version') do set railway_version=%%i
    echo ✅ Railway CLI 已安装 (!railway_version!)
)

timeout /t 2 >nul

cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                3️⃣ 登录和项目初始化                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔐 正在打开浏览器进行登录...
echo 💡 如果浏览器没有自动打开，请手动访问显示的链接
echo.

railway login
if %errorlevel% neq 0 (
    echo ❌ 登录失败
    pause
    exit /b 1
)

echo.
echo ✅ 登录成功！

echo.
echo 🏗️ 初始化项目...
echo 💡 如果提示选择现有项目或创建新项目，建议创建新项目

railway init
if %errorlevel% neq 0 (
    echo ❌ 项目初始化失败
    pause
    exit /b 1
)

echo.
echo ✅ 项目初始化成功！

timeout /t 2 >nul

cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                     4️⃣ 部署项目                            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🚀 开始部署到 Railway...
echo 📦 这可能需要几分钟时间，请耐心等待...
echo.

railway up
if %errorlevel% neq 0 (
    echo ❌ 部署失败
    echo 💡 请检查网络连接和项目配置
    pause
    exit /b 1
)

echo.
echo ✅ 部署成功！

timeout /t 3 >nul

cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                 5️⃣ 环境变量配置指导                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🎉 恭喜！你的 Destiny AI 后端已成功部署到 Railway！
echo.

echo 🔗 获取部署信息...
railway status
echo.

echo ⚠️  重要：还需要配置环境变量才能正常运行
echo.
echo 📋 必需的环境变量列表：
echo.
echo    🤖 AI 服务：
echo       OPENROUTER_API_KEY=sk-or-v1-你的密钥
echo.
echo    💳 支付服务：
echo       STRIPE_SECRET_KEY=sk_test_你的密钥
echo       STRIPE_PUBLISHABLE_KEY=pk_test_你的密钥
echo       STRIPE_WEBHOOK_SECRET=whsec_你的密钥
echo.
echo    🗄️ 数据库：
echo       SUPABASE_URL=https://你的项目.supabase.co
echo       SUPABASE_SERVICE_KEY=你的服务密钥
echo.
echo    🔐 认证：
echo       JWT_SECRET=你的JWT密钥
echo.
echo    🌍 其他：
echo       NODE_ENV=production
echo       FRONTEND_URL=https://astredevin.netlify.app
echo.

echo 📝 配置步骤：
echo    1. 打开 Railway 控制台：https://railway.app/dashboard
echo    2. 选择你刚创建的项目
echo    3. 点击 "Variables" 标签页
echo    4. 逐个添加上述环境变量
echo    5. 参考文件：railway-env-template.txt
echo.

echo 🔧 配置完成后：
echo    1. 服务会自动重启
echo    2. 访问你的 Railway 域名测试功能
echo    3. 更新前端配置指向新的后端地址
echo.

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                       🎯 下一步                             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 1. 📋 配置环境变量 (必须)
echo 2. 🔗 更新前端 API 配置
echo 3. 🧪 测试所有功能
echo 4. 📊 监控服务状态
echo.

echo 📖 详细文档：
echo    - RAILWAY_DEPLOYMENT_GUIDE.md
echo    - railway-env-template.txt
echo.

echo 💡 常用命令：
echo    railway logs          # 查看日志
echo    railway status        # 查看状态  
echo    railway variables     # 查看环境变量
echo    railway open          # 打开项目控制台
echo.

echo ✅ 部署完成！
echo.
echo 要现在打开 Railway 控制台配置环境变量吗？ (Y/N)
set /p choice=请选择: 

if /i "%choice%"=="Y" (
    railway open
    echo 💡 控制台已打开，请按照上述指导配置环境变量
) else (
    echo 💡 记得稍后配置环境变量哦！
)

echo.
echo 🎉 感谢使用 Destiny AI 部署脚本！
pause