@echo off
echo ========================================
echo Supabase 完整集成测试
echo ========================================
echo.
echo 已完成的集成:
echo [x] 所有页面已添加 Supabase 脚本
echo [x] 占卜记录保存功能
echo [x] 历史记录显示功能
echo [x] 删除和刷新功能
echo.
echo 测试步骤:
echo 1. 登录账号
echo 2. 进行一次占卜
echo 3. 保存占卜记录
echo 4. 访问个人档案查看历史记录
echo.
echo 正在启动应用...
echo.
start http://localhost:3000/login.html
timeout /t 2 /nobreak >nul
start http://localhost:3000/divination.html
timeout /t 2 /nobreak >nul
start http://localhost:3000/profile.html
node server.js
