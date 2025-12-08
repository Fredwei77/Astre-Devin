@echo off
chcp 65001 >nul

echo ╔══════════════════════════════════════════════════════════════╗
echo ║              🚀 一键部署到Vercel - Railway替代方案         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🎯 Railway连续部署失败，切换到Vercel平台
echo 💡 Vercel专门优化Node.js应用，成功率更高
echo.

pause

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🔄 准备部署文件                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM 恢复原始文件（如果之前使用了测试版本）
if exist "server-original.js" (
    echo 🔄 检测到测试版本，正在恢复原始文件...
    copy server-original.js server.js >nul
    echo ✅ server.js 已恢复
)

if exist "package-original.json" (
    copy package-original.json package.json >nul
    echo ✅ package.json 已恢复
)

REM 确认必要文件存在
if exist "vercel.json" (
    echo ✅ vercel.json 配置文件存在
) else (
    echo ❌ vercel.json 不存在，无法部署到Vercel
    pause
    exit /b 1
)

if exist "server.js" (
    echo ✅ server.js 主文件存在
) else (
    echo ❌ server.js 不存在
    pause
    exit /b 1
)

if exist "package.json" (
    echo ✅ package.json 依赖文件存在
) else (
    echo ❌ package.json 不存在
    pause
    exit /b 1
)

echo.
echo ✅ 所有必要文件准备就绪！

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   📤 提交到GitHub                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📝 提交Vercel配置到GitHub...

git add .
if %errorlevel% neq 0 (
    echo ❌ git add 失败
    goto :manual_commit
)

git commit -m "Deploy: switch to Vercel platform with vercel.json config"
if %errorlevel% neq 0 (
    echo ⚠️ 提交失败，可能没有变更（这是正常的）
)

git push
if %errorlevel% neq 0 (
    echo ❌ git push 失败
    goto :manual_commit
)

echo ✅ 代码已推送到GitHub！
goto :vercel_deploy

:manual_commit
echo.
echo 📝 请手动执行以下命令：
echo.
echo    git add .
echo    git commit -m "Deploy: switch to Vercel platform"
echo    git push
echo.
pause

:vercel_deploy
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  🌐 部署到Vercel                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🚀 现在开始Vercel部署流程...
echo.

echo 📋 选择部署方式：
echo.
echo 1. 🌐 网页部署（推荐，简单易用）
echo 2. 💻 CLI部署（需要安装Vercel CLI）
echo.

set /p deploy_method=请选择 (1-2): 

if "%deploy_method%"=="1" goto :web_deploy
if "%deploy_method%"=="2" goto :cli_deploy

:web_deploy
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   🌐 网页部署步骤                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📋 请按以下步骤操作：
echo.
echo 1️⃣ 访问Vercel部署页面
echo    https://vercel.com/new
echo.
echo 2️⃣ 登录GitHub账户
echo    使用你的GitHub账户登录Vercel
echo.
echo 3️⃣ 选择仓库
echo    找到 "destiny-ai-backend" 仓库
echo    点击 "Import"
echo.
echo 4️⃣ 配置项目
echo    Project Name: destiny-ai-backend
echo    Framework Preset: Other (或自动检测)
echo    Root Directory: ./
echo.
echo 5️⃣ 点击Deploy
echo    Vercel会自动开始部署
echo.

echo 要现在打开Vercel部署页面吗？ (Y/N)
set /p open_vercel=请选择: 

if /i "%open_vercel%"=="Y" (
    echo 🌐 正在打开Vercel部署页面...
    start https://vercel.com/new
)

goto :env_config

:cli_deploy
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   💻 CLI部署步骤                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📦 正在检查Vercel CLI...

vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Vercel CLI 未安装，正在安装...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo ❌ 安装失败，请手动安装：npm install -g vercel
        pause
        goto :env_config
    )
    echo ✅ Vercel CLI 安装成功
) else (
    echo ✅ Vercel CLI 已安装
)

echo.
echo 🔐 登录Vercel...
vercel login

echo.
echo 🚀 开始部署...
vercel --prod

if %errorlevel% equ 0 (
    echo ✅ 部署成功！
) else (
    echo ❌ CLI部署失败，建议使用网页部署
)

:env_config
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║              🔑 配置Vercel环境变量                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo ⚠️ 重要：部署后必须配置环境变量
echo.

echo 📋 需要在Vercel控制台添加的变量：
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
echo 1. Vercel Dashboard → 选择项目
echo 2. Settings → Environment Variables
echo 3. 添加每个变量
echo 4. Deploy → Redeploy 重新部署
echo.

echo 要现在打开Vercel控制台配置环境变量吗？ (Y/N)
set /p open_dashboard=请选择: 

if /i "%open_dashboard%"=="Y" (
    echo 🌐 正在打开Vercel控制台...
    start https://vercel.com/dashboard
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                     🎯 部署验证                            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo ✅ 部署成功后的验证步骤：
echo.
echo 1️⃣ 检查部署状态
echo    Vercel Dashboard → Deployments
echo    确认状态为 "Ready"
echo.
echo 2️⃣ 测试API端点
echo    访问：https://你的项目.vercel.app
echo    访问：https://你的项目.vercel.app/health
echo.
echo 3️⃣ 更新前端配置
echo    修改前端项目的API地址为Vercel域名
echo.

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    💡 Vercel优势                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🚀 相比Railway的优势：
echo • 更好的Node.js支持
echo • 更快的部署速度
echo • 更稳定的服务
echo • 更友好的错误提示
echo • 自动HTTPS和CDN
echo • 零配置部署
echo.

echo 📖 详细文档: 切换到Vercel部署.md
echo.

echo ✅ Vercel部署完成！
echo 💬 部署结果如何？请告诉我是否成功！
pause