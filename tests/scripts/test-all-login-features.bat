@echo off
chcp 65001 >nul
color 0A
cls

echo ╔══════════════════════════════════════════════════════════════╗
echo ║           登录入口优化 - 完整测试套件                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🎯 测试目标:
echo    1. 验证翻译键是否正确显示
echo    2. 验证登录按钮是否跳转到 login.html
echo    3. 验证语言切换是否正常工作
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 请选择测试方式:
echo.
echo [1] 自动化测试页面 (推荐)
echo     - 自动验证所有翻译键
echo     - 实时语言切换演示
echo     - 登录按钮行为测试
echo.
echo [2] 首页完整测试
echo     - 测试真实的首页环境
echo     - 手动验证所有功能
echo     - 完整用户体验测试
echo.
echo [3] 登录页面测试
echo     - 测试原始登录页面
echo     - 验证登录表单功能
echo     - 测试登录流程
echo.
echo [4] 查看快速指南
echo     - 显示修复内容
echo     - 查看测试清单
echo     - 了解预期结果
echo.
echo [5] 打开所有测试页面
echo     - 同时打开所有测试页面
echo     - 方便对比测试
echo.
echo [0] 退出
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
set /p choice="请输入选项 (0-5): "

if "%choice%"=="1" goto test1
if "%choice%"=="2" goto test2
if "%choice%"=="3" goto test3
if "%choice%"=="4" goto test4
if "%choice%"=="5" goto test5
if "%choice%"=="0" goto end
goto invalid

:test1
cls
echo.
echo ✅ 启动自动化测试页面...
echo.
echo 测试页面将验证:
echo   ✓ 英文、简体中文、繁体中文的翻译键
echo   ✓ 实时语言切换功能
echo   ✓ 登录按钮行为
echo.
start test-login-fix.html
timeout /t 2 >nul
echo ✅ 测试页面已打开！
echo.
echo 💡 提示:
echo    - 检查所有翻译键是否显示为 "通过"
echo    - 尝试切换语言，观察文本变化
echo    - 点击测试登录按钮，验证跳转行为
echo.
pause
goto menu

:test2
cls
echo.
echo ✅ 启动首页测试...
echo.
echo 请在首页中测试:
echo   1. 检查右上角登录按钮文本
echo   2. 切换语言选择器
echo   3. 点击登录按钮
echo   4. 验证是否跳转到 login.html
echo.
start index.html
timeout /t 2 >nul
echo ✅ 首页已打开！
echo.
echo 📋 测试清单:
echo    □ 登录按钮显示 "Login" 或 "登入"
echo    □ 不显示 "nav.login"
echo    □ 语言切换时文本更新
echo    □ 点击登录跳转到 login.html
echo    □ 不打开模态框
echo.
pause
goto menu

:test3
cls
echo.
echo ✅ 启动登录页面测试...
echo.
echo 请在登录页面中测试:
echo   1. 页面是否正常显示
echo   2. 登录表单是否可用
echo   3. 切换登录/注册标签
echo   4. 测试登录功能
echo.
start login.html
timeout /t 2 >nul
echo ✅ 登录页面已打开！
echo.
echo 📋 测试清单:
echo    □ 页面样式正常
echo    □ 表单输入正常
echo    □ 标签切换正常
echo    □ 登录功能正常
echo.
pause
goto menu

:test4
cls
echo.
echo ✅ 打开快速指南...
echo.
start 登录优化快速指南.txt
timeout /t 2 >nul
echo ✅ 快速指南已打开！
echo.
echo 📚 相关文档:
echo    - 登录优化快速指南.txt (已打开)
echo    - LOGIN_ENTRY_FIX.md (详细技术说明)
echo    - LOGIN_FIX_CHECKLIST.md (完整验证清单)
echo    - 登录入口优化完成.md (优化总结)
echo.
pause
goto menu

:test5
cls
echo.
echo ✅ 打开所有测试页面...
echo.
start test-login-fix.html
timeout /t 1 >nul
start index.html
timeout /t 1 >nul
start login.html
timeout /t 1 >nul
echo ✅ 所有测试页面已打开！
echo.
echo 💡 提示:
echo    - test-login-fix.html: 自动化测试
echo    - index.html: 首页测试
echo    - login.html: 登录页面测试
echo.
echo 建议测试顺序:
echo    1. 先查看自动化测试结果
echo    2. 然后测试首页功能
echo    3. 最后测试登录页面
echo.
pause
goto menu

:invalid
cls
echo.
echo ❌ 无效的选项！
echo.
timeout /t 2 >nul
goto menu

:menu
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║           登录入口优化 - 完整测试套件                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 请选择测试方式:
echo.
echo [1] 自动化测试页面 (推荐)
echo [2] 首页完整测试
echo [3] 登录页面测试
echo [4] 查看快速指南
echo [5] 打开所有测试页面
echo [0] 退出
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
set /p choice="请输入选项 (0-5): "

if "%choice%"=="1" goto test1
if "%choice%"=="2" goto test2
if "%choice%"=="3" goto test3
if "%choice%"=="4" goto test4
if "%choice%"=="5" goto test5
if "%choice%"=="0" goto end
goto invalid

:end
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    测试完成                                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📊 测试总结:
echo.
echo ✅ 修复内容:
echo    1. 添加了缺失的翻译键 (nav.login, nav.logout, nav.premium)
echo    2. 调整了脚本加载顺序 (translations.js 在 unified-i18n.js 之前)
echo    3. 修改了登录按钮行为 (跳转到 login.html 而不是模态框)
echo.
echo ✅ 预期结果:
echo    - 登录按钮显示 "Login" / "登入"
echo    - 点击登录跳转到 login.html
echo    - 语言切换正常工作
echo    - 用户菜单正确翻译
echo.
echo 📚 详细文档:
echo    - LOGIN_ENTRY_FIX.md
echo    - LOGIN_FIX_CHECKLIST.md
echo    - 登录入口优化完成.md
echo.
echo 感谢使用测试套件！🎉
echo.
pause
exit
