// Netlify 构建脚本
// 为静态网站创建发布目录结构

const fs = require('fs');
const path = require('path');

console.log('开始构建...');

// 创建 public 目录（如果不存在）
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('✅ 创建 public 目录');
}

// 需要复制的文件和目录
const filesToCopy = [
  'index.html',
  'about.html',
  'login.html',
  'profile.html',
  'divination.html',
  'fengshui.html',
  'iching.html',
  'payment.html',
  'terms.html',
  'privacy.html',
  'admin-shop.html',
  'admin-users.html',
  'setup-supabase.html',
  'deployment-test.html',
  'deployment-test-page.html',
  'test-premium-payment.html',
  'payment-status-checker.html',
  'test-language-sync.html',
  'fix-dropdown-complete.html',
];

const dirsToCopy = [
  'resources',
  'css',
  'Music',
];

// 复制文件
filesToCopy.forEach(file => {
  const srcPath = path.join(__dirname, file);
  const destPath = path.join(publicDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ 复制文件: ${file}`);
  }
});

// 复制目录
dirsToCopy.forEach(dir => {
  const srcPath = path.join(__dirname, dir);
  const destPath = path.join(publicDir, dir);
  
  if (fs.existsSync(srcPath)) {
    copyDir(srcPath, destPath);
    console.log(`✅ 复制目录: ${dir}`);
  }
});

// 复制所有 JS 文件
const jsFiles = fs.readdirSync(__dirname).filter(file => 
  file.endsWith('.js') && 
  !file.startsWith('build') && 
  !file.startsWith('server') &&
  !file.startsWith('generate')
);

jsFiles.forEach(file => {
  const srcPath = path.join(__dirname, file);
  const destPath = path.join(publicDir, file);
  fs.copyFileSync(srcPath, destPath);
  console.log(`✅ 复制JS文件: ${file}`);
});

// 复制所有 CSS 文件
const cssFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.css'));
cssFiles.forEach(file => {
  const srcPath = path.join(__dirname, file);
  const destPath = path.join(publicDir, file);
  fs.copyFileSync(srcPath, destPath);
  console.log(`✅ 复制CSS文件: ${file}`);
});

console.log('✅ 构建完成！');

// 辅助函数：递归复制目录
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

