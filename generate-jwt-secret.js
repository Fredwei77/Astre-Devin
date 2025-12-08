#!/usr/bin/env node

/**
 * JWT Secret 生成器
 * 生成安全的随机密钥用于 JWT 签名
 */

const crypto = require('crypto');

console.log('========================================');
console.log('JWT Secret 生成器');
console.log('========================================');
console.log('');

// 生成 64 字节的随机密钥
const secret = crypto.randomBytes(64).toString('hex');

console.log('✅ JWT Secret 已生成：');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(secret);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

console.log('📋 使用方法：');
console.log('');
console.log('1. 本地开发 (.env 文件)：');
console.log(`   JWT_SECRET=${secret}`);
console.log('');
console.log('2. Railway 部署：');
console.log('   - 访问 Railway Dashboard');
console.log('   - Variables 标签');
console.log('   - 添加变量：');
console.log('     Key: JWT_SECRET');
console.log(`     Value: ${secret}`);
console.log('');
console.log('3. Render 部署：');
console.log('   - 访问 Render Dashboard');
console.log('   - Environment 标签');
console.log('   - 添加环境变量：');
console.log('     Key: JWT_SECRET');
console.log(`     Value: ${secret}`);
console.log('');

console.log('⚠️ 安全提示：');
console.log('   - 不要分享此密钥');
console.log('   - 不要提交到 Git');
console.log('   - 定期更换密钥');
console.log('   - 每个环境使用不同密钥');
console.log('');

console.log('✅ 密钥已复制到剪贴板（如果支持）');
console.log('');

// 尝试复制到剪贴板（Windows）
if (process.platform === 'win32') {
    try {
        const { exec } = require('child_process');
        exec(`echo ${secret} | clip`, (error) => {
            if (!error) {
                console.log('✅ 密钥已复制到剪贴板');
            }
        });
    } catch (e) {
        // 忽略错误
    }
}

console.log('========================================');
