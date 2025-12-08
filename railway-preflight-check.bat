@echo off
echo ========================================
echo 🔍 Railway 部署前置检查
echo ========================================
echo.

set "error_count=0"

echo 📁 检查项目文件...

if exist "package.json" (
    echo ✅ package.json 存在
) else (
    echo ❌ package.json 不存在
    set /a error_count+=1
)

if exist "server.js" (
    echo ✅ server.js 存在
) else (
    echo ❌ server.js 不存在
    set /a error_count+=1
)

if exist "Procfile" (
    echo ✅ Procfile 存在
) else (
    echo ❌ Procfile 不存在
    set /a error_count+=1
)

if exist "railway.json" (
    echo ✅ railway.json 存在
) else (
    echo ❌ railway.json 不存在
    set /a error_count+=1
)

if exist ".env.example" (
    echo ✅ .env.example 存在
) else (
    echo ⚠️ .env.example 不存在（建议创建）
)

echo.
echo 🔧 检查系统环境...

node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js 已安装
    for /f "delims=" %%i in ('node --version') do set node_version=%%i
    echo    版本: %node_version%
) else (
    echo ❌ Node.js 未安装
    set /a error_count+=1
)

npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ npm 已安装
    for /f "delims=" %%i in ('npm --version') do set npm_version=%%i
    echo    版本: %npm_version%
) else (
    echo ❌ npm 未安装
    set /a error_count+=1
)

git --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Git 已安装
) else (
    echo ⚠️ Git 未安装（推荐安装用于版本控制）
)

railway --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Railway CLI 已安装
) else (
    echo ⚠️ Railway CLI 未安装
    echo 💡 将在部署时自动安装
)

echo.
echo 📦 检查项目依赖...

if exist "node_modules" (
    echo ✅ node_modules 存在
) else (
    echo ⚠️ node_modules 不存在，正在安装依赖...
    npm install
    if %errorlevel% equ 0 (
        echo ✅ 依赖安装成功
    ) else (
        echo ❌ 依赖安装失败
        set /a error_count+=1
    )
)

echo.
echo 📋 环境变量清单...
echo 🔑 请准备以下环境变量:
echo.
echo    必需变量:
echo    ├─ OPENROUTER_API_KEY (OpenRouter AI 密钥)
echo    ├─ STRIPE_SECRET_KEY (Stripe 秘钥)
echo    ├─ STRIPE_PUBLISHABLE_KEY (Stripe 公钥)
echo    ├─ STRIPE_WEBHOOK_SECRET (Stripe Webhook 密钥)
echo    ├─ SUPABASE_URL (Supabase 项目 URL)
echo    ├─ SUPABASE_SERVICE_KEY (Supabase 服务密钥)
echo    └─ JWT_SECRET (JWT 认证密钥)
echo.
echo    可选变量:
echo    ├─ NODE_ENV=production
echo    ├─ PORT=3000
echo    └─ FRONTEND_URL=https://astredevin.netlify.app
echo.

echo ========================================
echo 📊 检查结果
echo ========================================

if %error_count% equ 0 (
    echo ✅ 所有检查通过！项目已准备就绪
    echo.
    echo 🚀 可以开始部署了！
    echo 运行命令: deploy-railway.bat
    echo.
    echo 或者手动部署:
    echo 1. railway login
    echo 2. railway init
    echo 3. railway up
) else (
    echo ❌ 发现 %error_count% 个问题，请先修复
    echo.
    echo 🔧 修复建议:
    if not exist "package.json" echo    - 确保在正确的项目目录中
    if not exist "server.js" echo    - 确保后端代码文件完整
    echo    - 检查 Node.js 和 npm 安装
    echo    - 运行 npm install 安装依赖
)

echo.
echo 📖 更多信息请查看: RAILWAY_DEPLOYMENT_GUIDE.md
echo.
pause