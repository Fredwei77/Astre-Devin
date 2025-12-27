const fs = require('fs');
const path = require('path');

console.log('🔨 Starting build process...\n');

// 版本号（使用时间戳）
const version = Date.now();
const buildTime = new Date().toISOString();

// 需要复制并添加版本的文件列表
const filesToCopy = [
    'stripe-client-enhanced.js',
    'api-config.js',
    'config.js',
    'shop-service.js',
    'payment-ui.js',
    'subscription-manager.js',
    'ai-service.js',
    'auth-service.js',
    'supabase-client.js'
];

// 确保dist目录存在
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('✅ Created dist directory');
}

// 复制文件到dist目录并添加版本号
let copiedCount = 0;
filesToCopy.forEach(file => {
    const source = path.join(__dirname, '..', file);
    const dest = path.join(distDir, file);

    // 检查源文件是否存在
    if (!fs.existsSync(source)) {
        console.log(`⚠️  Skipped ${file} (not found)`);
        return;
    }

    try {
        // 读取文件内容
        let content = fs.readFileSync(source, 'utf8');

        // 在文件开头添加版本信息
        const versionHeader = `/**
 * File: ${file}
 * Version: ${version}
 * Build Time: ${buildTime}
 * Auto-generated - Do not edit directly
 */

`;
        content = versionHeader + content;

        // 写入目标文件
        fs.writeFileSync(dest, content, 'utf8');
        copiedCount++;
        console.log(`✅ Copied ${file} (v${version})`);
    } catch (error) {
        console.error(`❌ Error copying ${file}:`, error.message);
    }
});

console.log(`\n✨ Build complete! Copied ${copiedCount}/${filesToCopy.length} files`);
console.log(`📦 Version: ${version}`);
console.log(`🕐 Build Time: ${buildTime}\n`);
