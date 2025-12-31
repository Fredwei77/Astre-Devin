// ============================================
// HEADER AUTHENTICATION FUNCTIONALITY
// ============================================

// Global variables
let currentModalTab = 'login';
let isModalLoading = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeHeaderAuth();
    setupModalEventListeners();
    checkUserSession();
});

// Initialize header authentication
function initializeHeaderAuth() {
    console.log('Header Authentication initialized');

    // Setup login button click - redirect to login.html instead of modal
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }

    // Setup user menu toggle
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', toggleUserMenu);
    }

    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Close user menu when clicking outside
    document.addEventListener('click', function (e) {
        const userMenu = document.getElementById('userMenu');
        const userMenuBtn = document.getElementById('userMenuBtn');
        if (userMenu && !userMenu.contains(e.target) && !userMenuBtn.contains(e.target)) {
            userMenu.classList.add('hidden');
        }
    });
}

// Setup modal event listeners
function setupModalEventListeners() {
    // Modal close buttons
    const closeModalBtn = document.getElementById('closeLoginModal');
    const modal = document.getElementById('loginModal');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeLoginModal);
    }

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeLoginModal();
            }
        });
    }

    // Tab switching
    const tabBtns = document.querySelectorAll('.modal-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const tabName = this.dataset.tab;
            switchModalTab(tabName);
        });
    });

    // Form submission
    const modalForm = document.getElementById('modalLoginForm');
    if (modalForm) {
        modalForm.addEventListener('submit', handleModalFormSubmit);
    }

    // Social login buttons
    const googleBtn = document.getElementById('modalGoogleLogin');
    const githubBtn = document.getElementById('modalGithubLogin');

    if (googleBtn) {
        googleBtn.addEventListener('click', handleGoogleLogin);
    }

    if (githubBtn) {
        githubBtn.addEventListener('click', handleGitHubLogin);
    }

    // Forgot password functionality
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    const sendResetBtn = document.getElementById('sendResetBtn');
    const backToLoginBtn = document.getElementById('backToLoginBtn');

    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', () => switchModalTab('forgot'));
    }

    if (sendResetBtn) {
        sendResetBtn.addEventListener('click', handleForgotPassword);
    }

    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', () => switchModalTab('login'));
    }

    // Password strength for registration
    const registerPassword = document.getElementById('modalRegisterPassword');
    if (registerPassword) {
        registerPassword.addEventListener('input', function () {
            const strength = calculatePasswordStrength(this.value);
            updateModalPasswordStrength(strength);
        });

        registerPassword.addEventListener('focus', function () {
            document.getElementById('modalPasswordStrength').classList.remove('hidden');
        });
    }

    // Password confirmation validation
    const confirmPassword = document.getElementById('modalConfirmPassword');
    if (confirmPassword) {
        confirmPassword.addEventListener('input', validateModalPasswordMatch);
    }

    // ESC key to close modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeLoginModal();
        }
    });
}

// Open login modal
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        // Reset to login tab
        switchModalTab('login');

        // Show modal
        modal.classList.remove('hidden');
        modal.style.display = 'block';

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';

        // Focus on email input after animation
        setTimeout(() => {
            const emailInput = document.getElementById('modalLoginEmail');
            if (emailInput && window.innerWidth > 640) {
                emailInput.focus();
            }
        }, 400);
    }
}

// Close login modal
function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        // Add closing animation class
        const modalContainer = modal.querySelector('.login-modal-container');
        if (modalContainer) {
            modalContainer.style.animation = 'modalFadeInUp 0.3s ease-out reverse';
        }

        // Hide modal after animation
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.style.display = 'none';

            // Restore body scroll
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';

            // Clear form data and reset to login tab
            clearModalForm();
            switchModalTab('login');

            // Reset animation
            if (modalContainer) {
                modalContainer.style.animation = '';
            }
        }, 300);
    }
}

