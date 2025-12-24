// ============================================
// USER MENU FINAL FIX - 用户下拉菜单最终修复版
// ============================================

(function () {
    'use strict';

    // 用户菜单管理类
    class UserMenuManager {
        constructor() {
            this.userView = null;
            this.guestView = null;
            this.userMenuBtn = null;
            this.userMenu = null;
            this.userName = null;
            this.userAvatar = null;
            this.userIcon = null;
            this.loginBtn = null;
            this.logoutBtn = null;
            this.isMenuOpen = false;
            this.clickTimeout = null;

            this.init();
            this.setupLanguageListener();
        }

        // 监听语言切换
        setupLanguageListener() {
            window.addEventListener('languageChanged', () => {
                this.updateUI();
            });
        }

        // 初始化
        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
        }

        // 设置
        setup() {
            this.cacheElements();
            this.bindEvents();
            this.updateUI();

            console.log('[User Menu Final] Initialized');
        }

        // 缓存DOM元素
        cacheElements() {
            this.userView = document.getElementById('userView');
            this.guestView = document.getElementById('guestView');
            this.userMenuBtn = document.getElementById('userMenuBtn');
            this.userMenu = document.getElementById('userMenu');
            this.userName = document.getElementById('userName');
            this.userAvatar = document.getElementById('userAvatar');
            this.userIcon = document.getElementById('userIcon');
            this.loginBtn = document.getElementById('loginBtn');
            this.logoutBtn = document.getElementById('logoutBtn');
        }

        // 绑定事件
        bindEvents() {
            // 用户菜单按钮点击
            if (this.userMenuBtn) {
                this.userMenuBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    this.toggleMenu();
                });
            }

            // 阻止菜单内部所有点击事件冒泡
            if (this.userMenu) {
                this.userMenu.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }

            // 登录按钮
            if (this.loginBtn) {
                this.loginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleLogin();
                });
            }

            // 登出按钮
            if (this.logoutBtn) {
                this.logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleLogout();
                });
            }

            // 延迟绑定document点击事件
            setTimeout(() => {
                document.addEventListener('click', (e) => {
                    if (!this.isMenuOpen) return;

                    const clickedMenu = this.userMenu && this.userMenu.contains(e.target);
                    const clickedButton = this.userMenuBtn && this.userMenuBtn.contains(e.target);

                    if (!clickedMenu && !clickedButton) {
                        this.closeMenu();
                    }
                }, true);
            }, 100);

            // ESC键
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isMenuOpen) {
                    this.closeMenu();
                }
            });

            // 监听认证状态变化
            window.addEventListener('authStateChanged', (e) => {
                console.log('[User Menu Final] Auth state changed:', e.detail);
                this.updateUI();
            });

            // 拦截菜单内的锚点点击 (处理 profile.html#readings 等)
            if (this.userMenu) {
                this.userMenu.addEventListener('click', (e) => {
                    const link = e.target.closest('a');
                    if (link && link.hash && window.location.pathname.includes('profile.html')) {
                        const hash = link.hash.replace('#', '');
                        // 如果在 profile 页面，尝试通过本地 ProfileManager 切换
                        if (window.ProfileManagerInstance) {
                            console.log('[User Menu] Intercepting menu hash click:', hash);

                            // 映射哈希
                            const hashToTab = { 'readings': 'history', 'settings': 'dashboard' };
                            const targetTabId = hashToTab[hash] || hash;

                            window.ProfileManagerInstance.switchTab(targetTabId);
                            this.closeMenu();
                            e.preventDefault();
                        }
                    }
                });
            }
        }

        // 更新UI
        updateUI() {
            const isAuthenticated = window.AuthService ? window.AuthService.isAuthenticated() : false;

            if (isAuthenticated) {
                this.showUserView();
            } else {
                this.showGuestView();
            }
        }

        // 显示用户视图
        showUserView() {
            if (!this.userView || !this.guestView) return;

            const user = window.AuthService ? window.AuthService.getCurrentUser() : null;

            if (user) {
                this.updateUserInfo(user);
                this.userView.classList.remove('hidden');
                this.guestView.classList.add('hidden');

                console.log('[User Menu Final] Showing user view for:', user.email);
            }
        }

        // 显示访客视图
        showGuestView() {
            if (!this.userView || !this.guestView) return;

            this.userView.classList.add('hidden');
            this.guestView.classList.remove('hidden');

            console.log('[User Menu Final] Showing guest view');
        }

        // 更新用户信息
        updateUserInfo(user) {
            // 更新导航栏用户名
            if (this.userName) {
                const displayName = this.getDisplayName(user);
                this.userName.textContent = displayName;
            }

            // 更新头像
            if (this.userAvatar && this.userIcon) {
                if (user.avatar) {
                    this.userAvatar.src = user.avatar;
                    this.userAvatar.classList.remove('hidden');
                    this.userIcon.classList.add('hidden');
                } else {
                    this.userAvatar.classList.add('hidden');
                    this.userIcon.classList.remove('hidden');
                }
            }

            // 更新菜单内的用户信息
            const menuUserName = document.getElementById('menuUserName');
            const menuUserEmail = document.getElementById('menuUserEmail');
            const menuUserStatus = document.getElementById('menuUserStatus');

            if (menuUserName) {
                menuUserName.textContent = user.name || this.getDisplayName(user);
            }

            if (menuUserEmail) {
                menuUserEmail.textContent = user.email || '';
            }

            if (menuUserStatus) {
                if (user.isPremium || user.level === 'premium') {
                    menuUserStatus.textContent = window.i18n ? window.i18n.t('nav.premium') : 'VIP Member';
                    menuUserStatus.style.color = '#ffd700';
                } else {
                    menuUserStatus.textContent = window.i18n ? window.i18n.t('menuUserStatus.free') : 'Free Member';
                    menuUserStatus.style.color = '#c0c0c0';
                }
            }
        }

        // 获取显示名称
        getDisplayName(user) {
            if (user.name) {
                return user.name;
            }

            if (user.email) {
                const username = user.email.split('@')[0];
                return username.length > 10 ? username.substring(0, 10) + '...' : username;
            }

            return window.i18n ? window.i18n.t('common.user') : 'User';
        }

        // 切换菜单
        toggleMenu() {
            if (this.isMenuOpen) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        }

        // 打开菜单
        openMenu() {
            if (!this.userMenu || this.isMenuOpen) return;

            this.isMenuOpen = true;
            this.userMenu.classList.remove('hidden');

            // 强制重绘
            void this.userMenu.offsetWidth;

            // 添加动画
            requestAnimationFrame(() => {
                this.userMenu.style.transition = 'all 0.2s ease-out';
                this.userMenu.style.opacity = '1';
                this.userMenu.style.transform = 'translateY(0)';
            });

            console.log('[User Menu Final] Menu opened');
        }

        // 关闭菜单
        closeMenu() {
            if (!this.userMenu || !this.isMenuOpen) return;

            this.isMenuOpen = false;

            this.userMenu.style.opacity = '0';
            this.userMenu.style.transform = 'translateY(-10px)';

            setTimeout(() => {
                if (this.userMenu && !this.isMenuOpen) {
                    this.userMenu.classList.add('hidden');
                }
            }, 200);

            console.log('[User Menu Final] Menu closed');
        }

        // 处理登录
        handleLogin() {
            console.log('[User Menu Final] Login button clicked');

            if (window.AuthService) {
                window.AuthService.saveReturnUrl(window.location.pathname);
            }

            window.location.href = 'login.html';
        }

        // 处理登出
        handleLogout() {
            console.log('[User Menu Final] Logout button clicked');

            const confirmMsg = window.i18n ? window.i18n.t('common.confirm_logout') : 'Are you sure you want to logout?';
            if (confirm(confirmMsg)) {
                this.closeMenu();

                setTimeout(() => {
                    if (window.AuthService) {
                        window.AuthService.logout();
                    } else {
                        localStorage.removeItem('destinyai_token');
                        localStorage.removeItem('destinyai_user');
                        sessionStorage.removeItem('destinyai_token');
                        sessionStorage.removeItem('destinyai_user');

                        window.location.reload();
                    }
                }, 300);
            }
        }
    }

    // 创建全局实例
    window.UserMenuManager = new UserMenuManager();

})();
