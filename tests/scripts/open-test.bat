@echo off
echo ========================================
echo Opening Destiny AI Test Pages
echo ========================================
echo.

REM Wait a moment for server to be ready
timeout /t 2 /nobreak >nul

echo Opening test pages in browser...
echo.

REM Open test page
start http://localhost:3000/test-login.html

REM Wait a bit
timeout /t 1 /nobreak >nul

REM Open login page
start http://localhost:3000/login.html

echo.
echo ========================================
echo Pages opened:
echo - Test Page: http://localhost:3000/test-login.html
echo - Login Page: http://localhost:3000/login.html
echo ========================================
echo.
echo Test Account:
echo Email: test@example.com
echo Password: password123
echo ========================================