// Switch modal tabs
function switchModalTab(tabName) {
    currentModalTab = tabName;

    // Update tab buttons (hide/show based on tab)
    const tabContainer = document.querySelector('.flex.bg-mystic-gold\\/10');
    if (tabName === 'forgot') {
        tabContainer.style.display = 'none';
    } else {
        tabContainer.style.display = 'flex';
        document.querySelectorAll('.modal-tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
    }

    // Update tab content
    document.querySelectorAll('.modal-tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    const activeTab = document.getElementById(`modal${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Tab`);
    if (activeTab) {
        activeTab.classList.remove('hidden');
    }

    // Clear any error messages
    clearModalMessages();

    // Focus appropriate input
    setTimeout(() => {
        if (tabName === 'forgot') {
            const emailInput = document.getElementById('modalForgotEmail');
            if (emailInput) emailInput.focus();
        } else if (tabName === 'login') {
            const emailInput = document.getElementById('modalLoginEmail');
            if (emailInput) emailInput.focus();
        } else if (tabName === 'register') {
            const nameInput = document.getElementById('modalRegisterName');
            if (nameInput) nameInput.focus();
        }
    }, 100);
}

// Handle modal form submission
async function handleModalFormSubmit(e) {
    e.preventDefault();

    if (isModalLoading) return;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (currentModalTab === 'login') {
        await handleModalLogin(data);
    } else {
        await handleModalRegister(data);
    }
}

// Handle modal login
async function handleModalLogin(data) {
    try {
        if (!validateModalLoginData(data)) {
            return;
        }

        showModalLoading(true, '正在登入...');

        // 使用真实API或模拟API
        let response;
        if (isDevelopmentMode() || !window.API_BASE_URL.includes('api.jiushiai.com')) {
            // 开发模式或API未配置，使用模拟API
            response = await simulateLoginAPI(data);
        } else {
            // 生产模式，使用真实API
            response = await callLoginAPI({
                email: data.email,
                password: data.password,
                remember: data.remember || false
            });
        }

        if (response.success) {
            showModalSuccessMessage('登入成功！');

            // Update header UI
            setTimeout(() => {
                updateHeaderForLoggedInUser(response.user);
                closeLoginModal();
                showToastMessage('欢迎回来！', 'success');
            }, 1000);

        } else {
            showModalErrorMessage(response.message || '登入失败，请检查邮箱和密码');
        }

    } catch (error) {
        console.error('Modal login error:', error);
        showModalErrorMessage('网络错误，请稍后重试');
    } finally {
        showModalLoading(false);
    }
}

// Handle modal registration
async function handleModalRegister(data) {
    try {
        if (!validateModalRegisterData(data)) {
            return;
        }

        showModalLoading(true, '正在注册...');

        // 使用真实API或模拟API
        let response;
        if (isDevelopmentMode() || !window.API_BASE_URL.includes('api.jiushiai.com')) {
            // 开发模式或API未配置，使用模拟API
            response = await simulateRegisterAPI(data);
        } else {
            // 生产模式，使用真实API
            response = await callRegisterAPI({
                name: data.name,
                email: data.email,
                password: data.password,
                terms: true
            });
        }

        if (response.success) {
            showModalSuccessMessage('注册成功！请切换到登入页面');

            // Switch to login tab and pre-fill email
            setTimeout(() => {
                switchModalTab('login');
                document.getElementById('modalLoginEmail').value = data.email;
                document.getElementById('modalLoginPassword').focus();
                showModalSuccessMessage('请输入密码完成登入');
            }, 1500);

        } else {
            showModalErrorMessage(response.message || '注册失败，请重试');
        }

    } catch (error) {
        console.error('Modal registration error:', error);
        showModalErrorMessage('网络错误，请稍后重试');
    } finally {
        showModalLoading(false);
    }
}

// Validate modal login data
function validateModalLoginData(data) {
    const email = document.getElementById('modalLoginEmail').value;
    const password = document.getElementById('modalLoginPassword').value;

    if (!email || !isValidEmail(email)) {
        showModalErrorMessage('请输入有效的邮箱地址');
        document.getElementById('modalLoginEmail').focus();
        return false;
    }

    if (!password) {
        showModalErrorMessage('请输入密码');
        document.getElementById('modalLoginPassword').focus();
        return false;
    }

    return true;
}

// Validate modal registration data
function validateModalRegisterData(data) {
    const name = document.getElementById('modalRegisterName').value;
    const email = document.getElementById('modalRegisterEmail').value;
    const password = document.getElementById('modalRegisterPassword').value;
    const confirmPassword = document.getElementById('modalConfirmPassword').value;
    const termsChecked = document.querySelector('#modalRegisterTab input[type="checkbox"]').checked;

    if (!name || name.trim().length < 2) {
        showModalErrorMessage('用户名至少需要2个字符');
        document.getElementById('modalRegisterName').focus();
        return false;
    }

    if (!email || !isValidEmail(email)) {
        showModalErrorMessage('请输入有效的邮箱地址');
        document.getElementById('modalRegisterEmail').focus();
        return false;
    }

    if (!password || password.length < 8) {
        showModalErrorMessage('密码至少需要8个字符');
        document.getElementById('modalRegisterPassword').focus();
        return false;
    }

    if (password !== confirmPassword) {
        showModalErrorMessage('两次输入的密码不一致');
        document.getElementById('modalConfirmPassword').focus();
        return false;
    }

    if (!termsChecked) {
        showModalErrorMessage('请同意服务条款和隐私政策');
        return false;
    }

    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Calculate password strength
function calculatePasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    let level = 'weak';
    let text = '密码强度：弱';
    let color = '#ff6b6b';
    let width = '25%';

    if (score >= 6) {
        level = 'very-strong';
        text = '密码强度：极强';
        color = '#daa520';
        width = '100%';
    } else if (score >= 4) {
        level = 'strong';
        text = '密码强度：强';
        color = '#66bb6a';
        width = '75%';
    } else if (score >= 2) {
        level = 'medium';
        text = '密码强度：中等';
        color = '#ffa726';
        width = '50%';
    }

    return { level, text, color, width };
}

// Update modal password strength
function updateModalPasswordStrength(strength) {
    const strengthBar = document.querySelector('.modal-strength-bar');
    const strengthText = document.querySelector('.modal-strength-text');

    if (strengthBar) {
        strengthBar.style.width = strength.width;
        strengthBar.style.backgroundColor = strength.color;
    }

    if (strengthText) {
        strengthText.textContent = strength.text;
        strengthText.style.color = strength.color;
    }
}

// Validate modal password match
function validateModalPasswordMatch() {
    const password = document.getElementById('modalRegisterPassword').value;
    const confirmPassword = document.getElementById('modalConfirmPassword');
    const confirmValue = confirmPassword.value;

    if (confirmValue && password !== confirmValue) {
        confirmPassword.style.borderColor = '#ff6b6b';
        confirmPassword.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.3)';
    } else if (confirmValue) {
        confirmPassword.style.borderColor = '#66bb6a';
        confirmPassword.style.boxShadow = '0 0 10px rgba(102, 187, 106, 0.3)';
    } else {
        confirmPassword.style.borderColor = '';
        confirmPassword.style.boxShadow = '';
    }
}

// Toggle modal password visibility
function toggleModalPassword(inputId) {
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

// Handle Google login
async function handleGoogleLogin() {
    try {
        showModalLoading(true, '正在连接 Google...');

        if (isDevelopmentMode() || !API_CONFIG.OAUTH.GOOGLE.CLIENT_ID.includes('googleusercontent.com')) {
            // 开发模式或OAuth未配置，使用模拟
            const response = await simulateGoogleAuth();
            if (response.success) {
                showModalSuccessMessage('Google 登入成功！');

                setTimeout(() => {
                    updateHeaderForLoggedInUser(response.user);
                    closeLoginModal();
                    showToastMessage('Google 登入成功！', 'success');
                }, 1000);
            }
        } else {
            // 生产模式，使用真实OAuth
            closeLoginModal(); // 关闭弹窗，跳转到Google
            showToastMessage('正在跳转到 Google...', 'info');
            await initiateGoogleOAuth();
        }

    } catch (error) {
        showModalErrorMessage('Google 登入失败，请重试');
        console.error('Google login error:', error);
    } finally {
        showModalLoading(false);
    }
}

// Handle GitHub login
async function handleGitHubLogin() {
    try {
        showModalLoading(true, '正在连接 GitHub...');

        if (isDevelopmentMode() || !API_CONFIG.OAUTH.GITHUB.CLIENT_ID || API_CONFIG.OAUTH.GITHUB.CLIENT_ID.includes('你的')) {
            // 开发模式或OAuth未配置，使用模拟
            const response = await simulateGitHubAuth();
            if (response.success) {
                showModalSuccessMessage('GitHub 登入成功！');

                setTimeout(() => {
                    updateHeaderForLoggedInUser(response.user);
                    closeLoginModal();
                    showToastMessage('GitHub 登入成功！', 'success');
                }, 1000);
            }
        } else {
            // 生产模式，使用真实OAuth
            closeLoginModal(); // 关闭弹窗，跳转到GitHub
            showToastMessage('正在跳转到 GitHub...', 'info');
            await initiateGitHubOAuth();
        }

    } catch (error) {
        showModalErrorMessage('GitHub 登入失败，请重试');
        console.error('GitHub login error:', error);
    } finally {
        showModalLoading(false);
    }
}

// Handle forgot password
async function handleForgotPassword() {
    try {
        const email = document.getElementById('modalForgotEmail').value;

        if (!email || !isValidEmail(email)) {
            showModalErrorMessage('请输入有效的邮箱地址');
            document.getElementById('modalForgotEmail').focus();
            return;
        }

        // Show loading state
        const sendResetBtn = document.getElementById('sendResetBtn');
        sendResetBtn.disabled = true;
        sendResetBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>发送中...';

        // Call forgot password API
        const response = await callForgotPasswordAPI(email);

        if (response.success) {
            showModalSuccessMessage('重置链接已发送到您的邮箱，请查收');

            // Switch back to login after success
            setTimeout(() => {
                switchModalTab('login');
                showModalSuccessMessage('密码重置邮件已发送，请查收邮箱');
            }, 2000);
        } else {
            showModalErrorMessage(response.message || '发送重置邮件失败，请重试');
        }

    } catch (error) {
        console.error('Forgot password error:', error);
        showModalErrorMessage('网络错误，请稍后重试');
    } finally {
        // Reset button state
        const sendResetBtn = document.getElementById('sendResetBtn');
        sendResetBtn.disabled = false;
        sendResetBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>发送重置链接';
    }
}

// Toggle user menu
function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.classList.toggle('hidden');
    }
}

