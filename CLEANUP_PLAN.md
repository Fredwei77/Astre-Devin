# 项目清理计划

## 清理目标
清理多余的测试文件、重复文档和临时脚本，保持项目结构清晰，同时确保生产代码安全。

---

## 📁 建议的文件夹结构

```
destiny-ai/
├── docs/                    # 所有文档归档到这里
│   ├── setup/              # 设置指南
│   ├── features/           # 功能说明
│   ├── fixes/              # 修复报告
│   └── guides/             # 使用指南
├── tests/                   # 所有测试文件移到这里
│   ├── html/               # 测试HTML页面
│   ├── scripts/            # 测试脚本
│   └── archived/           # 已完成的测试
├── src/                     # 源代码（可选重构）
├── public/                  # 公共资源
└── [核心文件保留在根目录]
```

---

## ✅ 保留的核心文件（生产代码）

### HTML页面（用户界面）
- index.html
- login.html
- divination.html
- fengshui.html
- iching.html
- profile.html
- payment.html
- terms.html
- privacy.html
- admin-shop.html
- admin-users.html

### JavaScript核心文件
- main.js
- config.js
- translations.js
- unified-i18n.js
- i18n.js
- ai-service.js
- auth-service.js
- auth-guard.js
- auth-guard-enhanced.js
- header-auth.js
- user-menu.js
- shop-service.js
- shop-ui.js
- shop-ui-i18n.js
- payment-ui.js
- stripe-api.js
- stripe-client.js
- supabase-client.js
- supabase-init.js
- divination-followup.js
- fengshui-ai.js
- fengshui-followup.js
- iching-ai.js
- profile-readings.js
- cookie-consent.js
- admin-shop.js
- admin-users.js
- tmp_rovodev_divination_fix.js
- tmp_rovodev_json_parser.js

### CSS样式文件
- mystical-theme.css
- login.css
- user-menu.css
- cookie-consent.css
- date-format.css
- tooltip.css

### 配置文件
- package.json
- package-lock.json
- .env.example
- .gitignore
- stripe-config.json

### SQL数据库文件
- supabase-complete-setup.sql
- supabase-all-tables.sql
- supabase-schema.sql
- supabase-shop-schema.sql
- supabase-users-schema.sql

### 服务器文件
- server.js

### 重要文档（保留在根目录）
- README.md
- INSTALLATION.md
- DEPLOYMENT_CHECKLIST.md

---

## 🗑️ 建议删除的文件

### 临时测试HTML文件（60+个）
```
test-*.html (所有test开头的HTML)
debug-*.html (所有debug开头的HTML)
diagnose-*.html
fix-*.html
verify-*.html
simple-test.html
particle-snippet.html
setup-guide.html
tmp_rovodev_*.html
```

**原因**: 这些是开发过程中的临时测试页面，生产环境不需要

### 测试批处理脚本（40+个）
```
test-*.bat
debug-*.bat
diagnose-*.bat
verify-*.bat
fix-*.bat
deploy-*.bat
setup-*.bat
start-*.bat (除了start.bat)
restart-*.bat
清除缓存并测试.bat
快速验证下拉菜单.bat
立即测试修复.bat
```

**原因**: 开发测试脚本，生产环境不需要

### 备份文件
```
*.backup
*.backup2
login.html.backup
login.js.backup
login.css.backup
translations.js.backup
translations.js.backup2
shop-ui.js.backup
language-switcher-*.js.backup
```

**原因**: 已有版本控制，不需要手动备份

### 重复/过时的JS文件
```
console-fix.js (调试用)
fix-translations.js (临时修复)
fix-shop-price.js (临时修复)
integrate-supabase-to-login.js (集成脚本，已完成)
update-theme-helper.js (临时工具)
user-menu-final-fix.js (已集成到user-menu.js)
fengshui-ai-fixed.js (已集成到fengshui-ai.js)
fengshui-followup-fixed.js (已集成到fengshui-followup.js)
shop-ui-fixed.js (已集成到shop-ui.js)
shop-ui-multilang.js (已集成到shop-ui-i18n.js)
login-optimized.js (已集成到login.js)
验证翻译.js (测试用)
setup-stripe-products.js (一次性设置脚本)
server-test.js (测试用)
api-config.js (如果未使用)
```

**原因**: 功能已集成到主文件或仅用于一次性设置

---

## 📦 建议归档到docs/的文档（100+个）

### 设置指南 → docs/setup/
```
INSTALLATION.md
SETUP_COMPLETE.md
SUPABASE_SETUP.md
SUPABASE_重新配置指南.md
项目设置完整指南.md
快速设置指南.txt
setup-supabase.bat
setup-supabase.html
```

