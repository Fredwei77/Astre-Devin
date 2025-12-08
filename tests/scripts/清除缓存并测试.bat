@echo off
chcp 65001 >nul
echo ========================================
echo 清除缓存并测试风水商店
echo ========================================
echo.
echo 步骤 1: 关闭所有浏览器窗口
echo 请手动关闭所有 Chrome/Edge 浏览器窗口
echo.
pause
echo.
echo 步骤 2: 启动无痕模式
echo 正在启动无痕模式浏览器...
echo.
start msedge --inprivate http://localhost:3000/fengshui.html
echo.
echo 或者使用 Chrome:
echo start chrome --incognito http://localhost:3000/fengshui.html
echo.
echo ========================================
echo 测试说明
echo ========================================
echo.
echo 1. 在无痕模式下，不会有缓存的 CSP 策略
echo 2. 登录账号: fredwei@gmail.com / test123456
echo 3. 滚动到"推荐风水物品"部分
echo 4. 点击"加入购物车"或"立即购买"
echo 5. 按钮应该可以正常工作
echo.
echo 如果还是不行，请截图控制台错误
echo.
pause
