@echo off
chcp 65001 >nul

echo ╔══════════════════════════════════════════════════════════════╗
echo ║           🚀 一键部署到Netlify Functions                   ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🎯 Netlify Functions 优势：
echo    • 无服务器架构，自动扩容
echo    • 与前端完美集成，统一域名
echo    • 免费额度：125,000次调用/月
echo    • 内置CDN和边缘计算
echo.

pause

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   📁 准备部署文件                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔄 备份当前配置...
if exist "package.json" (
    copy package.json package-backup-netlify.json >nul
    echo ✅ package.json → package-backup-netlify.json
)

if exist "netlify.toml" (
    copy netlify.toml netlify-backup.toml >nul
    echo ✅ netlify.toml → netlify-backup.toml
)

echo.
echo 🔧 切换到Netlify配置...
if exist "package-netlify.json" (
    copy package-netlify.json package.json >nul
    echo ✅ 已切换到Netlify版本 package.json
) else (
    echo ❌ package-netlify.json 不存在
    pause
    exit /b 1
)

if exist "netlify-backend.toml" (
    copy netlify-backend.toml netlify.toml >nul
    echo ✅ 已切换到后端版本 netlify.toml
) else (
    echo ❌ netlify-backend.toml 不存在
    pause
    exit /b 1
)

echo.
echo 🔍 检查必要文件...
if exist "netlify\functions\api.js" (
    echo ✅ netlify/functions/api.js 存在
) else (
    echo ❌ netlify/functions/api.js 不存在
    pause
    exit /b 1
)

if exist "server-netlify.js" (
    echo ✅ server-netlify.js 存在
) else (
    echo ❌ server-netlify.js 不存在
    pause
    exit /b 1
)

echo.
echo ✅ 所有文件准备就绪！

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  📤 提交到GitHub                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📝 提交Netlify配置...

git add .
if %errorlevel% neq 0 (
    echo ❌ git add 失败
    goto :manual_git
)

git commit -m "Deploy: Add Netlify Functions backend configuration"
if %errorlevel% neq 0 (
    echo ⚠️ 提交失败，可能没有变更
)

git push
if %errorlevel% neq 0 (
    echo ❌ git push 失败
    goto :manual_git
)

echo ✅ 配置已推送到GitHub！
goto :netlify_deploy

:manual_git
echo.
echo 📝 请手动执行以下命令：
echo.
echo    git add .
echo    git commit -m "Deploy: Netlify Functions backend"
echo    git push
echo.
pause

:netlify_deploy
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                🌐 Netlify部署选项                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 选择部署方式：
echo.
echo 1. 🌐 网页部署（推荐，最简单）
echo 2. 💻 CLI部署（需要安装CLI）
echo.

set /p deploy_choice=请选择 (1-2): 

if "%deploy_choice%"=="1" goto :web_deploy
if "%deploy_choice%"=="2" goto :cli_deploy

:web_deploy
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  🌐 网页部署指导                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📋 请按以下步骤操作：
echo.
echo 1️⃣ 访问Netlify部署页面
echo    https://app.netlify.com/start
echo.
echo 2️⃣ 连接GitHub仓库
echo    • 点击 "New site from Git"
echo    • 选择 GitHub
echo    • 授权Netlify访问你的仓库
echo.
echo 3️⃣ 选择仓库
echo    • 找到 "destiny-ai-backend" 仓库
echo    • 点击进行部署配置
echo.
echo 4️⃣ 配置构建设置
echo    Build command: npm install
echo    Publish directory: public
echo    Functions directory: netlify/functions
echo.
echo 5️⃣ 部署项目
echo    • 点击 "Deploy site"
echo    • 等待构建完成
echo.

echo 要现在打开Netlify部署页面吗？ (Y/N)
set /p open_netlify=请选择: 

if /i "%open_netlify%"=="Y" (
    echo 🌐 正在打开Netlify部署页面...
    start https://app.netlify.com/start
)

