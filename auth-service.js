// ============================================
// AUTHENTICATION SERVICE - 认证服务
// ============================================

(function() {
    'use strict';
    
    // 认证服务类
    class AuthService {
        constructor() {
            this.tokenKey = 'destinyai_token';
            this.userKey = 'destinyai_user';
            this.returnUrlKey = 'destinyai_return_url';
        }
        
        // 获取当前登录用户
        getCurrentUser() {
            try {
                const userData = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
                if (userData) {
                    return JSON.parse(userData);
                }
            } catch (error) {
                console.error('[Auth Service] Error parsing user data:', error);
                this.clearAuth();
            }
            return null;
        }
        
        // 获取认证Token
        getToken() {
            return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
        }
        
        // 检查是否已登录
        isAuthenticated() {
            const token = this.getToken();
            const user = this.getCurrentUser();
            return !!(token && user);
        }
        
        // 设置认证信息
        setAuth(token, user, remember = false) {
            const storage = remember ? localStorage : sessionStorage;
            
            storage.setItem(this.tokenKey, token);
            storage.setItem(this.userKey, JSON.stringify(user));
            
            console.log('[Auth Service] Authentication set:', { email: user.email, remember });
            
            // 触发认证状态变化事件
            this.triggerAuthChange(true, user);
        }
        
        // 清除认证信息
        clearAuth() {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.userKey);
            sessionStorage.removeItem(this.tokenKey);
            sessionStorage.removeItem(this.userKey);
            
            console.log('[Auth Service] Authentication cleared');
            
            // 触发认证状态变化事件
            this.triggerAuthChange(false, null);
        }
        
        // 登出
        logout() {
            this.clearAuth();
            
            // 重定向到首页
            window.location.href = 'index.html';
        }
        
        // 保存返回URL
        saveReturnUrl(url) {
            sessionStorage.setItem(this.returnUrlKey, url);
        }
        
        // 获取返回URL
        getReturnUrl() {
            return sessionStorage.getItem(this.returnUrlKey) || 'index.html';
        }
        
        // 清除返回URL
        clearReturnUrl() {
            sessionStorage.removeItem(this.returnUrlKey);
        }
        
        // 登录后重定向
        redirectAfterLogin() {
            const returnUrl = this.getReturnUrl();
            this.clearReturnUrl();
            
            console.log('[Auth Service] Redirecting to:', returnUrl);
            window.location.href = returnUrl;
        }
        
        // 触发认证状态变化事件
        triggerAuthChange(isAuthenticated, user) {
            const event = new CustomEvent('authStateChanged', {
                detail: { isAuthenticated, user }
            });
            window.dispatchEvent(event);
        }
        
        // 验证Token格式（基础验证）
        validateTokenFormat(token) {
            if (!token || typeof token !== 'string') {
                return false;
            }
            
            // 基础格式检查（可根据实际token格式调整）
            return token.length > 10;
        }
        
        // 获取用户显示名称
        getUserDisplayName() {
            const user = this.getCurrentUser();
            if (!user) return 'Guest';
            
            return user.name || user.email || 'User';
        }
        
        // 获取用户头像URL
        getUserAvatar() {
            const user = this.getCurrentUser();
            if (!user || !user.avatar) {
                // 返回默认头像
                return this.getDefaultAvatar(user?.email || 'guest');
            }
            return user.avatar;
        }
        
        // 生成默认头像（基于邮箱）
        getDefaultAvatar(email) {
            // 使用Gravatar或生成首字母头像
            const initial = email.charAt(0).toUpperCase();
            return `data:image/svg+xml,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
                    <rect width="100" height="100" fill="#ffd700"/>
                    <text x="50" y="50" font-size="50" text-anchor="middle" 
                          dominant-baseline="central" fill="#1a237e" font-family="Arial">
                        ${initial}
                    </text>
                </svg>
            `)}`;
        }
        
        // 更新用户信息
        updateUser(userData) {
            const currentUser = this.getCurrentUser();
            if (!currentUser) {
                console.error('[Auth Service] No user logged in');
                return false;
            }
            
            const updatedUser = { ...currentUser, ...userData };
            
            // 更新存储
            if (localStorage.getItem(this.userKey)) {
                localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
            }
            if (sessionStorage.getItem(this.userKey)) {
                sessionStorage.setItem(this.userKey, JSON.stringify(updatedUser));
            }
            
            console.log('[Auth Service] User updated:', updatedUser.email);
            
            // 触发更新事件
            this.triggerAuthChange(true, updatedUser);
            
            return true;
        }
        
        // 检查用户权限
        hasPermission(permission) {
            const user = this.getCurrentUser();
            if (!user) return false;
            
            // 检查用户权限列表
            return user.permissions?.includes(permission) || false;
        }
        
        // 检查用户角色
        hasRole(role) {
            const user = this.getCurrentUser();
            if (!user) return false;
            
            return user.role === role;
        }
        
        // 获取认证头部（用于API请求）
        getAuthHeader() {
            const token = this.getToken();
            if (!token) return {};
            
            return {
                'Authorization': `Bearer ${token}`
            };
        }
    }
    
    // 创建全局实例
    const authService = new AuthService();
    
    // 导出到全局
    window.AuthService = authService;
    
    // 监听存储变化（多标签页同步）
    window.addEventListener('storage', (e) => {
        if (e.key === authService.tokenKey || e.key === authService.userKey) {
            console.log('[Auth Service] Storage changed, checking auth state');
            
            if (!authService.isAuthenticated()) {
                console.log('[Auth Service] User logged out in another tab');
                authService.clearAuth();
                
                // 如果当前在受保护页面，重定向到登录
                if (window.AuthGuard && !window.AuthGuard.check()) {
                    window.location.reload();
                }
            }
        }
    });
    
    console.log('[Auth Service] Initialized');
})();