// Handle logout
async function handleLogout() {
    try {
        console.log('Logout initiated');

        // Show confirmation dialog with better styling
        const confirmed = confirm('确定要退出登入吗？\n\n退出后您需要重新登录才能访问个人功能。');
        if (!confirmed) {
            console.log('Logout cancelled by user');
            return;
        }

        // Show logout loading state
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>退出中...';
            logoutBtn.disabled = true;
        }

        // Get token from both localStorage and sessionStorage
        const token = localStorage.getItem('destinyai_token') || sessionStorage.getItem('destinyai_token');

        // Call logout API
        if (token) {
            try {
                const apiUrl = window.API_BASE_URL || window.location.origin + '/api';
                console.log('Calling logout API...');

                const response = await fetch(`${apiUrl}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();
                console.log('Logout API response:', result);
            } catch (error) {
                console.warn('Logout API call failed:', error);
                // Continue with local logout even if API fails
            }
        }

        // Clear all session data from both storages
        console.log('Clearing session data...');

        // Clear localStorage
        localStorage.removeItem('destinyai_user');
        localStorage.removeItem('destinyai_token');
        localStorage.removeItem('destinyai_refresh_token');
        localStorage.removeItem('destinyai_demo_users');

        // Clear sessionStorage
        sessionStorage.removeItem('destinyai_user');
        sessionStorage.removeItem('destinyai_token');
        sessionStorage.removeItem('destinyai_refresh_token');

        // Clear any cached data
        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames
                        .filter(name => name.includes('destinyai'))
                        .map(name => caches.delete(name))
                );
                console.log('Cache cleared');
            } catch (error) {
                console.warn('Cache clear failed:', error);
            }
        }

        // Update header UI
        updateHeaderForGuest();

        // Hide user menu
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.classList.add('hidden');
        }

        // Show success message
        showToastMessage('已安全退出登入', 'success');
        console.log('Logout completed successfully');

        // Redirect to home page after logout
        setTimeout(() => {
            const currentPath = window.location.pathname;
            console.log('Current path:', currentPath);

            // Redirect if not on home page
            if (currentPath !== '/' && currentPath !== '/index.html') {
                console.log('Redirecting to home page...');
                window.location.href = '/index.html';
            } else {
                // Reload home page to reset state
                console.log('Reloading home page...');
                window.location.reload();
            }
        }, 1500);

    } catch (error) {
        console.error('Logout error:', error);
        showToastMessage('退出登入时发生错误: ' + error.message, 'error');

        // Reset logout button state
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt mr-2"></i>退出登入';
            logoutBtn.disabled = false;
        }
    }
}

// Update header for logged in user
function updateHeaderForLoggedInUser(user) {
    console.log('[Header Auth] Updating header for logged in user:', user.email);

    const guestView = document.getElementById('guestView');
    const userView = document.getElementById('userView');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const userIcon = document.getElementById('userIcon');
    const userMenuBtn = document.getElementById('userMenuBtn');

    if (guestView && userView) {
        guestView.classList.add('hidden');
        userView.classList.remove('hidden');
        userView.classList.add('block'); // 改为 block，内部的 flex 容器会处理布局

        console.log('[Header Auth] userView classes:', userView.className);
        console.log('[Header Auth] userView display:', getComputedStyle(userView).display);
        console.log('[Header Auth] userMenuBtn exists:', !!userMenuBtn);

        if (userMenuBtn) {
            console.log('[Header Auth] userMenuBtn display:', getComputedStyle(userMenuBtn).display);
        }
    }

    if (userName) {
        userName.textContent = user.name || user.email.split('@')[0];
    }

    if (user.picture || user.avatar) {
        if (userAvatar) {
            userAvatar.src = user.picture || user.avatar;
            userAvatar.classList.remove('hidden');
        }
        if (userIcon) {
            userIcon.classList.add('hidden');
        }
    }
}

// Update header for guest user
function updateHeaderForGuest() {
    console.log('Updating header for guest user');

    const guestView = document.getElementById('guestView');
    const userView = document.getElementById('userView');

    if (guestView && userView) {
        guestView.classList.remove('hidden');
        userView.classList.add('hidden');
        console.log('Header updated: guest view shown, user view hidden');
    } else {
        console.warn('Guest/User view elements not found');
    }

    // Reset user avatar and name
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');

    if (userAvatar) {
        userAvatar.src = '';
        userAvatar.classList.add('hidden');
    }

    if (userName) {
        userName.textContent = '';
    }
}

// Check user session on page load
function checkUserSession() {
    console.log('Checking user session...');

    // Check both localStorage and sessionStorage
    const token = localStorage.getItem('destinyai_token') || sessionStorage.getItem('destinyai_token');
    const userData = localStorage.getItem('destinyai_user') || sessionStorage.getItem('destinyai_user');

    if (token && userData) {
        try {
            const user = JSON.parse(userData);
            console.log('User session found:', user.email);
            updateHeaderForLoggedInUser(user);
        } catch (error) {
            console.error('Error parsing user data:', error);
            // Clear invalid session data from both storages
            localStorage.removeItem('destinyai_user');
            localStorage.removeItem('destinyai_token');
            sessionStorage.removeItem('destinyai_user');
            sessionStorage.removeItem('destinyai_token');
            updateHeaderForGuest();
        }
    } else {
        console.log('No user session found');
        updateHeaderForGuest();
    }
}

// Modal utility functions
function showModalLoading(show, message = '正在处理...') {
    const submitBtns = document.querySelectorAll('#modalLoginForm button[type="submit"]');
    const socialBtns = document.querySelectorAll('#modalGoogleLogin, #modalGithubLogin');

    submitBtns.forEach(btn => {
        if (show) {
            btn.disabled = true;
            btn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>${message}`;
        } else {
            btn.disabled = false;
            if (currentModalTab === 'login') {
                btn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>登入账户';
            } else {
                btn.innerHTML = '<i class="fas fa-user-plus mr-2"></i>创建账户';
            }
        }
    });

    socialBtns.forEach(btn => {
        btn.disabled = show;
    });

    isModalLoading = show;
}

