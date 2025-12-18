// ============================================
// AUTHENTICATION GUARD - 页面访问控制
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
    
    // 检查用户是否已登录
    function isUserLoggedIn() {
        const token = localStorage.getItem('destinyai_token') || sessionStorage.getItem('destinyai_token');
        const userData = localStorage.getItem('destinyai_user') || sessionStorage.getItem('destinyai_user');
        
        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                return { loggedIn: true, user: user };
            } catch (error) {
                console.error('[Auth Guard] Invalid user data:', error);
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
    
    // 重定向到登录页面
    function redirectToLogin(returnUrl) {
        console.log('[Auth Guard] Redirecting to login page...');
        
        // 保存返回 URL
        sessionStorage.setItem('destinyai_return_url', returnUrl);
        
        // 显示提示消息
        const message = encodeURIComponent('请先登录以访问此功能');
        window.location.href = `login.html?message=${message}&return=${encodeURIComponent(returnUrl)}`;
    }
    
    // 显示未登录提示
    function showLoginPrompt() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'authGuardOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // 创建提示框
        const promptBox = document.createElement('div');
        promptBox.style.cssText = `
            background: linear-gradient(135deg, #1a4d4d 0%, #0d2626 100%);
            padding: 40px;
            border-radius: 20px;
            border: 2px solid #ffd700;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        `;
        
        promptBox.innerHTML = `
            <div style="font-size: 60px; margin-bottom: 20px;">🔒</div>
            <h2 style="color: #ffd700; font-size: 28px; margin-bottom: 15px; font-weight: bold;">需要登录</h2>
            <p style="color: #c0c0c0; font-size: 16px; margin-bottom: 30px; line-height: 1.6;">
                此功能需要登录后才能使用<br>
                请先登录或注册账户
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="window.location.href='login.html?return=' + encodeURIComponent(window.location.pathname)" 
                    style="padding: 12px 30px; background: linear-gradient(135deg, #ffd700 0%, #daa520 100%); 
                    color: #1a1a2e; border: none; border-radius: 10px; font-size: 16px; font-weight: bold; 
                    cursor: pointer; transition: all 0.3s;">
                    <i class="fas fa-sign-in-alt" style="margin-right: 8px;"></i>立即登录
                </button>
                <button onclick="window.location.href='index.html'" 
                    style="padding: 12px 30px; background: transparent; color: #c0c0c0; 
                    border: 2px solid #c0c0c0; border-radius: 10px; font-size: 16px; font-weight: bold; 
                    cursor: pointer; transition: all 0.3s;">
                    <i class="fas fa-home" style="margin-right: 8px;"></i>返回首页
                </button>
            </div>
        `;
        
        overlay.appendChild(promptBox);
        document.body.appendChild(overlay);
        
        // 禁止页面滚动
        document.body.style.overflow = 'hidden';
    }
    
    // 主要的访问控制检查
    function checkPageAccess() {
        const currentPage = getCurrentPage();
        console.log('[Auth Guard] Current page:', currentPage);
        
        // 如果是受保护的页面
        if (isProtectedPage(currentPage)) {
            const authStatus = isUserLoggedIn();
            console.log('[Auth Guard] Auth status:', authStatus.loggedIn);
            
            if (!authStatus.loggedIn) {
                console.log('[Auth Guard] Access denied - User not logged in');
                
                // 显示登录提示
                showLoginPrompt();
                
                // 返回 false 表示访问被拒绝
                return false;
            } else {
                console.log('[Auth Guard] Access granted - User:', authStatus.user.email);
                return true;
            }
        }
        
        // 公开页面，允许访问
        console.log('[Auth Guard] Public page - Access granted');
        return true;
    }
    
    // 导出到全局
    window.AuthGuard = {
        check: checkPageAccess,
        isLoggedIn: isUserLoggedIn,
        redirectToLogin: redirectToLogin,
        getCurrentPage: getCurrentPage
    };
    
    // 页面加载时自动检查
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkPageAccess);
    } else {
        checkPageAccess();
    }
    
    console.log('[Auth Guard] Initialized');
})();
