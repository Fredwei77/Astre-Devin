@echo off
chcp 65001 >nul

echo ╔══════════════════════════════════════════════════════════════╗
echo ║        🚨 Railway根本问题诊断 - 连最小版本也失败           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔥 问题严重性：连超级简化版本也无法部署
echo 💡 这表明问题不在代码，而在Railway配置或账户状态
echo.

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  🕵️ 深度诊断检查                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 请逐一检查以下关键问题：
echo.

echo 1️⃣ Railway账户状态检查
echo ════════════════════════════════════════════════════════════════
echo 在Railway控制台检查：
echo • 账户是否达到免费配额限制？
echo • 是否需要添加信用卡验证？
echo • 项目数量是否超限？
echo • 部署次数是否达到上限？
echo.

pause

echo 2️⃣ 项目配置检查
echo ════════════════════════════════════════════════════════════════
echo Railway项目页面 → Settings：
echo • Project Name: 是否包含特殊字符？
echo • Region: 选择的区域是否可用？
echo • Repository: GitHub连接是否正常？
echo • Build Settings: 是否有错误配置？
echo.

pause

echo 3️⃣ GitHub仓库检查
echo ════════════════════════════════════════════════════════════════
echo 检查GitHub仓库：
echo • 代码是否成功推送？
echo • package.json是否在根目录？
echo • 文件权限是否正确？
echo • 仓库是否为私有且Railway有权限访问？
echo.

pause

echo 4️⃣ Railway服务状态检查
echo ════════════════════════════════════════════════════════════════
echo • 检查Railway状态页面：https://status.railway.app
echo • 是否有服务中断？
echo • 你所在区域的服务是否正常？
echo.

echo 要现在打开Railway状态页面检查吗？ (Y/N)
set /p check_status=请选择: 

if /i "%check_status%"=="Y" (
    start https://status.railway.app
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   🚑 紧急解决方案                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔥 方案A: 重新创建Railway项目
echo ════════════════════════════════════════════════════════════════
echo 1. 删除当前Railway项目
echo 2. 创建全新项目
echo 3. 重新连接GitHub仓库
echo 4. 重新配置环境变量
echo.

echo 🔥 方案B: 切换到其他部署平台
echo ════════════════════════════════════════════════════════════════
echo • Vercel (推荐，专门针对Node.js)
echo • Render (Railway的直接竞争对手)
echo • Heroku (经典选择)
echo • DigitalOcean App Platform
echo.

echo 🔥 方案C: 检查Railway计费和限制
echo ════════════════════════════════════════════════════════════════
echo 1. 账户设置 → Billing
echo 2. 检查当月使用量
echo 3. 添加支付方式（如果需要）
echo 4. 升级套餐（如果免费版不够）
echo.

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  📊 收集诊断信息                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 为了更好地帮助你，请提供以下信息：
echo.
echo 🔍 Railway部署日志：
echo • 项目 → Deployments → 最新部署 → Build Logs
echo • 具体的错误信息（红色文字）
echo • 部署状态（Building, Failed, Crashed等）
echo.

echo 🔍 Railway项目信息：
echo • 项目创建时间
echo • 之前是否成功部署过？
echo • 使用的是免费还是付费套餐？
echo • 项目所在区域
echo.

echo 🔍 GitHub仓库状态：
echo • 最新提交是否包含正确文件？
echo • Railway是否有仓库访问权限？
echo.

echo 要现在打开Railway控制台收集这些信息吗？ (Y/N)
set /p open_console=请选择: 

if /i "%open_console%"=="Y" (
    echo 🌐 正在打开Railway控制台...
    start https://railway.app/dashboard
    echo.
    echo 📋 请重点查看：
    echo • Deployments标签的错误日志
    echo • Settings标签的项目配置
    echo • Usage标签的资源使用情况
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                 💡 推荐的备选方案                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🚀 Vercel部署方案（推荐）：
echo ════════════════════════════════════════════════════════════════
echo • 专门优化Node.js应用
echo • 零配置部署
echo • 免费套餐非常慷慨
echo • 优秀的开发体验
echo.

echo 要生成Vercel部署配置吗？ (Y/N)
set /p create_vercel=请选择: 

if /i "%create_vercel%"=="Y" (
    echo 📝 生成Vercel配置文件...
    
    echo {> vercel.json
    echo   "version": 2,>> vercel.json
    echo   "builds": [>> vercel.json
    echo     {>> vercel.json
    echo       "src": "server.js",>> vercel.json
    echo       "use": "@vercel/node">> vercel.json
    echo     }>> vercel.json
    echo   ],>> vercel.json
    echo   "routes": [>> vercel.json
    echo     {>> vercel.json
    echo       "src": "/(.*)",>> vercel.json
    echo       "dest": "/server.js">> vercel.json
    echo     }>> vercel.json
    echo   ]>> vercel.json
    echo }>> vercel.json
    
    echo ✅ vercel.json 配置文件已创建
    echo 💡 现在可以直接导入到Vercel部署
)

echo.
echo 🎯 下一步建议：
echo ════════════════════════════════════════════════════════════════
echo 1. 收集Railway的具体错误信息
echo 2. 如果Railway问题复杂，切换到Vercel
echo 3. 确保基础功能在新平台正常工作
echo 4. 再考虑是否回到Railway
echo.

echo 💬 请将Railway的具体错误日志发给我，我会提供精确的解决方案！
pause