@echo off
chcp 65001 >nul

echo ╔══════════════════════════════════════════════════════════════╗
echo ║            🚨 Railway "页面偏离轨道" 快速修复              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 这个错误表示应用程序启动失败，通常是配置问题。
echo.

echo 🎯 选择修复方案：
echo.
echo 1. 🔧 重置环境变量（推荐）
echo 2. 📦 使用最小测试版本
echo 3. 🔍 查看详细诊断步骤
echo 4. 🌐 打开Railway控制台检查日志
echo 5. 💡 生成新的JWT密钥
echo.

set /p choice=请选择 (1-5): 

if "%choice%"=="1" goto :reset_env
if "%choice%"=="2" goto :minimal_version
if "%choice%"=="3" goto :diagnosis
if "%choice%"=="4" goto :open_console
if "%choice%"=="5" goto :generate_jwt

goto :end

:reset_env
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                 🔧 重置环境变量方案                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📋 请按以下步骤操作：
echo.
echo 1️⃣ 删除所有现有环境变量
echo ════════════════════════════════════════════════════════════════
echo    • 在Railway控制台 → Variables 标签
echo    • 删除所有现有变量
echo.

echo 2️⃣ 重新添加最核心的变量
echo ════════════════════════════════════════════════════════════════
echo    变量名: NODE_ENV
echo    变量值: production
echo.
echo    变量名: JWT_SECRET  
echo    变量值: %random%%random%%random%%random%abcdef1234567890
echo           (使用下面生成的64位密钥)
echo.

echo 3️⃣ 生成JWT密钥
echo ════════════════════════════════════════════════════════════════

echo 请复制这个JWT_SECRET值:
echo %random%%random%%random%%random%abcdef1234567890abcdef1234567890abcdef12

echo.
echo 4️⃣ 等待自动重新部署
echo    添加变量后，Railway会自动重新部署
echo    如果成功，再逐个添加其他变量
echo.

goto :end

:minimal_version
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                📦 使用最小测试版本                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 这将临时替换为最小版本来测试基础功能
echo.

echo 📋 操作步骤：
echo.
echo 1️⃣ 备份当前文件
echo ════════════════════════════════════════════════════════════════
if exist package.json (
    copy package.json package-backup.json >nul
    echo ✅ package.json 已备份
) else (
    echo ❌ package.json 不存在
)

echo.
echo 2️⃣ 替换为测试版本
echo ════════════════════════════════════════════════════════════════
if exist package-test.json (
    copy package-test.json package.json >nul
    echo ✅ 已替换为测试版本
) else (
    echo ❌ package-test.json 不存在，请先创建测试版本
    goto :end
)

echo.
echo 3️⃣ 提交并推送到GitHub
echo ════════════════════════════════════════════════════════════════
echo git add .
echo git commit -m "Fix: temporary minimal version for debugging"
echo git push

echo.
echo 4️⃣ 手动执行上述Git命令，然后观察Railway重新部署
echo.

goto :end

:diagnosis
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                🔍 详细诊断步骤                             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔍 请按顺序检查以下内容：
echo.

echo 1️⃣ 检查部署日志
echo ════════════════════════════════════════════════════════════════
echo    Railway控制台 → Deployments → 点击失败的部署
echo    查看红色错误信息
echo.

echo 2️⃣ 常见错误类型
echo ════════════════════════════════════════════════════════════════
echo    • "Cannot find module" → 依赖问题
echo    • "EADDRINUSE" → 端口冲突  
echo    • "ValidationError" → 环境变量错误
echo    • "undefined" → 缺少必需变量
echo.

echo 3️⃣ 必需环境变量检查
echo ════════════════════════════════════════════════════════════════
echo    ✓ NODE_ENV=production
echo    ✓ JWT_SECRET=64位随机字符串
echo    ✓ OPENROUTER_API_KEY=sk-or-v1-...
echo.

echo 4️⃣ 如果是端口问题
echo ════════════════════════════════════════════════════════════════
echo    确认server.js中有：
echo    const PORT = process.env.PORT ^|^| 3000;
echo    app.listen(PORT, '0.0.0.0', ...);
echo.

goto :end

:open_console
echo 🌐 正在打开Railway控制台...
start https://railway.app/dashboard
echo.
echo 💡 在控制台中：
echo    1. 选择你的项目
echo    2. 点击 "Deployments" 查看失败的部署
echo    3. 查看详细错误日志
echo    4. 检查 "Variables" 标签的环境变量
echo.
goto :end

:generate_jwt
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                🔐 生成新的JWT密钥                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔑 新生成的JWT_SECRET (请复制使用):
echo.
echo %random%%random%%random%%random%abcdef1234567890abcdef1234567890abcdef1234567890
echo.

echo 📋 使用方法：
echo 1. 复制上面的密钥
echo 2. 在Railway控制台 → Variables 中
echo 3. 找到 JWT_SECRET 变量
echo 4. 替换为新生成的值
echo 5. 保存后等待自动重新部署
echo.

goto :end

:end
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                      💡 重要提示                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🚨 "页面偏离轨道" 通常是这些原因：
echo    1. JWT_SECRET 格式错误或太短
echo    2. 环境变量包含特殊字符或空格
echo    3. OPENROUTER_API_KEY 无效
echo    4. 端口配置问题
echo.

echo 🎯 建议修复顺序：
echo    1. 先重置环境变量 (选项1)
echo    2. 如果仍失败，使用测试版本 (选项2)  
echo    3. 查看具体错误日志确定问题
echo.

echo 📖 详细文档: Railway部署错误修复.md
echo.

echo 修复完成后，请告诉我结果！
pause