### 功能说明 → docs/features/
```
AI_INTEGRATION_GUIDE.md
BACKGROUND_MUSIC_IMPLEMENTATION.md
易经常见问题功能说明.md
易经AI追问功能说明.md
占卜追问功能说明.md
风水追问功能说明.md
电商功能实施完成.md
用户管理系统实施报告.md
访问控制系统实施方案.md
页面访问控制系统设计.md
```

### 修复报告 → docs/fixes/
```
所有包含"修复"、"Fix"、"完成"的.md文件
登录页面翻译修复完成.md
Login_Translation_Fix_Complete.md
占卜翻译最终修复完成.md
Divination_Translation_Fix_Complete.md
风水翻译完全修复完成.md
AI翻译修复总结.md
STRIPE_PAYMENT_FIX_COMPLETE.md
LOGIN_OPTIMIZATION_COMPLETE.md
等等...（约50个文件）
```

### 快速参考 → docs/guides/
```
所有.txt快速参考文件
登录翻译快速参考.txt
占卜翻译快速参考.txt
风水翻译快速参考.txt
商店功能快速参考.txt
用户管理快速参考.txt
Stripe支付快速参考.txt
等等...（约20个文件）
```

### 其他文档 → docs/
```
TROUBLESHOOTING.md
STATUS_REPORT.md
TEST_REPORT.md
MODEL_COMPARISON.md
FINAL_SUMMARY.md
ALL_CHANGES_SUMMARY.md
code_review_report.md
design.md
outline.md
interaction.md
project_overview.md
文件索引.md
```

---

## 🔧 保留但需要整理的文件

### 启动脚本（保留在根目录）
- start.bat - 主启动脚本
- quick-start.bat - 快速启动（可考虑合并到start.bat）
- open-test.bat - 开发测试用（可移到tests/）

### 重要的README（保留在根目录）
- README.md - 主文档
- INSTALLATION.md - 安装指南
- DEPLOYMENT_CHECKLIST.md - 部署清单

---

## 📋 执行步骤

### 第一阶段：创建文件夹结构
```bash
mkdir docs
mkdir docs/setup
mkdir docs/features
mkdir docs/fixes
mkdir docs/guides
mkdir tests
mkdir tests/html
mkdir tests/scripts
mkdir tests/archived
```

### 第二阶段：移动文档
1. 移动设置文档到 docs/setup/
2. 移动功能说明到 docs/features/
3. 移动修复报告到 docs/fixes/
4. 移动快速参考到 docs/guides/

### 第三阶段：移动测试文件
1. 移动所有test-*.html到 tests/html/
2. 移动所有test-*.bat到 tests/scripts/
3. 移动debug/diagnose文件到 tests/archived/

### 第四阶段：删除文件
1. 删除所有.backup文件
2. 删除重复的JS文件
3. 删除临时修复脚本

### 第五阶段：更新引用
1. 检查并更新文档中的文件路径引用
2. 更新.gitignore
3. 更新README.md中的文档链接

---

## ⚠️ 安全检查清单

在执行删除前，请确认：
- [ ] 所有生产HTML页面都在保留列表中
- [ ] 所有核心JS文件都在保留列表中
- [ ] 所有CSS文件都在保留列表中
- [ ] 数据库SQL文件都已保留
- [ ] 配置文件都已保留
- [ ] 重要文档已归档而非删除
- [ ] 已创建Git提交点（可回滚）

---

## 📊 预期结果

### 清理前
- 总文件数：~300个
- 根目录文件：~250个
- 文档散乱，难以查找

### 清理后
- 根目录文件：~50个（核心代码）
- docs/文件：~100个（有组织的文档）
- tests/文件：~100个（测试代码）
- 结构清晰，易于维护

---

## 🎯 下一步行动

**请确认以下问题：**

1. ✅ 是否同意删除所有test-*.html和test-*.bat文件？
2. ✅ 是否同意删除所有.backup文件？
3. ✅ 是否同意将文档移动到docs/文件夹？
4. ✅ 是否同意删除已集成的重复JS文件？
5. ⚠️ 是否有特定的测试文件需要保留？
6. ⚠️ 是否有特定的文档需要保留在根目录？

**确认后，我将：**
1. 创建文件夹结构
2. 移动文档到相应文件夹
3. 删除确认的文件
4. 更新README.md
5. 创建清理报告

---

## 💡 建议

1. **在清理前创建Git提交**：确保可以回滚
2. **分阶段执行**：先移动，后删除
3. **保留一个月**：将删除的文件先移到archived/文件夹，一个月后再永久删除
4. **更新文档**：清理后更新README.md和INSTALLATION.md

---

**准备好开始清理了吗？请确认或提出修改建议。**
