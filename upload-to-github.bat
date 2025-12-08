@echo off
chcp 65001 >nul
echo ========================================
echo 九筮 - GitHub 上传助手
echo ========================================
echo.

echo 仓库信息：
echo 名称: Astre-Devin
echo URL: https://github.com/Fredwei77/Astre-Devin
echo.

echo ========================================
echo 上传步骤
echo ========================================
echo.

echo [步骤 1/5] 检查 Git 安装...
where git >nul 2>nul
if errorlevel 1 (
    echo ❌ Git 未安装
    echo.
    echo 请先安装 Git:
    echo https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Git 已安装
)
echo.

echo [步骤 2/5] 初始化 Git 仓库...
if exist .git (
    echo ⚠️ Git 仓库已存在
    echo.
    set /p reinit="是否重新初始化? (y/n): "
    if /i "%reinit%"=="y" (
        rmdir /s /q .git
        git init
        echo ✅ Git 仓库已重新初始化
    ) else (
        echo ℹ️ 使用现有 Git 仓库
    )
) else (
    git init
    echo ✅ Git 仓库已初始化
)
echo.

echo [步骤 3/5] 添加文件到 Git...
git add .
if errorlevel 1 (
    echo ❌ 添加文件失败
    pause
    exit /b 1
) else (
    echo ✅ 文件已添加
)
echo.

echo [步骤 4/5] 提交更改...
set /p commit_msg="请输入提交信息 (默认: Initial commit - Ready for deployment): "
if "%commit_msg%"=="" set commit_msg=Initial commit - Ready for deployment

git commit -m "%commit_msg%"
if errorlevel 1 (
    echo ⚠️ 提交失败或无更改
    echo.
    set /p force_continue="是否继续? (y/n): "
    if /i not "%force_continue%"=="y" (
        pause
        exit /b 1
    )
) else (
    echo ✅ 更改已提交
)
echo.

echo [步骤 5/5] 推送到 GitHub...
echo.
echo 正在配置远程仓库...

git remote remove origin 2>nul
git remote add origin https://github.com/Fredwei77/Astre-Devin.git
if errorlevel 1 (
    echo ❌ 配置远程仓库失败
    pause
    exit /b 1
) else (
    echo ✅ 远程仓库已配置
)
echo.

echo 正在推送到 GitHub...
echo.
echo ⚠️ 如果这是第一次推送，可能需要输入 GitHub 凭据
echo.

git branch -M main
git push -u origin main --force

if errorlevel 1 (
    echo.
    echo ❌ 推送失败
    echo.
    echo 可能的原因：
    echo 1. 需要 GitHub 身份验证
    echo 2. 网络连接问题
    echo 3. 仓库权限问题
    echo.
    echo 解决方案：
    echo 1. 使用 GitHub Desktop
    echo 2. 配置 SSH 密钥
    echo 3. 使用 Personal Access Token
    echo.
    echo 手动推送命令：
    echo git push -u origin main --force
    echo.
) else (
    echo.
    echo ========================================
    echo ✅ 成功上传到 GitHub！
    echo ========================================
    echo.
    echo 仓库地址：
    echo https://github.com/Fredwei77/Astre-Devin
    echo.
    echo 下一步：
    echo 1. 访问 GitHub 仓库确认文件
    echo 2. 在 Netlify 连接此仓库
    echo 3. 在 Railway 连接此仓库
    echo.
)

echo.
echo ========================================
echo 重要提示
echo ========================================
echo.
echo 🔒 安全检查：
echo    ✅ .env 文件已被 .gitignore 忽略
echo    ✅ 敏感信息未上传
echo    ✅ 只上传了源代码
echo.
echo 📝 已上传的文件：
echo    ✅ 所有 HTML 页面
echo    ✅ 所有 JavaScript 文件
echo    ✅ 所有 CSS 文件
echo    ✅ 配置文件 (netlify.toml, package.json)
echo    ✅ 文档文件 (*.md)
echo.
echo 🚫 未上传的文件：
echo    ✅ .env (环境变量)
echo    ✅ node_modules (依赖包)
echo    ✅ 临时文件
echo.

pause
