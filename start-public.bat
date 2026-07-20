@echo off
chcp 65001 >nul
echo ========================================
echo   PP平台 - 外网启动
echo ========================================
echo.
echo 正在启动服务器和隧道...
start "PP-Server" cmd /c "cd /d D:\期货交割库\pp-delivery-platform && node server\index.cjs"
timeout /t 3 /nobreak >nul
cd /d D:\期货交割库\pp-delivery-platform
npx localtunnel --port 3000
pause
