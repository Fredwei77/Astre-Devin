@echo off
chcp 65001 > nul
echo ========================================
echo 登录页面翻译测试
echo Login Page Translation Test
echo ========================================
echo.
echo 正在启动测试服务器...
echo Starting test server...
echo.

start http://localhost:3000/login.html

echo.
echo ========================================
echo 测试步骤 / Test Steps:
echo ========================================
echo.
echo 【测试1: 英文界面】
echo Test 1: English Interface
echo ----------------------------------------
echo 1. 页面默认显示中文
echo    Page defaults to Chinese
echo 2. 点击语言选择器，选择 "English"
echo    Click language selector, choose "English"
echo 3. ✓ 验证所有文本变成英文
echo    ✓ Verify all text changes to English
echo    - Title: "Welcome Back to Destiny Realm"
echo    - Tabs: "Login" / "Register"
echo    - Email: "Email Address"
echo    - Password: "Password"
echo    - Button: "Login"
echo.
echo 【测试2: 登录表单】
echo Test 2: Login Form
echo ----------------------------------------
echo 1. 在英文界面下
echo    In English interface
echo 2. 输入无效邮箱（如 "test"）
echo    Enter invalid email (e.g., "test")
echo 3. 点击登录
echo    Click login
echo 4. ✓ 验证错误提示是英文
echo    ✓ Verify error message is in English
echo    "Please enter a valid email address"
echo.
echo 【测试3: 注册表单】
echo Test 3: Register Form
echo ----------------------------------------
echo 1. 切换到 "Register" 标签
echo    Switch to "Register" tab
echo 2. 输入短用户名（如 "a"）
echo    Enter short username (e.g., "a")
echo 3. 点击创建账户
echo    Click create account
echo 4. ✓ 验证错误提示是英文
echo    ✓ Verify error message is in English
echo    "Username must be at least 2 characters"
echo.
echo 【测试4: 密码强度】
echo Test 4: Password Strength
echo ----------------------------------------
echo 1. 在注册表单中
echo    In register form
echo 2. 输入弱密码（如 "12345678"）
echo    Enter weak password (e.g., "12345678")
echo 3. ✓ 验证密码强度提示是英文
echo    ✓ Verify password strength is in English
echo    "Password Strength: Weak"
echo 4. 输入强密码（如 "Abc123!@#"）
echo    Enter strong password (e.g., "Abc123!@#")
echo 5. ✓ 验证密码强度提示更新
echo    ✓ Verify password strength updates
echo    "Password Strength: Strong"
echo.
echo 【测试5: 中文界面】
echo Test 5: Chinese Interface
echo ----------------------------------------
echo 1. 切换语言选择器到 "简体中文"
echo    Switch language selector to "简体中文"
echo 2. ✓ 验证所有文本变成中文
echo    ✓ Verify all text changes to Chinese
echo    - 标题: "欢迎回到命运之境"
echo    - 标签: "登入" / "注册"
echo    - 邮箱: "邮箱地址"
echo    - 密码: "密码"
echo    - 按钮: "登入账户"
echo.
echo 【测试6: 社交登录】
echo Test 6: Social Login
echo ----------------------------------------
echo 1. 在英文界面下
echo    In English interface
echo 2. 点击 "Login with Google"
echo    Click "Login with Google"
echo 3. ✓ 验证加载提示是英文
echo    ✓ Verify loading message is in English
echo    "Connecting to Google..."
echo 4. 切换到中文界面
echo    Switch to Chinese interface
echo 5. 点击 "使用 Google 账户登入"
echo    Click "使用 Google 账户登入"
echo 6. ✓ 验证加载提示是中文
echo    ✓ Verify loading message is in Chinese
echo    "正在连接 Google..."
echo.
echo ========================================
echo 验证要点 / Verification Points:
echo ========================================
echo ✓ 页面标题和副标题翻译
echo   Page title and subtitle translation
echo ✓ 标签按钮翻译（登入/注册）
echo   Tab buttons translation (Login/Register)
echo ✓ 表单字段标签翻译
echo   Form field labels translation
echo ✓ 占位符文本翻译
echo   Placeholder text translation
echo ✓ 按钮文本翻译
echo   Button text translation
echo ✓ 错误消息翻译
echo   Error messages translation
echo ✓ 成功消息翻译
echo   Success messages translation
echo ✓ 密码强度提示翻译
echo   Password strength translation
echo ✓ 社交登录按钮翻译
echo   Social login buttons translation
echo ✓ 加载提示翻译
echo   Loading messages translation
echo ✓ 语言切换立即生效
echo   Language switch takes effect immediately
echo.
echo ========================================
echo 预期结果 / Expected Results:
echo ========================================
echo.
echo 英文界面 / English Interface:
echo - Title: "Welcome Back to Destiny Realm"
echo - Subtitle: "Login to your account and explore..."
echo - Login Tab: "Login"
echo - Register Tab: "Register"
echo - Email Label: "Email Address"
echo - Password Label: "Password"
echo - Remember Me: "Remember me"
echo - Forgot Password: "Forgot password?"
echo - Login Button: "Login"
echo - Register Button: "Create Account"
echo - Google Button: "Login with Google"
echo - GitHub Button: "Login with GitHub"
echo.
echo 中文界面 / Chinese Interface:
echo - 标题: "欢迎回到命运之境"
echo - 副标题: "登入您的账户，探索神秘的AI占卜世界"
echo - 登入标签: "登入"
echo - 注册标签: "注册"
echo - 邮箱标签: "邮箱地址"
echo - 密码标签: "密码"
echo - 记住我: "记住我"
echo - 忘记密码: "忘记密码？"
echo - 登入按钮: "登入账户"
echo - 注册按钮: "创建账户"
echo - Google按钮: "使用 Google 账户登入"
echo - GitHub按钮: "使用 GitHub 账户登入"
echo.
echo ========================================
echo 常见问题 / Common Issues:
echo ========================================
echo.
echo Q: 切换语言后文本没有更新？
echo A: 1. 刷新页面（Ctrl+F5）
echo    2. 清除浏览器缓存
echo    3. 检查浏览器控制台是否有错误
echo.
echo Q: 错误消息还是中文？
echo A: 1. 确认已切换到英文界面
echo    2. 检查 translations.js 是否正确加载
echo    3. 查看控制台日志
echo.
echo Q: 占位符没有翻译？
echo A: 1. 检查是否使用了 data-i18n-placeholder 属性
echo    2. 确认 unified-i18n.js 已加载
echo    3. 刷新页面重试
echo.
echo ========================================
echo.
echo 按任意键退出...
echo Press any key to exit...
pause > nul
