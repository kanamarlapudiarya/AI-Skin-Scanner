@echo off
cd /d "%~dp0"
echo ===================================================
echo   AI Skin Scanner - Development Server Launcher
echo ===================================================
echo.
echo Checking dependencies...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)
echo Starting Vite development server...
echo.
call npm run dev
pause
