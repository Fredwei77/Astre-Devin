// ============================================
// LOGIN PAGE FUNCTIONALITY - DESTINY AI
// ============================================

// Global variables
let currentTab = 'login';
let isLoading = false;

// Translation helper function
function t(key, fallback) {
    if (window.i18n && window.i18n.t) {
        return window.i18n.t(key);
    }
    return fallback || key;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing login page...');
    initializeLoginPage();
    setupEventListeners();
    setupPasswordStrength();
    // Google Auth disabled - initializeGoogleAuth();
    console.log('Login page initialized successfully');
});

// Initialize login page
function initializeLoginPage() {
    console.log('Destiny AI Login Page initialized');
    
    // Set initial tab and fix required attributes
    showTab('login');
    
    // Clear any existing error messages
    clearMessages();
    
    // Check if user is already logged in
    checkExistingSession();
    
    console.log('Login page ready');
}

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            showTab(tabName);
        });
    });
    
    // Form submission
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleFormSubmit);
    
    // Password confirmation validation
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword) {
        confirmPassword.addEventListener('input', validatePasswordMatch);
    }
    
    // Real-time email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', validateEmail);
    });
    
    // Prevent form submission on Enter in password fields during registration
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && currentTab === 'register') {
                e.preventDefault();
                const nextInput = getNextInput(this);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
    });
}

// Show specific tab
function showTab(tabName, preserveData = false) {
    const previousTab = currentTab;
    currentTab = tabName;
    
    console.log('Switching to tab:', tabName);
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-selected', 'true');
    }
    
    // Update tab content and manage required attributes
    document.querySelectorAll('.tab-content').forEach(content => {
        const isActive = content.id === `${tabName}Tab`;
        content.classList.toggle('active', isActive);
        content.setAttribute('aria-hidden', !isActive);
        
        // Disable required validation for hidden tabs
        const inputs = content.querySelectorAll('input[required]');
        inputs.forEach(input => {
            if (isActive) {
                // Enable validation for active tab
                input.setAttribute('required', 'required');
            } else {
                // Disable validation for hidden tab
                input.removeAttribute('required');
            }
        });
    });
    
    // Clear messages
    clearMessages();
    
    // Only reset form if we're not preserving data (for registration success flow)
    if (!preserveData) {
        resetFormStyles();
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (isLoading) return;
    
    console.log('Form submitted, current tab:', currentTab);
    
    // Only collect data from the active tab
    const activeTab = document.getElementById(`${currentTab}Tab`);
    const formData = new FormData();
    
    // Get inputs from active tab only
    const inputs = activeTab.querySelectorAll('input[name]');
    inputs.forEach(input => {
        if (input.type !== 'checkbox' || input.checked) {
            formData.append(input.name, input.value);
        }
    });
    
    const data = Object.fromEntries(formData.entries());
    console.log('Form data:', data);
    
    if (currentTab === 'login') {
        await handleLogin(data);
    } else {
        await handleRegister(data);
    }
}

// Handle login
async function handleLogin(data) {
    try {
        console.log('Login attempt:', data.email);
        
        // Validate login data
        if (!validateLoginData(data)) {
            return;
        }
        
        showLoading(true, 'login.message.loggingIn', '正在登入...');
        
        // 优先使用Supabase登录
        let result;
        if (window.EnhancedAuthService) {
            console.log('🔐 使用Supabase登录');
            const supabaseResult = await EnhancedAuthService.login(data.email, data.password);
            
            if (supabaseResult.success) {
                result = {
                    success: true,
                    user: {
                        email: supabaseResult.user.email,
                        id: supabaseResult.user.id,
                        name: supabaseResult.user.user_metadata?.full_name || supabaseResult.user.email.split('@')[0]
                    },
                    token: supabaseResult.session.access_token
                };
            } else {
                result = {
                    success: false,
                    message: supabaseResult.error
                };
            }
        } else {
            // 回退到模拟API
            console.log('⚠️ Supabase未加载，使用模拟登录');
            result = await simulateLoginAPI(data);
        }
        
        console.log('Login response:', result);
        
        if (result.success) {
            showSuccessMessage(t('login.message.success', '登入成功！正在跳转...'));
            
            // Store user session
            const storage = data.remember ? localStorage : sessionStorage;
            storage.setItem('destinyai_user', JSON.stringify(result.user));
            storage.setItem('destinyai_token', result.token);
            storage.setItem('isLoggedIn', 'true');
            storage.setItem('userEmail', result.user.email);
            storage.setItem('userId', result.user.id);
            storage.setItem('userName', result.user.name);
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = result.redirectUrl || 'index.html';
            }, 1500);
            
        } else {
            showErrorMessage(result.message || t('login.error.loginFailed', '登入失败，请检查邮箱和密码'));
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showErrorMessage(t('login.error.loginFailed', '登入失败') + '：' + error.message);
    } finally {
        showLoading(false);
    }
}

