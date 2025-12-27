const fs = require('fs');
const path = require('path');

console.log('🔍 Checking file versions...\n');

const files = [
    'stripe-client-enhanced.js',
    'api-config.js',
    'config.js',
    'shop-service.js',
    'payment-ui.js',
    'subscription-manager.js'
];

files.forEach(file => {
    const filePath = path.join(__dirname, '..', file);

    if (!fs.existsSync(filePath)) {
        console.log(`❌ ${file}: Not found`);
        return;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const versionMatch = content.match(/Version:\s*(\d+)/);
        const buildMatch = content.match(/Build Time:\s*([^\n]+)/);

        console.log(`📄 ${file}:`);
        console.log(`   Version: ${versionMatch ? versionMatch[1] : 'N/A'}`);
        console.log(`   Build: ${buildMatch ? buildMatch[1].trim() : 'N/A'}`);
        console.log('');
    } catch (error) {
        console.error(`❌ Error reading ${file}:`, error.message);
    }
});
