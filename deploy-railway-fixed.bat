@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ╔══════════════════════════════════════════════════════════════╗
echo ║              🚀 Destiny AI Railway 部署 (修复版)            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo ✅ Railway CLI 已安装完成！
echo 📋 现在开始部署流程...
echo.

pause

cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🔐 Railway 登录                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 💡 即将打开浏览器进行登录认证
echo 📝 如果浏览器没有自动打开，请复制显示的链接到浏览器中
echo.

railway login
if %errorlevel% neq 0 (
    echo ❌ 登录失败，请检查网络连接
    pause
    exit /b 1
)

echo ✅ 登录成功！
timeout /t 2 >nul

cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   🏗️ 项目初始化                            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🆕 选择项目设置:
echo    1. 创建新项目 (推荐)
echo    2. 连接现有项目
echo.

railway init
if %errorlevel% neq 0 (
    echo ❌ 项目初始化失败
    echo 💡 请检查项目名称是否已被使用
    pause
    exit /b 1
)

echo ✅ 项目初始化成功！
timeout /t 2 >nul

cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                     🚀 开始部署                            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📦 正在部署 Destiny AI 后端...
echo ⏳ 这个过程可能需要 2-5 分钟，请耐心等待
echo.

railway up --detach
if %errorlevel% neq 0 (
    echo ❌ 部署失败
    echo.
    echo 🔍 常见问题排查：
    echo    1. 检查 package.json 是否存在
    echo    2. 检查 server.js 是否存在
    echo    3. 检查网络连接是否正常
    echo    4. 检查项目配额是否足够
    echo.
    pause
    exit /b 1
)

echo ✅ 部署启动成功！

timeout /t 3 >nul

cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   📊 部署状态检查                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔍 检查部署状态...
railway status

echo.
echo 📝 获取部署信息...
railway domain

echo.
echo ✅ 部署完成！

timeout /t 3 >nul

cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  🔧 环境变量配置指导                       ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🎉 恭喜！Destiny AI 后端已成功部署到 Railway！
echo.

echo ⚠️  重要提醒：现在需要配置环境变量
echo.
echo 📋 必需的环境变量：
echo.
echo    🤖 OpenRouter AI:
echo       OPENROUTER_API_KEY=sk-or-v1-你的密钥
echo.
echo    💳 Stripe 支付:
echo       STRIPE_SECRET_KEY=sk_test_你的密钥
echo       STRIPE_PUBLISHABLE_KEY=pk_test_你的密钥
echo       STRIPE_WEBHOOK_SECRET=whsec_你的密钥
echo.
echo    🗄️ Supabase 数据库:
echo       SUPABASE_URL=https://你的项目.supabase.co
echo       SUPABASE_SERVICE_KEY=你的服务密钥
echo.
echo    🔐 认证:
echo       JWT_SECRET=你的64位随机字符串
echo.
echo    🌍 基础配置:
echo       NODE_ENV=production
echo       FRONTEND_URL=https://astredevin.netlify.app
echo.

echo 📝 配置步骤：
echo    1. 运行命令：railway open
echo    2. 在打开的网页中点击 "Variables" 标签
echo    3. 点击 "New Variable" 逐个添加上述变量
echo    4. 参考文件：railway-env-template.txt
echo.

echo 🔧 配置完成后，服务会自动重启并生效
echo.

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                      📱 便捷操作                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 要现在打开 Railway 控制台配置环境变量吗？ (Y/N)
set /p choice=请选择: 

if /i "%choice%"=="Y" (
    echo 🌐 正在打开 Railway 控制台...
    railway open
    echo.
    echo 💡 控制台已打开，请按照上述指导配置环境变量
) else (
    echo 💡 你可以稍后运行 'railway open' 来配置环境变量
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                     📖 有用的命令                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo railway logs          # 查看实时日志
echo railway status        # 查看服务状态
echo railway variables     # 查看环境变量
echo railway domain        # 查看部署域名
echo railway open          # 打开控制台
echo railway redeploy      # 重新部署
echo.

echo ✅ Destiny AI 后端部署完成！
echo.
echo 🔗 记得更新前端配置中的 API 地址为新的 Railway 域名
echo 📋 详细配置步骤请查看：railway-env-template.txt
echo.

pause