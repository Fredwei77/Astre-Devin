// Enhanced JSON Parser for AI Responses
// 增强型JSON解析器，处理AI响应中的各种格式问题

class EnhancedJSONParser {
    /**
     * 解析AI返回的JSON响应
     * @param {string} content - AI返回的原始内容
     * @returns {object} 解析后的JSON对象
     */
    static parseAIResponse(content) {
        console.log('📝 开始解析AI响应...');

        if (!content || typeof content !== 'string') {
            throw new Error('响应内容无效');
        }

        // 记录原始内容
        console.log('AI原始响应内容:', content);
        console.log('原始内容长度:', content.length);

        // 尝试多种解析方法
        const parseMethods = [
            () => this.parseStandardJSON(content),
            () => this.parseMarkdownJSON(content),
            () => this.extractJSONBlock(content),
            () => this.parseFlexibleJSON(content),
            () => this.parseLastResort(content)
        ];

        for (let i = 0; i < parseMethods.length; i++) {
            try {
                console.log(`🔄 尝试解析方法 ${i + 1}...`);
                const result = parseMethods[i]();

                if (this.validateResult(result)) {
                    console.log(`✅ 解析方法 ${i + 1} 成功！`);
                    return result;
                }
            } catch (error) {
                console.warn(`❌ 解析方法 ${i + 1} 失败:`, error.message);
            }
        }

        throw new Error('所有JSON解析方法都失败了');
    }

    /**
     * 标准JSON解析
     */
    static parseStandardJSON(content) {
        const trimmed = content.trim();
        return JSON.parse(trimmed);
    }

    /**
     * 移除Markdown代码块标记
     */
    static parseMarkdownJSON(content) {
        let cleaned = content.trim();

        // 移除开头的```json 或 ```
        cleaned = cleaned.replace(/^```(?:json|JSON)?\s*\n?/, '');

        // 移除结尾的```
        cleaned = cleaned.replace(/\n?\s*```\s*$/, '');

        // 移除其他可能的标记
        cleaned = cleaned.replace(/^json\s*\n/, '');
        cleaned = cleaned.replace(/^\{[\s\S]*\}$/, match => match);

        return JSON.parse(cleaned.trim());
    }

    /**
     * 提取JSON代码块
     */
    static extractJSONBlock(content) {
        // 查找第一个 { 和匹配的 }
        const firstBrace = content.indexOf('{');
        if (firstBrace === -1) {
            throw new Error('找不到JSON对象开始标记');
        }

        let braceCount = 0;
        let endIndex = -1;

        for (let i = firstBrace; i < content.length; i++) {
            if (content[i] === '{') {
                braceCount++;
            } else if (content[i] === '}') {
                braceCount--;
                if (braceCount === 0) {
                    endIndex = i;
                    break;
                }
            }
        }

        if (endIndex === -1) {
            throw new Error('找不到JSON对象结束标记');
        }

        const jsonContent = content.substring(firstBrace, endIndex + 1);
        console.log('提取的JSON片段:', jsonContent.substring(0, 100) + '...');

        return JSON.parse(jsonContent);
    }

    /**
     * 灵活JSON解析（处理格式错误）
     */
    static parseFlexibleJSON(content) {
        let cleaned = content.trim();

        // 移除常见的非JSON文本
        cleaned = cleaned.replace(/^(Here's|这是|以下是|结果如下).*?[\n\r]/i, '');
        cleaned = cleaned.replace(/^(```json|```JSON|```)\s*[\n\r]?/i, '');
        cleaned = cleaned.replace(/[\n\r]?\s*(```)\s*$/i, '');

        // 处理可能的引号问题
        cleaned = cleaned.replace(/"/g, '"').replace(/"/g, '"'); // 智能引号
        cleaned = cleaned.replace(/'/g, '"'); // 单引号转双引号（在键名处）

        // 处理可能的中文冒号
        cleaned = cleaned.replace(/：/g, ':');

        // 移除注释
        cleaned = cleaned.replace(/\/\/.*$/gm, '');
        cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');

        return JSON.parse(cleaned);
    }

    /**
     * 最后手段解析
     */
    static parseLastResort(content) {
        console.log('🚨 使用最后手段解析...');

        // 尝试使用正则表达式提取JSON结构
        const jsonPattern = /\{[\s\S]*\}/;
        const match = content.match(jsonPattern);

        if (!match) {
            throw new Error('无法找到任何JSON结构');
        }

        let jsonStr = match[0];

        // 尝试修复常见的JSON错误
        jsonStr = jsonStr.replace(/,\s*}/g, '}'); // 移除尾随逗号
        jsonStr = jsonStr.replace(/,\s*]/g, ']'); // 移除数组尾随逗号

        // 尝试修复未引用的键名
        jsonStr = jsonStr.replace(/(\w+):/g, '"$1":');

        return JSON.parse(jsonStr);
    }

    /**
     * 验证解析结果
     */
    static validateResult(result) {
        if (!result || typeof result !== 'object') {
            console.warn('结果不是对象');
            return false;
        }

        // 基本验证：至少包含一些预期字段
        const commonFields = ['personality', 'career', 'elements', 'overallScore', 'hexagramName'];
        const hasValidField = commonFields.some(field => result.hasOwnProperty(field));

        if (!hasValidField) {
            console.warn('结果不包含任何预期字段');
            return false;
        }

        console.log('✅ 结果验证通过');
        return true;
    }
}

// 导出到全局
if (typeof window !== 'undefined') {
    window.EnhancedJSONParser = EnhancedJSONParser;
}

console.log('📦 增强型JSON解析器已加载');