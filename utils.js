/**
 * Destiny AI - Utilities
 * 轻量级工具函数库
 */

window.MarkdownFormatter = {
    /**
     * 将基础 Markdown 文本解析为 HTML
     * @param {string} text 
     * @returns {string}
     */
    parse: function (text) {
        if (!text) return '';

        let html = text;

        // 1. 处理换行符 (预处理)
        html = html.replace(/\r\n/g, '\n');

        // 2. 代码块 (```code```)
        html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-black/40 p-3 rounded-lg my-4 overflow-x-auto border border-mystic-gold/20"><code class="text-xs text-moon-silver">$1</code></pre>');

        // 3. 标题 (### Header)
        html = html.replace(/^### (.*$)/gim, '<h3 class="text-mystic-gold font-bold mt-4 mb-2">$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2 class="text-mystic-gold font-bold mt-5 mb-3 border-b border-mystic-gold/20 pb-1">$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1 class="text-mystic-gold font-bold mt-6 mb-4 text-xl">$1</h1>');

        // 4. 加粗 (**text**)
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-mystic-gold-light font-semibold">$1</strong>');

        // 5. 水平线 (---)
        html = html.replace(/^---$/gim, '<hr class="my-6 border-0 h-px bg-gradient-to-r from-transparent via-mystic-gold/30 to-transparent">');

        // 6. 引用 (> text)
        html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-mystic-gold/40 pl-4 py-1 my-4 italic text-text-secondary bg-mystic-gold/5">$1</blockquote>');

        // 7. 无序列表 (- text)
        const lines = html.split('\n');
        let inList = false;
        let formattedLines = [];

        for (let line of lines) {
            const listMatch = line.match(/^[-*] (.*)/);
            if (listMatch) {
                if (!inList) {
                    formattedLines.push('<ul class="list-disc list-inside space-y-1 my-3 pl-2">');
                    inList = true;
                }
                formattedLines.push(`<li class="text-moon-silver"><span class="ml-1">${listMatch[1]}</span></li>`);
            } else {
                if (inList) {
                    formattedLines.push('</ul>');
                    inList = false;
                }
                formattedLines.push(line);
            }
        }
        if (inList) formattedLines.push('</ul>');
        html = formattedLines.join('\n');

        // 8. 处理双换行符转为段落，单换行符转为 <br>
        html = html.replace(/\n\n/g, '</p><p class="mb-3">');
        html = html.replace(/\n/g, '<br>');

        // 包裹在一个容器中
        return `<div class="ai-response-container text-sm leading-relaxed">${html}</div>`;
    }
};

/**
 * 打字机效果工具类
 */
window.TypingEffect = {
    /**
     * 在目标元素中应用打字机效果呈现 HTML 内容
     * @param {HTMLElement} element - 目标 DOM 元素
     * @param {string} htmlContent - 要显示的 HTML 内容
     * @param {number} speed - 打字速度 (ms/char)
     * @returns {Promise}
     */
    type: async function (element, htmlContent, speed = 20) {
        return new Promise((resolve) => {
            element.innerHTML = '';
            let currentHtml = '';
            let i = 0;

            // 为了处理 HTML 标签，我们不能简单的逐个字符显示
            // 简单方案：先整体解析，再按 DOM 节点或可见字符逐步显示
            // 临时方案：直接分块写入，模拟打字感 (适合风水长文本)

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            const nodes = Array.from(tempDiv.childNodes);

            let nodeIndex = 0;

            const typeNode = () => {
                if (nodeIndex >= nodes.length) {
                    resolve();
                    return;
                }

                const node = nodes[nodeIndex];
                element.appendChild(node.cloneNode(true));
                nodeIndex++;

                // 滚动到底部（如果需要）
                const container = element.closest('.overflow-y-auto') || element.parentElement;
                if (container && container.scrollHeight > container.clientHeight) {
                    container.scrollTop = container.scrollHeight;
                }

                setTimeout(typeNode, speed * 2);
            };

            typeNode();
        });
    }
};
