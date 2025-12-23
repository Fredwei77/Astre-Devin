// report-export.js - 命盘分析报告导出功能模块

/**
 * 显示加载提示
 */
function showLoadingToast(message) {
    const toast = document.createElement('div');
    toast.id = 'exportLoadingToast';
    toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-mystic-gold text-deep-navy px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-3';
    toast.innerHTML = `
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-deep-navy"></div>
        <span class="font-semibold">${message}</span>
    `;
    document.body.appendChild(toast);
}

/**
 * 隐藏加载提示
 */
function hideLoadingToast() {
    const toast = document.getElementById('exportLoadingToast');
    if (toast) {
        toast.remove();
    }
}

/**
 * 显示成功提示
 */
function showSuccessToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-3';
    toast.innerHTML = `
        <span class="text-2xl">✅</span>
        <span class="font-semibold">${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/**
 * 显示错误提示
 */
function showErrorToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-3';
    toast.innerHTML = `
        <span class="text-2xl">❌</span>
        <span class="font-semibold">${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000);
}

/**
 * 处理图表显示，将 Canvas 转换为图片以供导出
 * @param {HTMLElement} original - 原始元素
 * @param {HTMLElement} clone - 克隆元素
 */
function processChartsForExport(original, clone) {
    if (typeof echarts === 'undefined') {
        console.warn('[Export] echarts 未定义，跳过图表处理');
        return;
    }

    // 查找图表容器
    const chartIds = ['birthChart', 'elementsChart'];

    chartIds.forEach(id => {
        const originalChartEl = original.querySelector(`#${id}`) || (original.id === id ? original : null);
        const cloneChartEl = clone.querySelector(`#${id}`) || (clone.id === id ? clone : null);

        if (originalChartEl && cloneChartEl) {
            try {
                const chartInstance = echarts.getInstanceByDom(originalChartEl);
                if (chartInstance) {
                    // 获取图表图片的 Data URL
                    const dataURL = chartInstance.getDataURL({
                        type: 'png',
                        pixelRatio: 2,
                        backgroundColor: 'transparent'
                    });

                    // 替换克隆元素中的内容为图片
                    cloneChartEl.innerHTML = `<img src="${dataURL}" style="width: 100%; height: auto; display: block;" />`;
                    cloneChartEl.style.height = 'auto';
                    cloneChartEl.style.background = 'transparent';
                    console.log(`[Export] 成功导出图表: ${id}`);
                } else {
                    console.warn(`[Export] 找不到图表实例: ${id}`);
                }
            } catch (err) {
                console.warn(`[Export] 无法捕获图表 ${id}:`, err);
            }
        }
    });
}

/**
 * 导出为 PDF
 * @param {string} elementId - 要导出的元素 ID
 * @param {string} filename - 文件名
 */
async function exportToPDF(elementId, filename) {
    try {
        showLoadingToast(window.i18n ? window.i18n.t('export.generating_pdf') : '正在生成 PDF...');

        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error(window.i18n ? window.i18n.t('export.error_no_content') : 'Could not find content to export');
        }

        // 克隆元素以避免修改原始 DOM
        const clone = element.cloneNode(true);

        // 处理图表（将 Canvas 转换为图片）
        processChartsForExport(element, clone);

        // 替换所有 data-i18n 属性为实际的翻译文本
        const elementsWithI18n = clone.querySelectorAll('[data-i18n]');
        elementsWithI18n.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key && window.i18n) {
                const translation = window.i18n.t(key);
                // 如果翻译成功（不等于键本身），则替换文本
                if (translation && translation !== key) {
                    el.textContent = translation;
                }
            }
        });

        // 创建临时容器并添加克隆的元素
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '1200px'; // 确保克隆容器有足够宽度
        tempContainer.appendChild(clone);
        document.body.appendChild(tempContainer);

        // 使用 html2canvas 将元素转换为 canvas
        const canvas = await html2canvas(clone, {
            scale: 2, // 提高清晰度
            useCORS: true,
            logging: false,
            backgroundColor: '#0d2626', // 使用深色背景以匹配主题并确保浅色文字可见
            allowTaint: true,
            width: 1200 // 保持一致宽度
        });

        // 移除临时容器
        document.body.removeChild(tempContainer);

        // 获取 canvas 尺寸
        const imgWidth = 210; // A4 宽度（mm）
        const pageHeight = 297; // A4 高度（mm）
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        // 创建 PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        let position = 0;
        const imgData = canvas.toDataURL('image/png');

        // 添加第一页
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // 如果内容超过一页，添加更多页
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // 保存 PDF
        pdf.save(filename);

        hideLoadingToast();
        showSuccessToast(window.i18n ? window.i18n.t('export.pdf_success') : 'PDF 导出成功！');
    } catch (error) {
        console.error('PDF 导出失败:', error);
        hideLoadingToast();
        showErrorToast(window.i18n ? window.i18n.t('export.pdf_error') : 'PDF export failed, please try again');
    }
}

/**
 * 保存为 HTML 文件
 * @param {string} elementId - 要保存的元素 ID
 * @param {string} filename - 文件名
 */
