# 🔧 故障排查指南

## 问题：测试页面无法工作

### 解决方案

我已经创建了多个诊断工具来帮助你：

---

## ✅ 推荐方案：使用调试页面

### 步骤1: 打开调试页面
```
http://localhost:3000/debug.html
```

或运行：
```bash
quick-start.bat
```

### 步骤2: 在调试页面中
1. 点击"检查服务器" - 确认服务器运行正常
2. 点击"检查所有端点" - 查看所有API状态
3. 点击"测试 login.html" - 测试登录页面
4. 点击"测试 test-login.html" - 测试原测试页面

### 步骤3: 查看结果
- 绿色 = 正常
- 红色 = 有问题
- 查看控制台日志了解详情

---

## 🔍 诊断工具对比

### 1. debug.html (推荐) ⭐
**地址**: http://localhost:3000/debug.html

**功能**:
- ✅ 完整的系统诊断
- ✅ 实时日志记录
- ✅ API测试工具
- ✅ 页面测试工具
- ✅ 系统信息显示

**适用场景**: 全面诊断和调试

### 2. test-simple.html
**地址**: http://localhost:3000/test-simple.html

**功能**:
- ✅ 基础功能测试
- ✅ 服务器连接测试
- ✅ API端点测试
- ✅ 简单易用

**适用场景**: 快速检查基本功能

### 3. test-login.html (原测试页面)
**地址**: http://localhost:3000/test-login.html

**功能**:
- ✅ 自动化测试套件
- ✅ 8个测试项目
- ⚠️ 可能在某些浏览器不工作

**适用场景**: 完整的自动化测试

### 4. login.html (实际登录页面)
**地址**: http://localhost:3000/login.html

**功能**:
- ✅ 真实的登录界面
- ✅ 注册功能
- ✅ 密码强度检查
- ✅ 完整的用户体验

**适用场景**: 手动测试登录功能

---

## 🐛 常见问题

### 问题1: 页面显示空白

**可能原因**:
- JavaScript错误
- CSS未加载
- 浏览器缓存问题

**解决方案**:
1. 打开浏览器开发者工具 (F12)
2. 查看Console标签页
3. 查看Network标签页
4. 清除缓存并硬刷新 (Ctrl+Shift+R)

### 问题2: API请求失败

**可能原因**:
- 服务器未运行
- 端口被占用
- 防火墙阻止

**解决方案**:
1. 检查服务器是否运行
   ```powershell
   curl http://localhost:3000/api/health
   ```
2. 如果失败，重启服务器
   ```bash
   node server-test.js
   ```

### 问题3: 样式显示异常

**可能原因**:
- CSS文件未加载
- 浏览器兼容性
- 缓存问题

**解决方案**:
1. 检查Network标签页的CSS请求
2. 清除浏览器缓存
3. 使用最新版浏览器

### 问题4: 测试无法运行

**可能原因**:
- JavaScript兼容性
- 浏览器版本过旧
- 扩展程序干扰

**解决方案**:
1. 使用 debug.html 替代
2. 更新浏览器到最新版
3. 禁用浏览器扩展
4. 使用无痕模式

---

## 📊 诊断流程

### 第一步：基础检查
```powershell
# 检查服务器
curl http://localhost:3000/api/health

# 应该返回: {"status":"ok","mode":"test","timestamp":"..."}
```

### 第二步：打开调试页面
```
http://localhost:3000/debug.html
```

### 第三步：运行诊断
1. 点击"检查服务器"
2. 点击"检查所有端点"
3. 查看结果

### 第四步：测试页面
1. 点击"测试 login.html"
2. 点击"测试 test-login.html"
3. 如果失败，查看错误信息

### 第五步：查看日志
1. 在调试页面查看控制台日志
2. 在浏览器按F12查看Console
3. 查看服务器控制台输出

---

## 🔄 重启服务器

如果需要重启服务器：

### 方法1: 使用Ctrl+C
1. 在服务器控制台按 Ctrl+C
2. 运行 `node server-test.js`

### 方法2: 使用启动脚本
```bash
start.bat
```

---

## 🌐 浏览器要求

### 推荐浏览器
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

### 不推荐
- ❌ IE 11 及更早版本
- ❌ 过旧的浏览器版本

---

## 📝 检查清单

完成以下检查：

### 服务器
- [ ] 服务器正在运行
- [ ] 端口3000可访问
- [ ] API返回正常响应

### 浏览器
- [ ] 使用最新版浏览器
- [ ] JavaScript已启用
- [ ] Cookie已启用
- [ ] 无广告拦截器干扰

### 网络
- [ ] 可以访问 localhost
- [ ] 防火墙未阻止
- [ ] 代理设置正确

### 文件
- [ ] debug.html 存在
- [ ] test-simple.html 存在
- [ ] login.html 存在
- [ ] login.js 存在

---

## 🎯 快速测试命令

### 测试服务器
```powershell
curl http://localhost:3000/api/health
```

### 测试CSRF
```powershell
curl http://localhost:3000/api/csrf-token
```

### 测试登录
```powershell
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

---

## 💡 最佳实践

### 1. 始终使用调试页面
- 最全面的诊断工具
- 实时日志记录
- 一键测试所有功能

### 2. 检查浏览器控制台
- 按F12打开开发者工具
- 查看Console标签页
- 查看Network标签页

### 3. 查看服务器日志
- 服务器控制台显示所有请求
- 可以看到错误和警告
- 帮助定位问题

### 4. 使用无痕模式
- 避免缓存问题
- 避免扩展干扰
- 干净的测试环境

---

## 📞 仍然有问题？

### 收集信息
1. 浏览器版本
2. 操作系统
3. 错误消息
4. 浏览器控制台截图
5. 服务器日志

### 查看文档
- `STATUS_REPORT.md` - 系统状态
- `README_SETUP.md` - 设置指南
- `QUICK_TEST_GUIDE.md` - 测试指南

### 使用工具
- **调试页面**: http://localhost:3000/debug.html
- **简单测试**: http://localhost:3000/test-simple.html
- **登录页面**: http://localhost:3000/login.html

---

## ✅ 成功标志

当你看到以下情况，说明系统正常：

1. ✅ debug.html 可以打开
2. ✅ "检查服务器" 显示绿色OK
3. ✅ "检查所有端点" 全部显示200
4. ✅ login.html 可以正常显示
5. ✅ 可以使用测试账户登录

---

**推荐操作**: 立即访问 http://localhost:3000/debug.html 进行诊断

**测试账户**: test@example.com / password123

**服务器**: http://localhost:3000
