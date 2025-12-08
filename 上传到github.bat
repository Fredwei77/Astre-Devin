@echo off
chcp 65001 >nul

echo ╔══════════════════════════════════════════════════════════════╗
echo ║             📤 GitHub 上传和 Railway 部署助手              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🎯 这个脚本将帮你：
echo    1. 初始化Git仓库
echo    2. 添加所有项目文件
echo    3. 创建初始提交
echo    4. 指导连接GitHub仓库
echo    5. 指导Railway部署
echo.

pause

cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   🔍 检查项目文件                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

if not exist "package.json" (
    echo ❌ package.json 不存在
    pause
    exit /b 1
) else (
    echo ✅ package.json 存在
)

if not exist "server.js" (
    echo ❌ server.js 不存在
    pause
    exit /b 1
) else (
    echo ✅ server.js 存在
)

if not exist ".gitignore" (
    echo ⚠️ .gitignore 不存在，正在创建...
    (
        echo node_modules/
        echo .env
        echo .env.local
        echo .env.development
        echo .env.production
        echo npm-debug.log*
        echo .DS_Store
        echo *.log
        echo dist/
        echo build/
        echo coverage/
        echo .nyc_output/
        echo tmp_rovodev_*
    ) > .gitignore
    echo ✅ .gitignore 已创建
) else (
    echo ✅ .gitignore 存在
)

echo.
timeout /t 2 >nul

cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🔧 初始化 Git 仓库                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git 未安装，请先安装 Git
    echo 📥 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
) else (
    echo ✅ Git 已安装
)

if exist ".git" (
    echo ⚠️ Git仓库已存在，跳过初始化
) else (
    echo 🔄 初始化Git仓库...
    git init
    if %errorlevel% neq 0 (
        echo ❌ Git初始化失败
        pause
        exit /b 1
    )
    echo ✅ Git仓库初始化成功
)

echo.
timeout /t 2 >nul

cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                     📦 添加项目文件                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📁 添加所有项目文件到Git...
git add .

echo 📋 检查要提交的文件...
git status --short

echo.
echo 📝 创建初始提交...
git commit -m "Initial commit: Destiny AI backend for Railway deployment"

if %errorlevel% neq 0 (
    echo ❌ 提交失败，可能没有文件变更
) else (
    echo ✅ 初始提交创建成功
)

echo.
timeout /t 2 >nul

cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  🌐 GitHub 仓库设置指导                   ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 请按照以下步骤在GitHub创建仓库：
echo.
echo 1️⃣ 打开GitHub:
echo    https://github.com/new
echo.
echo 2️⃣ 填写仓库信息:
echo    Repository name: destiny-ai-backend
echo    Description: Destiny AI 后端服务
echo    Private: ✅ (推荐设为私有)
echo    Initialize: ❌ (不要勾选任何初始化选项)
echo.
echo 3️⃣ 点击 "Create repository"
echo.

echo 要现在打开GitHub创建仓库吗？ (Y/N)
set /p create_repo=请选择: 

if /i "%create_repo%"=="Y" (
    echo 🌐 正在打开GitHub...
    start https://github.com/new
    echo.
    echo 💡 GitHub已打开，请按照上述步骤创建仓库
    echo 📝 创建完成后继续下面的步骤
)

echo.
echo 按任意键继续连接远程仓库...
pause >nul

cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   🔗 连接远程仓库                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 请输入你的GitHub用户名:
set /p github_username=用户名: 

echo.
echo 🔗 添加远程仓库...
git remote add origin https://github.com/%github_username%/destiny-ai-backend.git

echo 🔄 设置主分支...
git branch -M main

echo 📤 推送到GitHub...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ❌ 推送失败，可能的原因：
    echo    1. GitHub仓库未创建
    echo    2. 用户名输入错误
    echo    3. 需要GitHub认证
    echo.
    echo 💡 解决方案：
    echo    1. 确认GitHub仓库已创建
    echo    2. 检查用户名是否正确
    echo    3. 配置GitHub认证 (Personal Access Token)
    echo.
    pause
) else (
    echo ✅ 代码已成功上传到GitHub!
)

echo.
timeout /t 3 >nul

cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                🚀 Railway 部署指导                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🎉 GitHub上传完成！现在开始Railway部署：
echo.

echo 📋 Railway部署步骤：
echo.
echo 1️⃣ 访问Railway:
echo    https://railway.app/new
echo.
echo 2️⃣ 登录并部署:
echo    - 使用GitHub账户登录
echo    - 选择 "Deploy from GitHub repo"
echo    - 找到 "destiny-ai-backend" 仓库
echo    - 点击 "Deploy"
echo.
echo 3️⃣ 配置环境变量:
echo    - 部署开始后，点击项目进入控制台
echo    - 点击 "Variables" 标签
echo    - 添加所需的环境变量 (参考 railway-env-template.txt)
echo.

echo 要现在打开Railway开始部署吗？ (Y/N)
set /p deploy_railway=请选择: 

if /i "%deploy_railway%"=="Y" (
    echo 🌐 正在打开Railway...
    start https://railway.app/new
    echo.
    echo 💡 Railway已打开，请按照上述步骤完成部署
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                     📋 重要提醒                            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🔑 必需的环境变量 (复制到Railway):
echo    NODE_ENV=production
echo    FRONTEND_URL=https://astredevin.netlify.app
echo    OPENROUTER_API_KEY=你的密钥
echo    STRIPE_SECRET_KEY=你的密钥
echo    STRIPE_PUBLISHABLE_KEY=你的密钥
echo    STRIPE_WEBHOOK_SECRET=你的密钥
echo    SUPABASE_URL=你的数据库URL
echo    SUPABASE_SERVICE_KEY=你的数据库密钥
echo    JWT_SECRET=你的JWT密钥
echo.

echo 📖 详细配置请参考:
echo    - railway-env-template.txt
echo    - github-railway-部署方案.md
echo.

echo ✅ 上传完成！祝你部署顺利！
pause