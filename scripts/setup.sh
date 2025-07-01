#!/bin/bash

# Discord Voice AI Bot Setup Script

echo "🤖 Discord Voice AI Bot Setup"
echo "============================="

# Check Node.js version
echo "📋 Checking prerequisites..."
node_version=$(node --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Node.js $node_version detected"
else
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

# Check npm
npm_version=$(npm --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ npm $npm_version detected"
else
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

# Check FFmpeg
ffmpeg_version=$(ffmpeg -version 2>/dev/null | head -n1)
if [ $? -eq 0 ]; then
    echo "✅ FFmpeg detected"
else
    echo "⚠️  FFmpeg not found. Audio processing may not work properly."
    echo "   Please install FFmpeg: https://ffmpeg.org/download.html"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "📝 Setting up environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Environment file created (.env)"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file with your credentials:"
    echo "   - DISCORD_TOKEN=your_discord_bot_token"
    echo "   - DISCORD_CLIENT_ID=your_bot_client_id"
    echo "   - OPENAI_API_KEY=your_openai_api_key"
else
    echo "ℹ️  Environment file already exists"
fi

echo ""
echo "📁 Creating required directories..."
mkdir -p logs temp

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your tokens"
echo "2. Run 'npm run deploy' to register slash commands"
echo "3. Run 'npm run dev' to start the bot"
echo ""
echo "📖 For detailed setup instructions, see:"
echo "   - README.md"
echo "   - discord_voice_ai_bot_guide (1).md"
