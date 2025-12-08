@echo off
echo ========================================
echo 验证商店修复
echo Verify Shop Fix
echo ========================================
echo.
echo 正在打开风水页面...
echo.

start http://localhost:8000/fengshui.html

echo.
echo 验证清单:
echo.
echo [ ] 页面正常加载
echo [ ] 没有红色错误提示
echo [ ] 显示6个商品
echo [ ] 商品价格格式正确 ($49.99)
echo [ ] 商品图标显示正常
echo [ ] 库存信息显示
echo [ ] 购物车图标显示 0
echo [ ] 点击按钮显示友好提示
echo.
echo 如果所有项目都通过，说明修复成功！
echo.
echo 注意:
echo - 当前使用默认商品（数据库未配置）
echo - 购买功能会显示友好提示
echo - 配置数据库后可启用完整功能
echo.
echo 配置数据库步骤:
echo 1. 在 Supabase 执行 supabase-shop-schema.sql
echo 2. 在 fengshui.html 中取消注释 shop-service.js
echo 3. 刷新页面
echo.
pause
