const fs = require('fs');
const path = require('path');

console.log('🔧 Running post-build tasks...\n');

// 版本号（使用时间戳）
const version = Date.now();
const distDir = path.join(__dirname, '..', 'dist');

// 检查dist目录是否存在
if (!fs.existsSync(distDir)) {
    console.error('❌ dist directory not found!');
    process.exit(1);
}

// 查找所有HTML文件
const htmlFiles = fs.readdirSync(distDir)
    .filter(f => f.endsWith('.html'));

console.log(`📄 Found ${htmlFiles.length} HTML files\n`);

let updatedCount = 0;
htmlFiles.forEach(file => {
    const filePath = path.join(distDir, file);

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // 替换JS文件引用，添加版本参数（避免重复添加）
        const jsPattern = /<script\s+src="([^"]+\.js)(?:\?v=\d+)?"/g;
        const newContent = content.replace(jsPattern, (match, src) => {
            modified = true;
            return `<script src="${src}?v=${version}"`;
        });

        if (modified) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            updatedCount++;
            console.log(`✅ Updated ${file} with version parameters`);
        } else {
            console.log(`⚠️  No JS references found in ${file}`);
        }
    } catch (error) {
        console.error(`❌ Error updating ${file}:`, error.message);
    }
});

console.log(`\n✨ Post-build complete! Updated ${updatedCount}/${htmlFiles.length} files`);
console.log(`📦 Version: ${version}\n`);
