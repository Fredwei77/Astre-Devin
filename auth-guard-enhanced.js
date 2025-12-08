// ============================================
// ENHANCED AUTHENTICATION GUARD - 增强版页面访问控制
// ============================================

(function() {
    'use strict';
    
    // 配置：需要登录才能访问的页面
    const PROTECTED_PAGES = [
        'divination.html',
        'fengshui.html',
        'iching.html',
        'profile.html'
    ];
    
    // 配置：公开页面（无需登录）
    const PUBLIC_PAGES = [
        'index.html',
        'login.html',
        'payment.html',
        'terms.html',
        'privacy.html'
    ];
    
    // 配置选项
    const CONFIG = {
        loginPage: 'login.html',
        homePage: 'index.html',
        enableLogging: true,
        showPrompt: true,
        autoRedirect: false, // 是否自动重定向（false则显示提示框）
        redirectDelay: 3000 // 自动重定向延迟（毫秒）
    };
    
    // 日志函数
    function log(message, data = null) {
        if (CONFIG.enableLogging) {
            console.log(`[Auth Guard Enhanced] ${message}`, data || '');
        }
    }
    
    // 检查用户是否已登录
    function isUserLoggedIn() {
        const token = localStorage.getItem('destinyai_token') || sessionStorage.getItem('destinyai_token');
        const userData = localStorage.getItem('destinyai_user') || sessionStorage.getItem('destinyai_user');
        
        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                
                // 验证用户数据完整性
                if (!user.email) {
                    log('Invalid user data: missing email');
                    clearInvalidSession();
                    return { loggedIn: false, user: null };
                }
                
                return { loggedIn: true, user: user, token: token };
            } catch (error) {
                log('Error parsing user data:', error);
                clearInvalidSession();
                return { loggedIn: false, user: null };
            }
        }
        
        return { loggedIn: false, user: null };
    }
    
    // 清除无效的会话数据
    function clearInvalidSession() {
        localStorage.removeItem('destinyai_user');
        localStorage.removeItem('destinyai_token');
        sessionStorage.removeItem('destinyai_user');
        sessionStorage.removeItem('destinyai_token');
        log('Invalid session cleared');
    }
    
    // 获取当前页面文件名
    function getCurrentPage() {
        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
        return page;
    }
    
    // 检查当前页面是否需要登录
    function isProtectedPage(page) {
        return PROTECTED_PAGES.includes(page);
    }
    
    // 检查是否为公开页面
    function isPublicPage(page) {
        return PUBLIC_PAGES.includes(page);
    }
    
    // 保存返回URL
    function saveReturnUrl(url) {
        sessionStorage.setItem('destinyai_return_url', url);
        log('Return URL saved:', url);
    }
    
    // 重定向到登录页面
    function redirectToLogin(returnUrl) {
        log('Redirecting to login page...');
        
        // 保存返回 URL
        saveReturnUrl(returnUrl);
        
        // 显示提示消息
        const message = encodeURIComponent('请先登录以访问此功能');
        window.location.href = `${CONFIG.loginPage}?message=${message}&return=${encodeURIComponent(returnUrl)}`;
    }
    
    // 显示未登录提示（增强版）
    function showLoginPrompt(currentPage) {
        // 检查是否已存在提示框
        if (document.getElementById('authGuardOverlay')) {
            return;
        }
        
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'authGuardOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-in-out;
        `;
        
        // 创建提示框
        const promptBox = document.createElement('div');
        promptBox.style.cssText = `
            background: linear-gradient(135deg, #1a4d4d 0%, #0d2626 100%);
            padding: 50px;
            border-radius: 25px;
            border: 3px solid #ffd700;
            text-align: center;
            max-width: 550px;
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6), 0 0 50px rgba(255, 215, 0, 0.3);
            animation: slideUp 0.4s ease-out;
        `;
        
        // 获取页面名称（用于显示）
        const pageNames = {
            'divination.html': '占卜功能',
            'fengshui.html': '风水分析',
            'iching.html': '易经卦象',
            'profile.html': '个人档案'
        };
        const pageName = pageNames[currentPage] || '此功能';
        
        promptBox.innerHTML = `
            <div style="font-size: 70px; margin-bottom: 25px; animation: bounce 1s infinite;">🔒</div>
            <h2 style="color: #ffd700; font-size: 32px; margin-bottom: 20px; font-weight: bold; text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);">
                需要登录
            </h2>
            <p style="color: #c0c0c0; font-size: 18px; margin-bottom: 15px; line-height: 1.8;">
                <strong style="color: #ffd700;">${pageName}</strong> 需要登录后才能使用
            </p>
            <p style="color: #a0a0a0; font-size: 15px; margin-bottom: 35px; line-height: 1.6;">
                登录后即可享受完整的命理分析服务<br>
                包括AI占卜、风水分析、易经解读等功能
            </p>
            <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                <button id="authGuardLoginBtn"
                    style="padding: 15px 40px; background: linear-gradient(135deg, #ffd700 0%, #daa520 100%); 
                    color: #1a1a2e; border: none; border-radius: 12px; font-size: 18px; font-weight: bold; 
                    cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);">
                    <i class="fas fa-sign-in-alt" style="margin-right: 10px;"></i>立即登录
                </button>
                <button id="authGuardHomeBtn"
                    style="padding: 15px 40px; background: transparent; color: #c0c0c0; 
                    border: 2px solid #c0c0c0; border-radius: 12px; font-size: 18px; font-weight: bold; 
                    cursor: pointer; transition: all 0.3s;">
                    <i class="fas fa-home" style="margin-right: 10px;"></i>返回首页
                </button>
            </div>
            <p style="color: #808080; font-size: 13px; margin-top: 30px;">
                还没有账户？<a href="login.html" style="color: #ffd700; text-decoration: none; font-weight: bold;">立即注册</a>
            </p>
        `;
        
        overlay.appendChild(promptBox);
        document.body.appendChild(overlay);
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            #authGuardLoginBtn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
            }
            #authGuardHomeBtn:hover {
                background: rgba(192, 192, 192, 0.1);
                border-color: #ffd700;
                color: #ffd700;
            }
        `;
        document.head.appendChild(style);
        
        // 禁止页面滚动
        document.body.style.overflow = 'hidden';
        
        // 绑定按钮事件
        document.getElementById('authGuardLoginBtn').addEventListener('click', () => {
            redirectToLogin(window.location.pathname);
        });
        
        document.getElementById('authGuardHomeBtn').addEventListener('click', () => {
            window.location.href = CONFIG.homePage;
        });
        
        log('Login prompt displayed');
    }
    
    // 显示加载中提示
    function showLoadingIndicator() {
        const loader = document.createElement('div');
        loader.id = 'authGuardLoader';
        loader.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 99998;
            text-align: center;
        `;
        loader.innerHTML = `
            <div style="color: #ffd700; font-size: 48px; animation: spin 1s linear infinite;">⏳</div>
            <p style="color: #c0c0c0; margin-top: 10px;">验证登录状态...</p>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(loader);
        
        // 3秒后自动移除
        setTimeout(() => {
            const loaderEl = document.getElementById('authGuardLoader');
            if (loaderEl) loaderEl.remove();
        }, 3000);
    }
    
    // 主要的访问控制检查
    function checkPageAccess() {
        const currentPage = getCurrentPage();
        log('Checking page access:', currentPage);
        
        // 如果是受保护的页面
        if (isProtectedPage(currentPage)) {
            const authStatus = isUserLoggedIn();
            log('Auth status:', authStatus.loggedIn ? 'Authenticated' : 'Not authenticated');
            
            if (!authStatus.loggedIn) {
                log('Access denied - User not logged in');
                
                if (CONFIG.showPrompt) {
                    // 显示登录提示
                    showLoginPrompt(currentPage);
                } else if (CONFIG.autoRedirect) {
                    // 自动重定向
                    showLoadingIndicator();
                    setTimeout(() => {
                        redirectToLogin(window.location.pathname);
                    }, CONFIG.redirectDelay);
                } else {
                    // 直接重定向
                    redirectToLogin(window.location.pathname);
                }
                
                return false;
            } else {
                log('Access granted - User:', authStatus.user.email);
                
                // 触发页面加载完成事件
                triggerPageAccessEvent(true, authStatus.user);
                
                return true;
            }
        }
        
        // 公开页面，允许访问
        log('Public page - Access granted');
        triggerPageAccessEvent(true, null);
        return true;
    }
    
    // 触发页面访问事件
    function triggerPageAccessEvent(granted, user) {
        const event = new CustomEvent('pageAccessChecked', {
            detail: { granted, user, page: getCurrentPage() }
        });
        window.dispatchEvent(event);
    }
    
    // 手动检查访问权限（供其他脚本调用）
    function requireAuth(callback) {
        const authStatus = isUserLoggedIn();
        
        if (authStatus.loggedIn) {
            if (typeof callback === 'function') {
                callback(authStatus.user);
            }
            return true;
        } else {
            showLoginPrompt(getCurrentPage());
            return false;
        }
    }
    
    // 导出到全局
    window.AuthGuard = {
        check: checkPageAccess,
        isLoggedIn: isUserLoggedIn,
        redirectToLogin: redirectToLogin,
        getCurrentPage: getCurrentPage,
        requireAuth: requireAuth,
        isProtectedPage: isProtectedPage,
        isPublicPage: isPublicPage,
        config: CONFIG
    };
    
    // 页面加载时自动检查
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkPageAccess);
    } else {
        checkPageAccess();
    }
    
    // 监听认证状态变化
    window.addEventListener('authStateChanged', (e) => {
        log('Auth state changed:', e.detail);
        
        // 如果用户登出且在受保护页面，重新检查
        if (!e.detail.isAuthenticated && isProtectedPage(getCurrentPage())) {
            checkPageAccess();
        }
    });
    
    log('Enhanced Auth Guard initialized');
})();
