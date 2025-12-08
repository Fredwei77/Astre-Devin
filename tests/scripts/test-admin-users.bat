@echo off
echo ========================================
echo 用户管理后台测试
echo Admin Users Management Test
echo ========================================
echo.
echo 正在打开用户管理后台...
echo.

start http://localhost:8000/admin-users.html

echo.
echo 测试清单:
echo.
echo [ ] 页面正常加载
echo [ ] 统计数据显示
echo [ ] 用户列表显示
echo [ ] 可以查看用户详情
echo [ ] 付费记录标签页
echo [ ] 购买记录标签页
echo [ ] 占卜记录标签页
echo.
echo 注意:
echo - 需要先配置 Supabase 数据库
echo - 执行 supabase-users-schema.sql
echo - 确保有测试用户数据
echo.
echo 配置步骤:
echo 1. Supabase Dashboard → SQL Editor
echo 2. 执行 supabase-users-schema.sql
echo 3. 刷新页面查看数据
echo.
pause
