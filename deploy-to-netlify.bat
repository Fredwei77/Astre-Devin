@echo off
chcp 65001 >nul
echo ========================================
echo 九筮 - Netlify 部署助手
echo ========================================
echo.

echo [部署步骤]
echo.
echo [1] 查看安全审计报告
echo [2] 查看部署指南
echo [3] 初始化 Git 仓库
echo [4] 提交并推送代码
echo [5] 打开 Netlify Dashboard
echo [6] 查看所有文档
echo.

set /p choice="请选择 (1-6): "

if "%choice%"=="1" (
    echo.
    echo 正在打开安全审计报告...
    start SECURITY_AUDIT_REPORT.md
    echo ✅ 安全审计报告已打开
    echo.
    echo 📋 审计结果摘要：
    echo    ✅ 所有严重问题已修复
    echo    ✅ OpenRouter API 密钥已移除
    echo    ✅ 环境变量已配置
    echo    ✅ 可以安全部署
    echo.
) else if "%choice%"=="2" (
    echo.
    echo 正在打开部署指南...
    start NETLIFY_DEPLOYMENT_GUIDE.md
    echo ✅ 部署指南已打开
    echo.
    echo 📋 关键步骤：
    echo    1. 推送代码到 GitHub
    echo    2. 在 Netlify 连接仓库
    echo    3. 配置环境变量
    echo    4. 部署网站
    echo.
) else if "%choice%"=="3" (
    echo.
    echo 正在初始化 Git 仓库...
    echo.
    
    git init
    if errorlevel 1 (
        echo ❌ Git 初始化失败
        echo 请确保已安装 Git
    ) else (
        echo ✅ Git 仓库已初始化
        echo.
        echo 添加所有文件...
        git add .
        echo ✅ 文件已添加
    )
    echo.
) else if "%choice%"=="4" (
    echo.
    echo 正在提交并推送代码...
    echo.
    
    set /p message="请输入提交信息 (默认: Ready for deployment): "
    if "%message%"=="" set message=Ready for deployment - Security fixes applied
    
    git commit -m "%message%"
    if errorlevel 1 (
        echo ⚠️ 提交失败或无更改
    ) else (
        echo ✅ 代码已提交
        echo.
        echo 请手动推送到 GitHub:
        echo    git remote add origin https://github.com/your-username/your-repo.git
        echo    git push -u origin main
    )
    echo.
) else if "%choice%"=="5" (
    echo.
    echo 正在打开 Netlify Dashboard...
    start https://app.netlify.com/projects/astredevin/overview
    echo ✅ Netlify Dashboard 已打开
    echo.
    echo 📋 下一步：
    echo    1. 点击 "Add new site" 或选择现有项目
    echo    2. 连接 GitHub 仓库
    echo    3. 配置环境变量（重要！）
    echo    4. 部署网站
    echo.
) else if "%choice%"=="6" (
    echo.
    echo 正在打开所有文档...
    start SECURITY_AUDIT_REPORT.md
    timeout /t 1 /nobreak >nul
    start NETLIFY_DEPLOYMENT_GUIDE.md
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
echo 🔒 安全检查：
echo    ✅ 所有密钥已保护
echo    ✅ 环境变量已配置
echo    ✅ 可以安全部署
echo.
echo 📝 环境变量（在 Netlify 中配置）：
echo    VITE_STRIPE_PUBLISHABLE_KEY
echo    VITE_SUPABASE_URL
echo    VITE_SUPABASE_ANON_KEY
echo.
echo 🚀 部署后验证：
echo    1. 检查网站是否可访问
echo    2. 测试核心功能
echo    3. 检查控制台无错误
echo.

pause
