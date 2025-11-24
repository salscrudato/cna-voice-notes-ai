@echo off
REM CNA Voice Notes AI - Quick Setup Script for Windows
REM This script helps you set up the application with your OpenAI API key

setlocal enabledelayedexpansion

echo.
echo [ROCKET] CNA Voice Notes AI - Setup Script
echo ====================================
echo.

REM Check if .env.local exists
if exist .env.local (
    echo [CHECK] .env.local already exists
    set /p reconfigure="Do you want to reconfigure it? (y/n): "
    if /i not "!reconfigure!"=="y" (
        echo Skipping configuration...
        exit /b 0
    )
)

REM Copy .env.example to .env.local
echo [CLIPBOARD] Creating .env.local from .env.example...
copy .env.example .env.local >nul
echo [CHECK] Created .env.local
echo.

REM Prompt for API key
echo [KEY] OpenAI API Key Setup
echo ======================
echo Get your API key from: https://platform.openai.com/api-keys
echo.
set /p api_key="Enter your OpenAI API key (sk-...): "

if "!api_key!"=="" (
    echo [X] API key cannot be empty
    exit /b 1
)

REM Update .env.local with the API key
powershell -Command "(Get-Content .env.local) -replace 'sk-your-api-key-here', '!api_key!' | Set-Content .env.local"

echo [CHECK] API key configured in .env.local
echo.

REM Test the API key
echo [TEST] Testing API key...
if exist node.exe (
    node test-openai-api.js "!api_key!"
) else (
    echo [WARNING] Node.js not found. Skipping API test.
    echo You can test manually with: node test-openai-api.js
)

echo.
echo [STAR] Setup complete!
echo.
echo Next steps:
echo 1. Start the dev server: npm run dev
echo 2. Open http://localhost:5174 in your browser
echo 3. Start chatting!
echo.

pause