// Handle registration
async function handleRegister(data) {
    try {
        console.log('Register attempt:', data.email);
        
        // Validate registration data
        if (!validateRegisterData(data)) {
            return;
        }
        
        showLoading(true, 'login.message.registering', '正在注册...');
        
        // 优先使用Supabase注册
        let result;
        if (window.EnhancedAuthService) {
            console.log('📝 使用Supabase注册');
            const supabaseResult = await EnhancedAuthService.register(
                data.email, 
                data.password,
                {
                    fullName: data.name || data.email.split('@')[0],
                    phone: data.phone || ''
                }
            );
            
            if (supabaseResult.success) {
                result = {
                    success: true,
                    message: '注册成功！'
                };
            } else {
                result = {
                    success: false,
                    message: supabaseResult.error
                };
            }
        } else {
            // 回退到模拟API
            console.log('⚠️ Supabase未加载，使用模拟注册');
            result = await simulateRegisterAPI(data);
        }
        
        console.log('Register response:', result);
        
        if (result.success) {
            showSuccessMessage(t('login.message.registerSuccess', '注册成功！请登录'));
            
            // Switch to login tab after registration
            setTimeout(() => {
                handleRegistrationSuccess(data.email);
            }, 1500);
            
        } else {
            showErrorMessage(result.message || t('login.error.registerFailed', '注册失败，请重试'));
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        showErrorMessage(t('login.error.registerFailed', '注册失败') + '：' + error.message);
    } finally {
        showLoading(false);
    }
}

// Validate login data
function validateLoginData(data) {
    clearMessages();
    
    if (!data.email || !isValidEmail(data.email)) {
        showErrorMessage(t('login.error.invalidEmail', '请输入有效的邮箱地址'));
        document.getElementById('loginEmail').focus();
        return false;
    }
    
    if (!data.password || data.password.length < 1) {
        showErrorMessage(t('login.error.emptyPassword', '请输入密码'));
        document.getElementById('loginPassword').focus();
        return false;
    }
    
    return true;
}

// Validate registration data
function validateRegisterData(data) {
    clearMessages();
    
    if (!data.name || data.name.trim().length < 2) {
        showErrorMessage(t('login.error.nameTooShort', '用户名至少需要2个字符'));
        document.getElementById('registerName').focus();
        return false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showErrorMessage(t('login.error.invalidEmail', '请输入有效的邮箱地址'));
        document.getElementById('registerEmail').focus();
        return false;
    }
    
    if (!data.password || data.password.length < 8) {
        showErrorMessage(t('login.error.passwordTooShort', '密码至少需要8个字符'));
        document.getElementById('registerPassword').focus();
        return false;
    }
    
    if (data.password !== data.confirmPassword) {
        showErrorMessage(t('login.error.passwordMismatch', '两次输入的密码不一致'));
        document.getElementById('confirmPassword').focus();
        return false;
    }
    
    if (!document.querySelector('#registerTab input[type="checkbox"]').checked) {
        showErrorMessage(t('login.error.termsNotAgreed', '请同意服务条款和隐私政策'));
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateEmail(e) {
    const email = e.target.value;
    const input = e.target;
    
    if (email && !isValidEmail(email)) {
        input.style.borderColor = '#ff6b6b';
        input.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.3)';
    } else {
        input.style.borderColor = 'rgba(218, 165, 32, 0.3)';
        input.style.boxShadow = '';
    }
}

// Password strength checker
function setupPasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (passwordInput && strengthIndicator) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updatePasswordStrength(strength, strengthIndicator);
        });
        
        passwordInput.addEventListener('focus', function() {
            strengthIndicator.classList.add('visible');
        });
    }
}