function showModalErrorMessage(message) {
    clearModalMessages();
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 text-sm';
    messageDiv.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;

    const form = document.getElementById('modalLoginForm');
    form.insertBefore(messageDiv, form.firstChild);

    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function showModalSuccessMessage(message) {
    clearModalMessages();
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bg-green-500/20 border border-green-500/30 text-green-400 p-3 rounded-lg mb-4 text-sm';
    messageDiv.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;

    const form = document.getElementById('modalLoginForm');
    form.insertBefore(messageDiv, form.firstChild);
}

function clearModalMessages() {
    const messages = document.querySelectorAll('#modalLoginForm > div:first-child');
    messages.forEach(msg => {
        if (msg.className.includes('bg-red-500') || msg.className.includes('bg-green-500')) {
            msg.remove();
        }
    });
}

function clearModalForm() {
    const form = document.getElementById('modalLoginForm');
    const inputs = form.querySelectorAll('input:not([type="checkbox"])');
    inputs.forEach(input => {
        input.value = '';
        input.style.borderColor = '';
        input.style.boxShadow = '';
    });

    // Reset checkboxes
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Hide password strength
    const strengthIndicator = document.getElementById('modalPasswordStrength');
    if (strengthIndicator) {
        strengthIndicator.classList.add('hidden');
    }

    clearModalMessages();
}

// Use existing API simulation functions from login.js
async function simulateLoginAPI(data) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (data.email === 'test@example.com' && data.password === 'password123') {
        return {
            success: true,
            token: 'demo_token_' + Date.now(),
            user: {
                id: 1,
                name: '测试用户',
                email: data.email,
                avatar: null
            }
        };
    }

    if (data.password.length >= 8) {
        return {
            success: true,
            token: 'demo_token_' + Date.now(),
            user: {
                id: Math.floor(Math.random() * 1000),
                name: data.email.split('@')[0],
                email: data.email,
                avatar: null
            }
        };
    }

    return {
        success: false,
        message: '邮箱或密码错误'
    };
}

async function simulateRegisterAPI(data) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const existingUsers = JSON.parse(localStorage.getItem('destinyai_demo_users') || '[]');
    if (existingUsers.some(user => user.email === data.email)) {
        return {
            success: false,
            message: '该邮箱已被注册'
        };
    }

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
        message: '注册成功！'
    };
}

async function simulateGoogleAuth() {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        success: true,
        token: 'google_demo_token_' + Date.now(),
        user: {
            id: 'google_' + Date.now(),
            name: window.i18n ? window.i18n.t('nav.google_user') : 'Google 用户',
            email: 'google.user@gmail.com',
            picture: 'https://via.placeholder.com/32x32/daa520/1a1a2e?text=G',
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
            name: window.i18n ? window.i18n.t('nav.github_user') : 'GitHub 用户',
            email: 'github.user@example.com',
            picture: 'https://via.placeholder.com/32x32/333333/ffffff?text=GH',
            provider: 'github'
        }
    };
}