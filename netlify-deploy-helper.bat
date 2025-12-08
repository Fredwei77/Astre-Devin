@echo off
chcp 65001 >nul
echo ========================================
echo 九筮 - Netlify 部署助手
echo ========================================
echo.

echo 📋 项目信息：
echo 名称: 九筮 (Astre-Devin)
echo GitHub: https://github.com/Fredwei77/Astre-Devin
echo Netlify: https://app.netlify.com/projects/astredevin/overview
echo.

echo ========================================
echo 🚀 部署步骤
echo ========================================
echo.

echo [步骤 1] 打开 Netlify 项目页面
echo.
echo 正在打开浏览器...
start https://app.netlify.com/projects/astredevin/overview
timeout /t 3 >nul
echo ✅ 已打开 Netlify 项目页面
echo.

echo [步骤 2] 配置环境变量
echo.
echo 请在 Netlify 中添加以下环境变量：
echo.
echo ┌─────────────────────────────────────────────────────────┐
echo │ 变量 1: Stripe 可发布密钥                                │
echo ├─────────────────────────────────────────────────────────┤
echo │ Key:   VITE_STRIPE_PUBLISHABLE_KEY                      │
echo │ Value: pk_test_51SXG0rPyLPASs4oMIUPfLppXKefnEycFKqZ... │
echo └─────────────────────────────────────────────────────────┘
echo.
echo ┌─────────────────────────────────────────────────────────┐
echo │ 变量 2: Supabase URL                                     │
echo ├─────────────────────────────────────────────────────────┤
echo │ Key:   VITE_SUPABASE_URL                                │
echo │ Value: https://izkcgqvxecfxqtgxpmaj.supabase.co        │
echo └─────────────────────────────────────────────────────────┘
echo.
echo ┌─────────────────────────────────────────────────────────┐
echo │ 变量 3: Supabase Anon Key                                │
echo ├─────────────────────────────────────────────────────────┤
echo │ Key:   VITE_SUPABASE_ANON_KEY                           │
echo │ Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M... │
echo └─────────────────────────────────────────────────────────┘
echo.

echo ⚠️ 重要提示：
echo    1. 变量名必须完全一致（包括 VITE_ 前缀）
echo    2. 不要有多余的空格
echo    3. 保存后需要重新部署才能生效
echo.

echo 按任意键打开环境变量配置页面...
pause >nul

echo.
echo 正在打开环境变量配置页面...
start https://app.netlify.com/sites/astredevin/configuration/env
timeout /t 2 >nul
echo ✅ 已打开环境变量配置页面
echo.

echo [步骤 3] 部署网站
echo.
echo 配置完环境变量后：
echo 1. 点击 "Save" 保存环境变量
echo 2. 进入 "Deploys" 标签
echo 3. 点击 "Trigger deploy" → "Deploy site"
echo 4. 等待部署完成（约 1-3 分钟）
echo.

echo 按任意键打开部署页面...
pause >nul

echo.
echo 正在打开部署页面...
start https://app.netlify.com/sites/astredevin/deploys
timeout /t 2 >nul
echo ✅ 已打开部署页面
echo.

echo ========================================
echo 📚 参考文档
echo ========================================
echo.
echo 详细部署指南：
echo    NETLIFY_部署操作指南.md
echo.
echo 完整部署流程：
echo    COMPLETE_DEPLOYMENT_GUIDE.md
echo.
echo 环境变量配置：
echo    NETLIFY_DEPLOYMENT_GUIDE.md
echo.

echo 按任意键打开部署指南...
pause >nul

echo.
echo 正在打开部署指南...
start NETLIFY_部署操作指南.md
timeout /t 1 >nul
echo ✅ 已打开部署指南
echo.

echo ========================================
echo ✅ 部署检查清单
echo ========================================
echo.
echo 请确认以下步骤：
echo.
echo □ 1. GitHub 仓库已连接
echo □ 2. 构建设置已配置（Publish directory: .）
echo □ 3. 环境变量已添加（3 个）
echo □ 4. 部署已触发
echo □ 5. 部署状态显示 "Published"
echo □ 6. 网站可以访问
echo □ 7. 浏览器控制台无严重错误
echo.

echo ========================================
echo 🎯 部署后测试
echo ========================================
echo.
echo 部署完成后，访问你的网站：
echo https://astredevin.netlify.app
echo.
echo 测试以下功能：
echo ✓ 首页加载正常
echo ✓ 导航栏正常
echo ✓ 语言切换正常
echo ✓ 登录页面正常
echo ✓ Stripe 初始化成功
echo ✓ Supabase 初始化成功
echo.

echo ========================================
echo 📞 需要帮助？
echo ========================================
echo.
echo 如果遇到问题：
echo 1. 查看 Netlify 部署日志
echo 2. 检查浏览器控制台（F12）
echo 3. 参考 NETLIFY_部署操作指南.md
echo 4. 检查环境变量配置
echo.

echo ========================================
echo 🚀 下一步
echo ========================================
echo.
echo 前端部署完成后，需要部署后端服务器：
echo.
echo 1. 运行: deploy-backend.bat
echo 2. 或参考: BACKEND_DEPLOYMENT_GUIDE.md
echo.
echo 后端用于：
echo    ✓ AI 功能（占卜、易经、风水）
echo    ✓ 支付处理
echo    ✓ 用户管理
echo.

echo ========================================
echo 🎉 祝部署顺利！
echo ========================================
echo.

pause
