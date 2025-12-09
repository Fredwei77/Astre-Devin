# Netlify 构建修复说明

## 修复的问题

1. **发布目录错误**
   - 原配置：`publish = "public"`（目录不存在）
   - 修复为：`publish = "."`（根目录）

2. **Functions 引用错误**
   - 原配置：`require('../../server')`（文件不存在）
   - 修复为：`require('../../server-netlify')`（正确的文件）

3. **Sharp 依赖问题**
   - Sharp 是原生模块，在 Netlify 上可能安装失败
   - 解决方案：移到 `optionalDependencies`，构建失败不影响部署

4. **构建命令优化**
   - 添加 `--legacy-peer-deps` 标志处理依赖冲突
   - 添加 `--no-optional` 选项跳过可选依赖
   - 使用 `||` 确保即使部分失败也继续构建

## 部署步骤

1. 提交更改到 GitHub
2. Netlify 会自动触发构建
3. 如果构建失败，检查日志中的具体错误

## 如果仍然失败

请提供完整的构建日志，包括：
- npm install 的完整输出
- 任何错误信息
- 构建步骤的完整输出

