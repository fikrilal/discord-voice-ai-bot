@echo off
setlocal

echo 🤖 Discord Voice AI Bot Setup
echo =============================

REM Check Node.js version
echo 📋 Checking prerequisites...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f %%i in ('node --version') do echo ✅ Node.js %%i detected
) else (
    echo ❌ Node.js not found. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check npm
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f %%i in ('npm --version') do echo ✅ npm %%i detected
) else (
    echo ❌ npm not found. Please install npm first.
    pause
    exit /b 1
)

REM Check FFmpeg
ffmpeg -version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ FFmpeg detected
) else (
    echo ⚠️  FFmpeg not found. Audio processing may not work properly.
    echo    Please install FFmpeg: https://ffmpeg.org/download.html
)

echo.
echo 📦 Installing dependencies...
call npm install

if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully
) else (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 📝 Setting up environment file...
if not exist .env (
    copy .env.example .env >nul
    echo ✅ Environment file created (.env)
    echo.
    echo ⚠️  IMPORTANT: Please edit .env file with your credentials:
    echo    - DISCORD_TOKEN=your_discord_bot_token
    echo    - DISCORD_CLIENT_ID=your_bot_client_id  
    echo    - OPENAI_API_KEY=your_openai_api_key
) else (
    echo ℹ️  Environment file already exists
)

echo.
echo 📁 Creating required directories...
if not exist logs mkdir logs
if not exist temp mkdir temp

echo.
echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Edit .env file with your tokens
echo 2. Run 'npm run deploy' to register slash commands
echo 3. Run 'npm run dev' to start the bot
echo.
echo 📖 For detailed setup instructions, see:
echo    - README.md
echo    - discord_voice_ai_bot_guide (1).md

pause
