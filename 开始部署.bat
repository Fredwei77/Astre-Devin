@echo off
chcp 65001 >nul

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                🚀 Destiny AI Railway 部署                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo ✅ Railway CLI 已安装完成
echo 📂 当前目录已设置为项目根目录
echo.

echo 📋 请依次执行以下命令：
echo.
echo 1️⃣ 登录 Railway:
echo    railway login
echo.
echo 2️⃣ 初始化项目:
echo    railway init
echo.
echo 3️⃣ 部署项目:
echo    railway up
echo.
echo 4️⃣ 查看状态:
echo    railway status
echo    railway domain
echo.
echo 5️⃣ 配置环境变量:
echo    railway open
echo.

echo 📖 详细步骤请参考: RAILWAY_手动部署步骤.md
echo.

echo 按任意键开始...
pause >nul

echo.
echo 🚀 现在可以开始输入命令了！
echo.

cmd /k