@echo off
chcp 65001 >nul

echo ╔══════════════════════════════════════════════════════════════╗
echo ║              🔐 Railway 登录解决方案                       ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 由于遇到登录问题，请按以下方法解决：
echo.

echo 方法一：手动命令行登录
echo ========================
echo 1. 按 Win+R 打开运行对话框
echo 2. 输入 cmd 按回车
echo 3. 输入命令: cd "C:\Users\user\Desktop\Destiny AI"
echo 4. 输入命令: railway login --browserless
echo 5. 复制显示的链接到浏览器中登录
echo 6. 登录成功后返回命令行继续部署
echo.

echo 方法二：使用PowerShell
echo ===================
echo 1. 按 Win+X 选择 "Windows PowerShell (管理员)"
echo 2. 输入命令: cd "C:\Users\user\Desktop\Destiny AI"
echo 3. 输入命令: railway login
echo 4. 如果浏览器打开失败，使用: railway login --browserless
echo 5. 按提示完成登录
echo.

echo 方法三：替代部署方式 (GitHub + Railway)
echo ====================================
echo 如果直接登录仍有问题，可以使用以下方式：
echo 1. 将代码推送到 GitHub
echo 2. 在 Railway 网站上连接 GitHub 仓库
echo 3. 自动部署
echo.

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   推荐：使用网页版部署                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🌐 最简单的方法是使用 Railway 网页版：
echo.
echo 1. 访问: https://railway.app/new
echo 2. 选择 "Deploy from GitHub repo"
echo 3. 连接你的 GitHub 账户
echo 4. 选择或创建包含项目代码的仓库
echo 5. 自动检测并部署
echo.

echo 要现在打开 Railway 网站进行网页版部署吗？ (Y/N)
set /p choice=请选择: 

if /i "%choice%"=="Y" (
    echo 🌐 正在打开 Railway 网站...
    start https://railway.app/new
    echo.
    echo 💡 网站已打开，请按照上述步骤进行部署
    echo 📝 别忘了上传代码到 GitHub 仓库
) else (
    echo 💡 你可以稍后访问 https://railway.app/new 进行部署
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  如果选择 CLI 部署                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 请打开新的命令提示符窗口，然后运行：
echo.
echo cd "C:\Users\user\Desktop\Destiny AI"
echo railway login --browserless
echo.
echo 登录成功后继续：
echo railway init
echo railway up
echo.

pause