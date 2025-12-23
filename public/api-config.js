// ============================================
// API CONFIGURATION AND INTEGRATION
// ============================================

// API Configuration
const API_CONFIG = {
    // 后端API基础URL - 请修改为您的实际后端地址
    BASE_URL: 'https://api.jiushiai.com', // 替换为您的后端API地址

    // API版本
    VERSION: 'v1',

    // API端点
    ENDPOINTS: {
        // 认证相关
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout',
            REFRESH: '/auth/refresh',
            FORGOT_PASSWORD: '/auth/forgot-password',
            RESET_PASSWORD: '/auth/reset-password',
            VERIFY_EMAIL: '/auth/verify-email'
        },

        // 用户相关
        USER: {
            PROFILE: '/user/profile',
            UPDATE: '/user/update',
            DELETE: '/user/delete',
            UPLOAD_AVATAR: '/user/upload-avatar'
        },

        // 占卜相关
        DIVINATION: {
            ICHING: '/divination/iching',
            FENGSHUI: '/divination/fengshui',
            TAROT: '/divination/tarot',
            HISTORY: '/divination/history'
        },

        // 支付相关
        PAYMENT: {
            CREATE_ORDER: '/payment/create',
            VERIFY: '/payment/verify',
            WEBHOOK: '/payment/webhook',
            CREATE_PAYMENT_INTENT: '/stripe/create-payment-intent',
            CREATE_SUBSCRIPTION: '/stripe/create-subscription',
            CANCEL_SUBSCRIPTION: '/stripe/cancel-subscription',
            GET_SUBSCRIPTION: '/stripe/subscription'
        }
    },

    // OAuth配置
    OAUTH: {
        GOOGLE: {
            CLIENT_ID: '你的Google客户端ID.apps.googleusercontent.com', // 替换为实际的Google Client ID
            REDIRECT_URI: window.location.origin + '/auth/google/callback'
        },

        GITHUB: {
            CLIENT_ID: '你的GitHub客户端ID', // 替换为实际的GitHub Client ID
            REDIRECT_URI: window.location.origin + '/auth/github/callback',
            SCOPE: 'user:email'
        }
    },

    // 请求配置
    REQUEST: {
        TIMEOUT: 15000, // 15秒超时
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000 // 1秒重试延迟
    }
};

// 设置全局API基础URL
window.API_BASE_URL = `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`;

// API请求工具类
class APIClient {
    constructor() {
        this.baseURL = window.API_BASE_URL;
        this.timeout = API_CONFIG.REQUEST.TIMEOUT;
    }

    // 获取认证头
    getAuthHeaders() {
        const token = localStorage.getItem('destinyai_token');
        return token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        };
    }

    // 处理API响应
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: '请求失败' }));

            // 处理认证错误
            if (response.status === 401) {
                // Token过期，尝试刷新
                const refreshed = await this.refreshToken();
                if (!refreshed) {
                    // 刷新失败，清除用户数据并跳转登录
                    localStorage.removeItem('destinyai_user');
                    localStorage.removeItem('destinyai_token');
                    localStorage.removeItem('destinyai_refresh_token');
                    window.location.reload();
                    return;
                }
                throw new Error('请重试操作');
            }

            throw new Error(error.message || '请求失败');
        }

        return await response.json();
    }

    // 刷新令牌
    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('destinyai_refresh_token');
            if (!refreshToken) return false;

            const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('destinyai_token', data.token);
                if (data.refreshToken) {
                    localStorage.setItem('destinyai_refresh_token', data.refreshToken);
                }
                return true;
            }

            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    // 通用GET请求
    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: this.getAuthHeaders(),
                signal: AbortSignal.timeout(this.timeout)
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`GET ${endpoint} failed:`, error);
            throw error;
        }
    }

    // 通用POST请求
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(data),
                signal: AbortSignal.timeout(this.timeout)
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`POST ${endpoint} failed:`, error);
            throw error;
        }
    }

    // 通用PUT请求
    async put(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(data),
                signal: AbortSignal.timeout(this.timeout)
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`PUT ${endpoint} failed:`, error);
            throw error;
        }
    }

    // 通用DELETE请求
    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders(),
                signal: AbortSignal.timeout(this.timeout)
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`DELETE ${endpoint} failed:`, error);
            throw error;
        }
    }

    // 文件上传
    async upload(endpoint, file, additionalData = {}) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            // 添加其他数据
            Object.keys(additionalData).forEach(key => {
                formData.append(key, additionalData[key]);
            });

            const token = localStorage.getItem('destinyai_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: headers,
                body: formData,
                signal: AbortSignal.timeout(this.timeout * 2) // 文件上传允许更长时间
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`UPLOAD ${endpoint} failed:`, error);
            throw error;
        }
    }
}

