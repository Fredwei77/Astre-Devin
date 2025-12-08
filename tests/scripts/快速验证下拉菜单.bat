@echo off
chcp 65001 >nul
echo ========================================
echo   下拉菜单快速验证
echo   Dropdown Menu Quick Verification
echo ========================================
echo.

echo [验证步骤]
echo.
echo 1️⃣  清除浏览器缓存
echo    按 Ctrl + F5 强制刷新页面
echo.
echo 2️⃣  打开浏览器控制台
echo    按 F12 打开开发者工具
echo.
echo 3️⃣  运行模拟登录代码
echo    复制以下代码到控制台：
echo.
echo    const testUser = {
echo        email: 'test@destinyai.com',
echo        name: '测试用户',
echo        id: '12345'
echo    };
echo    localStorage.setItem('destinyai_token', 'test_token_123'^);
echo    localStorage.setItem('destinyai_user', JSON.stringify(testUser)^);
echo    location.reload(^);
echo.
echo 4️⃣  验证效果
echo    ✅ 用户头像显示
echo    ✅ 用户名显示
echo    ✅ 下拉箭头显示
echo    ✅ 点击箭头展开菜单
echo    ✅ 菜单显示完整
echo.
echo 5️⃣  测试翻译
echo    切换语言查看翻译是否正确
echo.
echo ========================================
echo   预期效果
echo ========================================
echo.
echo 简体中文：
echo   - 个人信息
echo   - 我的占卜
echo   - 会员升级
echo   - 设置
echo   - 退出登录
echo.
echo English:
echo   - Profile
echo   - My Readings
echo   - Upgrade
echo   - Settings
echo   - Logout
echo.
echo ========================================
echo.

echo 按任意键打开测试页面...
pause >nul

start index.html

echo.
echo ✅ 页面已打开
echo.
echo 📝 请按照上述步骤进行验证
echo.
echo 📚 相关文档：
echo    - 下拉菜单最终修复报告.md
echo    - 用户菜单修复指南.md
echo.

pause