function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    let level = 'weak';
    let text = t('register.passwordStrength.weak', '密码强度：弱');
    
    if (score >= 6) {
        level = 'very-strong';
        text = t('register.passwordStrength.veryStrong', '密码强度：极强');
    } else if (score >= 4) {
        level = 'strong';
        text = t('register.passwordStrength.strong', '密码强度：强');
    } else if (score >= 2) {
        level = 'medium';
        text = t('register.passwordStrength.medium', '密码强度：中等');
    }
    
    return { level, text, score };
}

function updatePasswordStrength(strength, indicator) {
    const bar = indicator.querySelector('.strength-bar');
    const text = indicator.querySelector('.strength-text');
    
    bar.className = `strength-bar ${strength.level}`;
    text.textContent = strength.text;
}

// Password confirmation validation
function validatePasswordMatch() {
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword');
    const confirmValue = confirmPassword.value;
    
    if (confirmValue && password !== confirmValue) {
        confirmPassword.style.borderColor = '#ff6b6b';
        confirmPassword.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.3)';
    } else if (confirmValue) {
        confirmPassword.style.borderColor = '#66bb6a';
        confirmPassword.style.boxShadow = '0 0 10px rgba(102, 187, 106, 0.3)';
    } else {
        confirmPassword.style.borderColor = 'rgba(218, 165, 32, 0.3)';
        confirmPassword.style.boxShadow = '';
    }
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Google Authentication
function initializeGoogleAuth() {
    // Initialize Google Sign-In
    if (window.google) {
        google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with actual Google Client ID
            callback: handleGoogleSignIn,
            auto_select: false
        });
    }
}

async function loginWithGoogle() {
    try {
        showLoading(true, 'login.message.connectingGoogle', '正在连接 Google...');
        
        // Use simulated Google Auth for testing
        const response = await simulateGoogleAuth();
        await handleSocialLoginResponse(response);
        
    } catch (error) {
        console.error('Google login error:', error);
        showErrorMessage(t('login.error.googleFailed', 'Google 登入失败，请重试'));
    } finally {
        showLoading(false);
    }
}

function handleGoogleSignIn(credentialResponse) {
    // Handle Google sign-in response
    const credential = credentialResponse.credential;
    
    // Decode JWT token (in production, verify on server)
    const payload = JSON.parse(atob(credential.split('.')[1]));
    
    const userData = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        provider: 'google'
    };
    
    handleSocialLoginResponse({ success: true, user: userData });
}

// GitHub Authentication
async function loginWithGitHub() {
    try {
        showLoading(true, 'login.message.connectingGitHub', '正在连接 GitHub...');
        
        // GitHub OAuth flow would typically redirect to GitHub
        // For demo purposes, we'll simulate it
        const response = await simulateGitHubAuth();
        await handleSocialLoginResponse(response);
        
    } catch (error) {
        console.error('GitHub login error:', error);
        showErrorMessage(t('login.error.githubFailed', 'GitHub 登入失败，请重试'));
    } finally {
        showLoading(false);
    }
}

// Handle social login response
async function handleSocialLoginResponse(response) {
    if (response.success) {
        showSuccessMessage(t('login.message.success', '登入成功！正在跳转...'));
        
        // Store user session
        localStorage.setItem('destinyai_user', JSON.stringify(response.user));
        localStorage.setItem('destinyai_token', response.token || 'social_auth_token');
        
        // Redirect after short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showErrorMessage(response.message || t('login.error.loginFailed', '社交登入失败'));
    }
}

// Handle successful registration
function handleRegistrationSuccess(email) {
    // Clear all form data first
    clearAllForms();
    
    // Switch to login tab while preserving the email we're about to set
    showTab('login', true);
    
    // Pre-fill email and focus password field
    document.getElementById('loginEmail').value = email;
    
    // Small delay to ensure tab switch is complete
    setTimeout(() => {
        const passwordField = document.getElementById('loginPassword');
        if (passwordField) {
            passwordField.focus();
        }
        showSuccessMessage(t('login.message.registerSuccess', '注册成功！请输入密码登入您的账户'));
    }, 100);
}

// Clear all form inputs
function clearAllForms() {
    const form = document.getElementById('loginForm');
    
    // Clear all input fields
    const allInputs = form.querySelectorAll('input');
    allInputs.forEach(input => {
        if (input.type !== 'checkbox') {
            input.value = '';
        } else {
            input.checked = false;
        }
        // Reset styles
        input.style.borderColor = 'rgba(218, 165, 32, 0.3)';
        input.style.boxShadow = '';
    });
    
    // Hide password strength indicator
    const strengthIndicator = document.getElementById('passwordStrength');
    if (strengthIndicator) {
        strengthIndicator.classList.remove('visible');
    }
}

