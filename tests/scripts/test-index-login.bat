@echo off
echo ========================================
echo 首页登录入口测试
echo ========================================
echo.
echo 正在启动首页...
echo.
start index.html
echo.
echo 首页已打开！
echo.
echo 请测试以下内容:
echo.
echo 1. 检查右上角登录按钮
echo    - 应该显示 "Login" (英文) 或 "登入" (中文)
echo    - 不应该显示 "nav.login"
echo.
echo 2. 切换语言
echo    - 选择不同语言
echo    - 登录按钮文本应该相应改变
echo.
echo 3. 点击登录按钮
echo    - 应该跳转到 login.html 页面
echo    - 不应该打开模态框
echo.
echo 4. 登录后测试用户菜单
echo    - 点击用户头像
echo    - 检查 "会员服务" 和 "退出登入" 的显示
echo.
pause