function saveAsHTML(elementId, filename) {
    try {
        showLoadingToast(window.i18n ? window.i18n.t('export.generating_html') : '正在生成网页...');

        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error(window.i18n ? window.i18n.t('export.error_no_content') : 'Could not find content to save');
        }

        // 克隆元素
        const clone = element.cloneNode(true);

        // 处理图表（将 Canvas 转换为图片）
        processChartsForExport(element, clone);

        // 替换所有 data-i18n 属性为实际的翻译文本
        const elementsWithI18n = clone.querySelectorAll('[data-i18n]');
        elementsWithI18n.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key && window.i18n) {
                const translation = window.i18n.t(key);
                // 如果翻译成功（不等于键本身），则替换文本
                if (translation && translation !== key) {
                    el.textContent = translation;
                }
            }
            // 移除 data-i18n 属性以保持 HTML 清洁
            el.removeAttribute('data-i18n');
        });

        const currentLang = window.i18n?.getCurrentLanguage() || 'en';
        const htmlLang = currentLang === 'zh-CN' ? 'zh-Hans' : (currentLang === 'zh-TW' ? 'zh-Hant' : currentLang);
        const reportTitle = window.i18n ? window.i18n.t('export.report_title') : 'Analysis Report';
        const brandName = window.i18n ? window.i18n.t('brand.name') : 'Destiny AI';

        // 创建完整的 HTML 文档
        const htmlContent = `
<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportTitle}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
            background: linear-gradient(135deg, #0d2626 0%, #1a3a3a 100%);
            color: #fafafa;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        h1, h2, h3, h4 {
            color: #ffd700;
            margin-bottom: 15px;
        }
        .text-mystic-gold {
            color: #ffd700;
        }
        .text-moon-silver {
            color: #c0c0c0;
        }
        .bg-white\\/5 {
            background: rgba(255, 255, 255, 0.05);
        }
        .rounded-lg {
            border-radius: 8px;
        }
        .p-6 {
            padding: 1.5rem;
        }
        .mb-8 {
            margin-bottom: 2rem;
        }
        .space-y-6 > * + * {
            margin-top: 1.5rem;
        }
        .grid {
            display: grid;
            gap: 1.5rem;
        }
        @media (min-width: 768px) {
            .md\\:grid-cols-2 {
                grid-template-columns: repeat(2, 1fr);
            }
            .lg\\:grid-cols-3 {
                grid-template-columns: repeat(3, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="text-center mb-8">
            <h1 style="font-size: 2.5rem; margin-bottom: 10px;">${brandName} - ${reportTitle}</h1>
            <p style="color: #c0c0c0;">${window.i18n ? window.i18n.t('export.generated_at') : 'Generated at'}：${new Date().toLocaleString(currentLang)}</p>
        </div>
        ${clone.innerHTML}
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 215, 0, 0.2); text-align: center; color: #c0c0c0; font-size: 0.9rem;">
            <p>${window.i18n ? window.i18n.t('export.footer') : 'This report was generated by Destiny AI | https://astredevin.netlify.app'}</p>
        </div>
    </div>
</body>
</html>
        `;

        // 创建 Blob 并下载
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        hideLoadingToast();
        showSuccessToast(window.i18n ? window.i18n.t('export.html_success') : '网页保存成功！');
    } catch (error) {
        console.error('HTML 保存失败:', error);
        hideLoadingToast();
        showErrorToast(window.i18n ? window.i18n.t('export.html_error') : 'Webpage save failed, please try again');
    }
}

/**
 * 重新排盘 - 占卜页面
 */
function resetDivinationReading() {
    // 隐藏结果区域
    const resultsSection = document.getElementById('resultsSection');
    const inputSection = document.getElementById('inputSection');

    if (resultsSection) resultsSection.classList.add('hidden');
    if (inputSection) inputSection.classList.remove('hidden');

    // 清空表单
    const birthDate = document.getElementById('birthDate');
    const birthTime = document.getElementById('birthTime');
    const birthPlace = document.getElementById('birthPlace');
    const gender = document.getElementById('gender');

    if (birthDate) birthDate.value = '';
    if (birthTime) birthTime.value = '';
    if (birthPlace) birthPlace.value = '';
    if (gender) gender.value = '';

    // 取消选中的类别
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('selected');
    });

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 重新排盘 - 易经页面
 */
function resetIChingReading() {
    // 隐藏结果区域
    const resultsSection = document.getElementById('resultsSection');
    const methodSection = document.getElementById('methodSection');
    const coinSection = document.getElementById('coinSection');

    if (resultsSection) resultsSection.classList.add('hidden');
    if (coinSection) coinSection.classList.add('hidden');
    if (methodSection) methodSection.classList.remove('hidden');

    // 清空问题输入
    const questionInput = document.getElementById('questionInput');
    if (questionInput) questionInput.value = '';

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 重新分析 - 风水页面
 */
function resetFengShuiAnalysis() {
    // 隐藏分析结果和所有结果容器
    const sectionsToHide = [
        'analysisResults',
        'fiveElementsSection',
        'recommendationsSection',
        'luckyItemsSection',
        'taboosSection'
    ];
    sectionsToHide.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    // 清空具体内容容器
    const containersToClear = [
        'recommendationsContainer',
        'luckyItemsList',
        'taboosList',
        'followupAnswer',
        'directionAnalysisText'
    ];
    containersToClear.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = '';
            if (id === 'followupAnswer') el.classList.add('hidden');
        }
    });

    // 清空分数显示
    const scores = ['overallScore', 'wealthScore', 'healthScore'];
    scores.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '0%';
    });

    // 清空上传的图片
    const uploadInput = document.getElementById('roomPhoto');
    if (uploadInput) uploadInput.value = '';

    // 清空预览
    const preview = document.getElementById('imagePreview');
    if (preview) preview.innerHTML = '';

    // 重置指南针 (可选，如果需要)
    // if (window.resetCompass) window.resetCompass();

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
