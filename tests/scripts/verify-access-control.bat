@echo off
chcp 65001 >nul
echo ========================================
echo   访问控制系统验证脚本
echo   Destiny AI - Access Control Verification
echo ========================================
echo.

echo [1/4] 检查认证脚本文件...
if not exist "auth-service.js" (
    echo ❌ 错误: auth-service.js 文件不存在
    pause
    exit /b 1
)
echo ✅ auth-service.js 存在

if not exist "auth-guard-enhanced.js" (
    echo ❌ 错误: auth-guard-enhanced.js 文件不存在
    pause
    exit /b 1
)
echo ✅ auth-guard-enhanced.js 存在

echo.
echo [2/4] 检查受保护页面...
set "pages=divination.html fengshui.html iching.html profile.html"
for %%p in (%pages%) do (
    if exist "%%p" (
        findstr /C:"auth-service.js" "%%p" >nul
        if errorlevel 1 (
            echo ❌ %%p 缺少认证脚本
        ) else (
            echo ✅ %%p 已添加认证脚本
        )
    ) else (
        echo ⚠️  %%p 文件不存在
    )
)

echo.
echo [3/4] 检查测试文件...
if exist "test-access-control.html" (
    echo ✅ test-access-control.html 存在
) else (
    echo ⚠️  test-access-control.html 不存在
)

if exist "test-auth-system.html" (
    echo ✅ test-auth-system.html 存在
) else (
    echo ⚠️  test-auth-system.html 不存在
)

echo.
echo [4/4] 验证说明
echo.
echo ========================================
echo   验证步骤
echo ========================================
echo.
echo 1️⃣  打开测试页面
echo    - test-access-control.html （简化版）
echo    - test-auth-system.html （完整版）
echo.
echo 2️⃣  清除登录状态
echo    - 点击"清除登录状态"按钮
echo    - 或清除浏览器 localStorage
echo.
echo 3️⃣  测试未登录拦截
echo    - 访问 divination.html
echo    - 应显示登录提示弹窗
echo    - 页面内容应被遮罩
echo.
echo 4️⃣  测试登录后访问
echo    - 点击"模拟登录"按钮
echo    - 再次访问受保护页面
echo    - 应正常显示内容
echo.
echo 5️⃣  测试登出后拦截
echo    - 点击"清除登录状态"
echo    - 刷新受保护页面
echo    - 应再次显示登录提示
echo.
echo ========================================
echo   快速测试
echo ========================================
echo.
echo 按任意键打开测试页面...
pause >nul

start test-access-control.html

echo.
echo ✅ 测试页面已打开
echo.
echo 📝 请按照页面上的说明进行测试
echo.
echo 📚 详细文档：
echo    - 访问控制验证指南.md
echo    - 页面访问控制系统设计.md
echo.

pause
