# 登录入口优化验证脚本
# 自动验证所有修改是否正确应用

Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           登录入口优化 - 自动验证脚本                        ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$totalTests = 0
$passedTests = 0
$failedTests = 0

function Test-Item {
    param(
        [string]$TestName,
        [scriptblock]$TestScript
    )
    
    $script:totalTests++
    Write-Host "测试 $totalTests : $TestName" -ForegroundColor Yellow
    
    try {
        $result = & $TestScript
        if ($result) {
            Write-Host "  ✅ 通过" -ForegroundColor Green
            $script:passedTests++
            return $true
        } else {
            Write-Host "  ❌ 失败" -ForegroundColor Red
            $script:failedTests++
            return $false
        }
    } catch {
        Write-Host "  ❌ 错误: $_" -ForegroundColor Red
        $script:failedTests++
        return $false
    }
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "1. 验证翻译键" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# 测试 translations.js 中的翻译键
Test-Item "translations.js 包含 nav.login (英文)" {
    $content = Get-Content "translations.js" -Raw
    $content -match "'nav\.login':\s*'Login'"
}

Test-Item "translations.js 包含 nav.login (简体中文)" {
    $content = Get-Content "translations.js" -Raw
    $content -match "'nav\.login':\s*'登入'"
}

Test-Item "translations.js 包含 nav.logout (英文)" {
    $content = Get-Content "translations.js" -Raw
    $content -match "'nav\.logout':\s*'Logout'"
}

Test-Item "translations.js 包含 nav.premium (简体中文)" {
    $content = Get-Content "translations.js" -Raw
    $content -match "'nav\.premium':\s*'会员服务'"
}

# 测试 i18n.js 中的翻译键
Test-Item "i18n.js 包含 nav.login (英文)" {
    $content = Get-Content "i18n.js" -Raw
    $content -match "'nav\.login':\s*'Login'"
}

Test-Item "i18n.js 包含 nav.logout (简体中文)" {
    $content = Get-Content "i18n.js" -Raw
    $content -match "'nav\.logout':\s*'退出登入'"
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "2. 验证脚本加载顺序" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$htmlFiles = @("index.html", "divination.html", "fengshui.html", "iching.html", "profile.html", "payment.html")

foreach ($file in $htmlFiles) {
    Test-Item "$file 脚本加载顺序正确" {
        $content = Get-Content $file -Raw
        # 检查 translations.js 在 unified-i18n.js 之前
        $translationsPos = $content.IndexOf('src="translations.js"')
        $unifiedPos = $content.IndexOf('src="unified-i18n.js"')
        ($translationsPos -gt 0) -and ($unifiedPos -gt 0) -and ($translationsPos -lt $unifiedPos)
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "3. 验证登录按钮行为" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Test-Item "header-auth.js 包含 login.html 跳转" {
    $content = Get-Content "header-auth.js" -Raw
    $content -match "window\.location\.href\s*=\s*['\"]login\.html['\"]"
}

Test-Item "header-auth.js 不直接调用 openLoginModal" {
    $content = Get-Content "header-auth.js" -Raw
    # 检查 loginBtn 的事件监听器不是直接绑定到 openLoginModal
    $content -notmatch "loginBtn\.addEventListener\(['\"]click['\"]\s*,\s*openLoginModal\)"
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "4. 验证文件存在性" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$requiredFiles = @(
    "translations.js",
    "i18n.js",
    "header-auth.js",
    "login.html",
    "test-login-fix.html",
    "test-login-fix.bat",
    "test-all-login-features.bat",
    "LOGIN_ENTRY_FIX.md",
    "LOGIN_FIX_CHECKLIST.md"
)

foreach ($file in $requiredFiles) {
    Test-Item "文件存在: $file" {
        Test-Path $file
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "5. 验证 HTML 页面中的翻译属性" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Test-Item "index.html 包含 data-i18n='nav.login'" {
    $content = Get-Content "index.html" -Raw
    $content -match 'data-i18n=["\']nav\.login["\']'
}

Test-Item "index.html 包含 data-i18n='nav.logout'" {
    $content = Get-Content "index.html" -Raw
    $content -match 'data-i18n=["\']nav\.logout["\']'
}

Test-Item "index.html 包含 data-i18n='nav.premium'" {
    $content = Get-Content "index.html" -Raw
    $content -match 'data-i18n=["\']nav\.premium["\']'
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                      验证结果                                ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "总测试数: $totalTests" -ForegroundColor White
Write-Host "通过: $passedTests" -ForegroundColor Green
Write-Host "失败: $failedTests" -ForegroundColor Red
Write-Host ""

$percentage = [math]::Round(($passedTests / $totalTests) * 100, 2)
Write-Host "通过率: $percentage%" -ForegroundColor $(if ($percentage -eq 100) { "Green" } elseif ($percentage -ge 80) { "Yellow" } else { "Red" })
Write-Host ""

if ($failedTests -eq 0) {
    Write-Host "✅ 所有测试通过！修复已成功应用。" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步:" -ForegroundColor Cyan
    Write-Host "  1. 运行 test-all-login-features.bat 进行功能测试" -ForegroundColor White
    Write-Host "  2. 在浏览器中测试所有页面" -ForegroundColor White
    Write-Host "  3. 验证语言切换功能" -ForegroundColor White
    Write-Host "  4. 测试登录流程" -ForegroundColor White
} else {
    Write-Host "❌ 有 $failedTests 个测试失败。请检查上述失败的测试项。" -ForegroundColor Red
    Write-Host ""
    Write-Host "故障排除:" -ForegroundColor Cyan
    Write-Host "  1. 确认所有文件都已正确修改" -ForegroundColor White
    Write-Host "  2. 检查文件编码是否正确 (UTF-8)" -ForegroundColor White
    Write-Host "  3. 查看详细文档: LOGIN_ENTRY_FIX.md" -ForegroundColor White
    Write-Host "  4. 运行 test-login-fix.bat 进行详细测试" -ForegroundColor White
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "验证完成！" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# 返回退出代码
exit $failedTests
