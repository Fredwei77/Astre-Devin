@echo off
chcp 65001 >nul

echo ╔══════════════════════════════════════════════════════════════╗
echo ║              🔧 Railway 服务离线问题修复                   ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔍 服务离线常见原因和解决方案：
echo.

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    📋 诊断清单                             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 请按照以下步骤检查：
echo.

echo 1️⃣ 检查部署日志
echo ═══════════════════════════════════════════════════════════════
echo 在Railway控制台中：
echo    • 项目页面 → Deployments 标签
echo    • 点击最新部署查看日志
echo    • 寻找红色错误信息
echo.

echo 2️⃣ 检查启动脚本
echo ═══════════════════════════════════════════════════════════════
echo 确认package.json包含：
echo    "scripts": {
echo        "start": "node server.js"
echo    }
echo.

echo 3️⃣ 检查端口配置
echo ═══════════════════════════════════════════════════════════════
echo 确认server.js中端口设置：
echo    const port = process.env.PORT ^|^| 3000;
echo    app.listen(port, ...);
echo.

echo 4️⃣ 验证必需环境变量
echo ═══════════════════════════════════════════════════════════════
echo 必须设置的变量：
echo    ✓ NODE_ENV=production
echo    ✓ OPENROUTER_API_KEY=sk-or-v1-...
echo    ✓ SUPABASE_URL=https://...
echo    ✓ SUPABASE_SERVICE_KEY=...
echo    ✓ JWT_SECRET=...
echo    ✓ STRIPE_SECRET_KEY=sk_test_...
echo.

pause

cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   🚨 快速修复方案                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 选择你遇到的具体问题：
echo.
echo 1. 部署日志显示端口错误
echo 2. 环境变量未设置或错误
echo 3. 依赖安装失败
echo 4. 数据库连接失败
echo 5. 其他错误
echo 6. 查看完整诊断步骤
echo.

set /p choice=请输入数字选择(1-6): 

if "%choice%"=="1" goto :port_fix
if "%choice%"=="2" goto :env_fix
if "%choice%"=="3" goto :deps_fix
if "%choice%"=="4" goto :db_fix
if "%choice%"=="5" goto :other_fix
if "%choice%"=="6" goto :full_diagnosis

goto :end

:port_fix
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   🔧 端口配置修复                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 问题：端口配置错误导致服务无法启动
echo.
echo 解决方案：
echo 1. 检查server.js文件中的端口设置
echo 2. 确保使用 process.env.PORT
echo.
echo 正确的配置应该是：
echo.
echo const port = process.env.PORT ^|^| 3000;
echo app.listen(port, '0.0.0.0', () =^> {
echo     console.log(`Server running on port ${port}`);
echo });
echo.
echo 修复后需要重新部署到GitHub，Railway会自动检测更新
goto :end

:env_fix
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                 🔑 环境变量检查修复                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 问题：环境变量配置错误或缺失
echo.
echo 立即检查步骤：
echo 1. Railway控制台 → Variables 标签
echo 2. 确认所有必需变量都已添加
echo 3. 检查变量值格式是否正确
echo.
echo 关键变量检查：
echo ✓ NODE_ENV 必须是 "production"
echo ✓ OPENROUTER_API_KEY 必须以 "sk-or-v1-" 开头
echo ✓ SUPABASE_URL 必须以 "https://" 开头
echo ✓ STRIPE_SECRET_KEY 必须以 "sk_test_" 或 "sk_live_" 开头
echo.
echo 添加变量后服务会自动重启
goto :end

:deps_fix
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                 📦 依赖安装问题修复                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 问题：npm依赖安装失败
echo.
echo 检查和修复：
echo 1. 确认package.json格式正确
echo 2. 检查依赖版本兼容性
echo 3. 清除Railway缓存重新部署
echo.
echo 推荐操作：
echo 1. 在本地运行 npm install 测试
echo 2. 如果成功，提交package-lock.json
echo 3. 推送到GitHub触发重新部署
goto :end

:db_fix
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                🗄️ 数据库连接问题修复                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 问题：Supabase数据库连接失败
echo.
echo 检查步骤：
echo 1. Supabase控制台 → Settings → API
echo    验证URL和密钥是否正确
echo.
echo 2. Supabase控制台 → Settings → Database
echo    检查是否启用了"Pause after inactivity"
echo.
echo 3. 检查IP白名单设置
echo    Railway服务器IP需要被允许访问
echo.
echo 4. 验证服务角色密钥权限
echo    确保有足够的数据库操作权限
goto :end

:other_fix
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  🔍 其他问题诊断                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 通用诊断步骤：
echo.
echo 1️⃣ 查看详细日志
echo    Railway控制台 → Deployments → 最新部署 → View Logs
echo.
echo 2️⃣ 检查资源限制
echo    确认Railway账户没有达到配额限制
echo.
echo 3️⃣ 重新部署
echo    Railway控制台 → Deployments → Redeploy
echo.
echo 4️⃣ 联系支持
echo    如果问题仍然存在，联系Railway技术支持
echo.
echo 5️⃣ 本地测试
echo    在本地运行 npm start 确认代码无误
goto :end

:full_diagnosis
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                📋 完整诊断检查清单                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 请逐项检查以下内容：
echo.
echo □ 1. Railway部署日志无错误信息
echo □ 2. package.json包含正确的start脚本
echo □ 3. server.js使用process.env.PORT
echo □ 4. 所有必需环境变量已配置
echo □ 5. 环境变量值格式正确
echo □ 6. Supabase数据库可访问
echo □ 7. OpenRouter API密钥有效
echo □ 8. Stripe配置正确
echo □ 9. 本地测试运行正常
echo □ 10. Railway账户配额充足
echo.
echo 完成检查后，尝试重新部署服务
goto :end

:end
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    💡 重要提示                             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🔄 修复后的操作：
echo    1. 如果修改了代码，推送到GitHub
echo    2. 如果修改了环境变量，等待自动重启
echo    3. 检查 Deployments 标签确认重新部署成功
echo    4. 访问域名测试服务是否正常
echo.
echo 🆘 如果仍然离线：
echo    - 查看详细的部署日志
echo    - 复制错误信息并寻求技术支持
echo    - 考虑重新创建Railway项目
echo.
echo 📞 需要进一步帮助，请提供：
echo    - 部署日志中的错误信息
echo    - 当前的环境变量配置
echo    - 遇到问题的具体步骤
echo.
pause