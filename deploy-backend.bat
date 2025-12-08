@echo off
chcp 65001 >nul
echo ========================================
echo 九筮 - 后端服务器部署助手
echo ========================================
echo.

echo [部署选项]
echo.
echo [1] 查看部署指南
echo [2] 检查环境配置
echo [3] 本地测试服务器
echo [4] 打开 Railway Dashboard
echo [5] 打开 Render Dashboard
echo [6] 生成 JWT Secret
echo [7] 查看所有文档
echo.

set /p choice="请选择 (1-7): "

if "%choice%"=="1" (
    echo.
    echo 正在打开后端部署指南...
    start BACKEND_DEPLOYMENT_GUIDE.md
    echo ✅ 部署指南已打开
    echo.
    echo 📋 推荐部署平台：
    echo    1. Railway - 最简单，免费额度充足
    echo    2. Render - 稳定可靠
    echo    3. Heroku - 成熟但需付费
    echo.
) else if "%choice%"=="2" (
    echo.
    echo 正在检查环境配置...
    echo.
    
    if exist .env (
        echo ✅ .env 文件存在
        echo.
        echo 📋 环境变量检查：
        findstr /C:"OPENROUTER_API_KEY" .env >nul
        if errorlevel 1 (
            echo    ❌ OPENROUTER_API_KEY 未配置
        ) else (
            echo    ✅ OPENROUTER_API_KEY 已配置
        )
        
        findstr /C:"STRIPE_SECRET_KEY" .env >nul
        if errorlevel 1 (
            echo    ❌ STRIPE_SECRET_KEY 未配置
        ) else (
            echo    ✅ STRIPE_SECRET_KEY 已配置
        )
        
        findstr /C:"SUPABASE_URL" .env >nul
        if errorlevel 1 (
            echo    ❌ SUPABASE_URL 未配置
        ) else (
            echo    ✅ SUPABASE_URL 已配置
        )
        
        findstr /C:"JWT_SECRET" .env >nul
        if errorlevel 1 (
            echo    ❌ JWT_SECRET 未配置
        ) else (
            echo    ✅ JWT_SECRET 已配置
        )
    ) else (
        echo ❌ .env 文件不存在
        echo.
        echo 创建 .env 文件：
        echo    1. 复制 .env.example 为 .env
        echo    2. 填写所有环境变量
        echo    3. 不要提交到 Git
    )
    echo.
) else if "%choice%"=="3" (
    echo.
    echo 正在启动本地测试服务器...
    echo.
    
    if not exist node_modules (
        echo 安装依赖...
        call npm install
    )
    
    if exist .env (
        echo ✅ 环境变量已配置
        echo.
        echo 启动服务器...
        echo 访问: http://localhost:3000
        echo 健康检查: http://localhost:3000/api/health
        echo.
        echo 按 Ctrl+C 停止服务器
        echo.
        call npm start
    ) else (
        echo ❌ .env 文件不存在
        echo 请先创建 .env 文件并配置环境变量
    )
    echo.
) else if "%choice%"=="4" (
    echo.
    echo 正在打开 Railway Dashboard...
    start https://railway.app
    echo ✅ Railway Dashboard 已打开
    echo.
    echo 📋 部署步骤：
    echo    1. 登录 Railway
    echo    2. New Project → Deploy from GitHub
    echo    3. 选择你的仓库
    echo    4. 配置环境变量
    echo    5. 部署
    echo.
) else if "%choice%"=="5" (
    echo.
    echo 正在打开 Render Dashboard...
    start https://render.com
    echo ✅ Render Dashboard 已打开
    echo.
    echo 📋 部署步骤：
    echo    1. 登录 Render
    echo    2. New + → Web Service
    echo    3. 连接 GitHub 仓库
    echo    4. 配置环境变量
    echo    5. Create Web Service
    echo.
) else if "%choice%"=="6" (
    echo.
    echo 正在生成 JWT Secret...
    echo.
    
    where node >nul 2>nul
    if errorlevel 1 (
        echo ❌ Node.js 未安装
        echo 请安装 Node.js: https://nodejs.org
    ) else (
        echo 生成的 JWT Secret:
        echo.
        node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
        echo.
        echo ✅ 请复制上面的密钥到 .env 文件的 JWT_SECRET
    )
    echo.
) else if "%choice%"=="7" (
    echo.
    echo 正在打开所有文档...
    start BACKEND_DEPLOYMENT_GUIDE.md
    timeout /t 1 /nobreak >nul
    start SECURITY_AUDIT_REPORT.md
    timeout /t 1 /nobreak >nul
    start DEPLOYMENT_READY_REPORT.md
    echo ✅ 所有文档已打开
    echo.
) else (
    echo.
    echo ❌ 无效选择
    echo.
)

echo ========================================
echo 重要提示：
echo ========================================
echo.
echo 🔒 安全提醒：
echo    ⚠️ OpenRouter API 密钥已泄露，必须轮换
echo    ✅ 所有密钥通过环境变量配置
echo    ✅ 不要提交 .env 文件到 Git
echo.
echo 📝 必需的环境变量：
echo    - OPENROUTER_API_KEY （新密钥）
echo    - STRIPE_SECRET_KEY
echo    - SUPABASE_URL
echo    - SUPABASE_SERVICE_KEY
echo    - JWT_SECRET
echo    - FRONTEND_URL
echo.
echo 🚀 推荐部署流程：
echo    1. 在 Railway 创建项目
echo    2. 配置所有环境变量
echo    3. 部署后端服务器
echo    4. 获取后端 URL
echo    5. 更新 Netlify 配置
echo.

pause
