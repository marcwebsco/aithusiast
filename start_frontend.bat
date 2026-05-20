@echo off
echo ============================================
echo Starting AIthusiast Frontend
echo ============================================
echo.

REM Check if Node is available
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    npm install
)

echo.
echo Starting React development server on http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm start
