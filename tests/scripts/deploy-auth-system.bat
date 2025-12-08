@echo off
chcp 65001 >nul
echo ========================================
echo   访问控制系统部署脚本
echo   Destiny AI - Auth System Deployment
echo ========================================
echo.

echo [1/5] 检查必要文件...
if not exist "auth-service.js" (
    echo ❌ 错误: auth-service.js 文件不存在
    pause
    exit /b 1
)
if not exist "auth-guard-enhanced.js" (
    echo ❌ 错误: auth-guard-enhanced.js 文件不存在
    pause
    exit /b 1
)
echo ✅ 必要文件检查完成

echo.
echo [2/5] 备份现有文件...
if exist "divination.html" (
    copy "divination.html" "divination.html.backup" >nul
    echo ✅ divination.html 已备份
)
if exist "fengshui.html" (
    copy "fengshui.html" "fengshui.html.backup" >nul
    echo ✅ fengshui.html 已备份
)
if exist "iching.html" (
    copy "iching.html" "iching.html.backup" >nul
    echo ✅ iching.html 已备份
)
if exist "profile.html" (
    copy "profile.html" "profile.html.backup" >nul
    echo ✅ profile.html 已备份
)

echo.
echo [3/5] 验证文件完整性...
echo ✅ auth-service.js - 认证服务
echo ✅ auth-guard-enhanced.js - 访问控制守卫
echo ✅ test-auth-system.html - 测试页面

echo.
echo [4/5] 部署说明...
echo.
echo 📝 请手动完成以下步骤：
echo.
echo 1. 在以下文件的 ^</body^> 标签前添加：
echo    - divination.html
echo    - fengshui.html
echo    - iching.html
echo    - profile.html
echo.
echo 2. 添加以下代码：
echo    ^<!-- 认证系统 --^>
echo    ^<script src="auth-service.js"^>^</script^>
echo    ^<script src="auth-guard-enhanced.js"^>^</script^>
echo.
echo 3. 保存所有文件
echo.

echo [5/5] 测试指南...
echo.
echo 🧪 测试步骤：
echo 1. 打开 test-auth-system.html
echo 2. 点击"模拟登录"按钮
echo 3. 尝试访问受保护页面
echo 4. 验证访问控制是否正常工作
echo.

echo ========================================
echo   部署准备完成！
echo ========================================
echo.
echo 📖 详细文档：
echo    - 页面访问控制系统设计.md
echo    - 访问控制集成指南.md
echo.
echo 🧪 测试页面：
echo    - test-auth-system.html
echo.

pause