// Utility functions
function showLoading(show, messageKey = 'login.loading', fallbackMessage = '正在处理...') {
    const overlay = document.getElementById('loadingOverlay');
    const text = overlay.querySelector('p');
    
    if (show) {
        // If messageKey is a translation key, use it; otherwise use as direct message
        const message = messageKey.startsWith('login.') || messageKey.startsWith('register.') 
            ? t(messageKey, fallbackMessage) 
            : messageKey;
        text.textContent = message;
        overlay.classList.add('active');
        isLoading = true;
    } else {
        overlay.classList.remove('active');
        isLoading = false;
    }
}

function showErrorMessage(message) {
    clearMessages();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;
    
    const form = document.getElementById('loginForm');
    form.insertBefore(errorDiv, form.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

function showSuccessMessage(message) {
    clearMessages();
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;
    
    const form = document.getElementById('loginForm');
    form.insertBefore(successDiv, form.firstChild);
}

function clearMessages() {
    const messages = document.querySelectorAll('.error-message, .success-message');
    messages.forEach(msg => msg.remove());
}

// Reset form styles only (don't clear values)
function resetFormStyles() {
    const form = document.getElementById('loginForm');
    
    // Reset input styles
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.borderColor = 'rgba(218, 165, 32, 0.3)';
        input.style.boxShadow = '';
    });
    
    // Hide password strength indicator when switching away from register
    if (currentTab === 'login') {
        const strengthIndicator = document.getElementById('passwordStrength');
        if (strengthIndicator) {
            strengthIndicator.classList.remove('visible');
        }
    }
}

function getNextInput(currentInput) {
    const inputs = Array.from(document.querySelectorAll('input'));
    const currentIndex = inputs.indexOf(currentInput);
    return inputs[currentIndex + 1];
}

function checkExistingSession() {
    const token = localStorage.getItem('destinyai_token');
    if (token && token !== 'undefined') {
        // User might already be logged in
        console.log('Existing session found');
        // Optionally redirect or show a different state
    }
}

// Simulated API calls (replace with actual API endpoints)
async function simulateLoginAPI(data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials for testing
    if (data.email === 'test@example.com' && data.password === 'password123') {
        return {
            success: true,
            token: 'demo_token_' + Date.now(),
            user: {
                id: 1,
                name: '测试用户',
                email: data.email,
                avatar: null
            },
            redirectUrl: 'index.html'
        };
    }
    
    // For demo, accept any email with password length >= 8
    if (data.password.length >= 8) {
        return {
            success: true,
            token: 'demo_token_' + Date.now(),
            user: {
                id: Math.floor(Math.random() * 1000),
                name: data.email.split('@')[0],
                email: data.email,
                avatar: null
            },
            redirectUrl: 'index.html'
        };
    }
    
    return {
        success: false,
        message: t('login.error.invalidCredentials', '邮箱或密码错误')
    };
}

async function simulateRegisterAPI(data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if email is already "registered"
    const existingUsers = JSON.parse(localStorage.getItem('destinyai_demo_users') || '[]');
    if (existingUsers.some(user => user.email === data.email)) {
        return {
            success: false,
            message: t('login.error.emailExists', '该邮箱已被注册')
        };
    }
    
    // Add to demo users list
    const newUser = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        createdAt: new Date().toISOString()
    };
    existingUsers.push(newUser);
    localStorage.setItem('destinyai_demo_users', JSON.stringify(existingUsers));
    
    return {
        success: true,
        message: t('login.message.registerSuccess', '注册成功！验证邮件已发送')
    };
}

async function simulateGoogleAuth() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
        success: true,
        token: 'google_demo_token_' + Date.now(),
        user: {
            id: 'google_' + Date.now(),
            name: 'Google 用户',
            email: 'google.user@gmail.com',
            picture: 'https://via.placeholder.com/40x40/daa520/1a1a2e?text=G',
            provider: 'google'
        }
    };
}

async function simulateGitHubAuth() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
        success: true,
        token: 'github_demo_token_' + Date.now(),
        user: {
            id: 'github_' + Date.now(),
            name: 'GitHub 用户',
            email: 'github.user@example.com',
            picture: 'https://via.placeholder.com/40x40/333333/ffffff?text=GH',
            provider: 'github'
        }
    };
}