// 创建全局API客户端实例
window.apiClient = new APIClient();

// 具体API调用函数

// 登录API
async function callLoginAPI(credentials) {
    try {
        const response = await window.apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);

        // 存储令牌和用户信息
        if (response.token) {
            localStorage.setItem('destinyai_token', response.token);
        }
        if (response.refreshToken) {
            localStorage.setItem('destinyai_refresh_token', response.refreshToken);
        }
        if (response.user) {
            localStorage.setItem('destinyai_user', JSON.stringify(response.user));
        }

        return { success: true, user: response.user, token: response.token };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// 注册API
async function callRegisterAPI(userData) {
    try {
        const response = await window.apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
        return { success: true, message: response.message };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// 忘记密码API
async function callForgotPasswordAPI(email) {
    try {
        const response = await window.apiClient.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
        return { success: true, message: response.message };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// 退出登录API
async function callLogoutAPI() {
    try {
        await window.apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {});
        return { success: true };
    } catch (error) {
        console.warn('Logout API failed:', error);
        return { success: false, message: error.message };
    }
}

// 获取用户资料API
async function callGetUserProfileAPI() {
    try {
        const response = await window.apiClient.get(API_CONFIG.ENDPOINTS.USER.PROFILE);
        return { success: true, user: response };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Google OAuth登录
async function initiateGoogleOAuth() {
    const params = new URLSearchParams({
        client_id: API_CONFIG.OAUTH.GOOGLE.CLIENT_ID,
        redirect_uri: API_CONFIG.OAUTH.GOOGLE.REDIRECT_URI,
        scope: 'openid email profile',
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    window.location.href = authUrl;
}

// GitHub OAuth登录
async function initiateGitHubOAuth() {
    const params = new URLSearchParams({
        client_id: API_CONFIG.OAUTH.GITHUB.CLIENT_ID,
        redirect_uri: API_CONFIG.OAUTH.GITHUB.REDIRECT_URI,
        scope: API_CONFIG.OAUTH.GITHUB.SCOPE,
        allow_signup: 'true'
    });

    const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
    window.location.href = authUrl;
}

// 开发环境检测和模拟API
function isDevelopmentMode() {
    return window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.startsWith('192.168.');
}

// Toast通知功能
function showToastMessage(message, type = 'info', duration = 3000) {
    // 创建toast容器
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(toastContainer);
    }

    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast-item p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0`;

    // 根据类型设置样式
    const typeStyles = {
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        warning: 'bg-yellow-600 text-black',
        info: 'bg-blue-600 text-white'
    };

    toast.className += ` ${typeStyles[type] || typeStyles.info}`;

    // 设置内容
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    toast.innerHTML = `
        <div class="flex items-center">
            <i class="${icons[type] || icons.info} mr-2"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-xl leading-none">&times;</button>
        </div>
    `;

    // 添加到容器
    toastContainer.appendChild(toast);

    // 显示动画
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    }, 100);

    // 自动隐藏
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, duration);
}

console.log('🌟 API Configuration loaded');
console.log('🔧 API Base URL:', window.API_BASE_URL);
console.log('🚀 Development Mode:', isDevelopmentMode());