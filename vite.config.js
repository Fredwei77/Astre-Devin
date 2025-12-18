
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { globSync } from 'glob';
import path from 'path';

// 获取所有 HTML 文件
const htmlFiles = globSync('**/*.html', {
    ignore: ['node_modules/**', 'dist/**', 'public/**'],
    cwd: __dirname
});

// 构建 input 对象
const input = {};
htmlFiles.forEach(file => {
    const name = path.basename(file, '.html');
    input[name] = path.resolve(__dirname, file);
});

export default defineConfig({
    root: '.',
    publicDir: 'public',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: input
        }
    },
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
                name: 'Destiny AI',
                short_name: 'Destiny AI',
                description: 'Your AI-Powered Destiny Guide',
                theme_color: '#0d2626',
                background_color: '#0d2626',
                display: 'standalone',
                icons: [
                    {
                        src: 'resources/logo-processed.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ]
});