goto :env_config

:cli_deploy
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  💻 CLI部署流程                            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📦 检查Netlify CLI...
netlify --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Netlify CLI 未安装，正在安装...
    npm install -g netlify-cli
    if %errorlevel% neq 0 (
        echo ❌ 安装失败，请手动安装：npm install -g netlify-cli
        pause
        goto :env_config
    )
    echo ✅ Netlify CLI 安装成功
) else (
    echo ✅ Netlify CLI 已安装
)

echo.
echo 🔐 登录Netlify...
netlify login

echo.
echo 🏗️ 初始化项目...
netlify init

echo.
echo 🚀 部署到生产环境...
netlify deploy --prod

if %errorlevel% equ 0 (
    echo ✅ CLI部署成功！
) else (
    echo ❌ CLI部署失败，建议使用网页部署
)

:env_config
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║               🔑 配置Netlify环境变量                       ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo ⚠️ 重要：必须在Netlify控制台配置环境变量
echo.

echo 📋 需要配置的环境变量：
echo.
echo NODE_ENV = production
echo JWT_SECRET = F1cm5Y40AmlqnGh3+ORzLr9brQImPkgljtVWWMQcKOpPtUpRIBPLGXzvt4RDV3T3VsCjEmz4WgK/wVKUSApEWA==
echo OPENROUTER_API_KEY = sk-or-v1-你的密钥
echo STRIPE_SECRET_KEY = sk_test_你的密钥
echo STRIPE_PUBLISHABLE_KEY = pk_test_你的密钥
echo STRIPE_WEBHOOK_SECRET = whsec_你的密钥
echo SUPABASE_URL = https://你的项目.supabase.co
echo SUPABASE_SERVICE_KEY = 你的服务密钥
echo FRONTEND_URL = https://astredevin.netlify.app
echo.

echo 📝 配置步骤：
echo 1. Netlify Dashboard → 选择站点
echo 2. Site settings → Environment variables
echo 3. 点击 "Add variable" 逐个添加
echo 4. 配置完成后重新部署
echo.

echo 要现在打开Netlify控制台配置环境变量吗？ (Y/N)
set /p open_dashboard=请选择: 

if /i "%open_dashboard%"=="Y" (
    echo 🌐 正在打开Netlify控制台...
    start https://app.netlify.com
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   🎯 API端点格式                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📡 部署成功后，你的API端点将是：
echo.
echo Base URL: https://你的站点名.netlify.app/.netlify/functions/api
echo.
echo 主要端点：
echo • GET  /.netlify/functions/api/ → 基本信息
echo • GET  /.netlify/functions/api/health → 健康检查
echo • POST /.netlify/functions/api/register → 用户注册
echo • POST /.netlify/functions/api/login → 用户登录
echo • POST /.netlify/functions/api/divination → AI占卜
echo.

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   ✅ 部署验证步骤                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔍 部署成功后请验证：
echo.
echo 1️⃣ 检查Functions状态
echo    Netlify Dashboard → Functions
echo    确认api函数显示为活跃状态
echo.
echo 2️⃣ 测试基础端点
echo    访问：https://你的站点.netlify.app/.netlify/functions/api/
echo    应该返回JSON响应
echo.
echo 3️⃣ 验证健康检查
echo    访问：https://你的站点.netlify.app/.netlify/functions/api/health
echo    检查所有服务状态
echo.

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  📊 Netlify Functions优势                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🚀 相比其他平台：
echo • 🔗 与前端统一域名，无CORS问题
echo • ⚡ 边缘计算，全球加速
echo • 🔄 自动扩容，无需配置
echo • 💰 慷慨免费额度
echo • 📊 内置监控和日志
echo • 🛡️ 自动HTTPS和安全头
echo.

echo 📖 详细文档: Netlify后端部署指南.md
echo.

echo ✅ Netlify Functions部署准备完成！
echo 💬 请按照上述步骤完成部署，然后告诉我结果！
pause