# Discord Voice AI Bot

A sophisticated Discord bot that enables natural voice conversations using AI. Users can speak directly to the bot in voice channels and receive intelligent spoken responses powered by OpenAI's cutting-edge APIs.

## ✨ Features

- 🎤 **Voice-to-Voice Communication** - Speak naturally and get AI responses
- 🧠 **Context-Aware Conversations** - Maintains conversation history
- 🔄 **Real-time Processing** - Low-latency voice interactions
- 👥 **Multi-user Support** - Handle multiple users simultaneously
- ⚡ **Easy Deployment** - Ready for cloud deployment

## 🏗️ Tech Stack

- **Node.js 18+** - Runtime environment
- **Discord.js v14** - Discord API integration
- **OpenAI API** - Speech-to-text, text generation, and text-to-speech
- **FFmpeg** - Audio processing
- **Redis** (optional) - Conversation caching
- **PM2** - Production process management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- FFmpeg installed on your system
- Discord Bot Token
- OpenAI API Key

### Installation

1. **Clone and install dependencies**

   ```bash
   git clone <repository-url>
   cd discord-voice-ai-bot
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your credentials:

   ```env
   DISCORD_TOKEN=your_discord_bot_token
   DISCORD_CLIENT_ID=your_bot_client_id
   OPENAI_API_KEY=your_openai_api_key
   ```

3. **Deploy slash commands**

   ```bash
   npm run deploy
   ```

4. **Start the bot**
   ```bash
   npm run dev
   ```

## 📋 Commands

| Command  | Description                                 |
| -------- | ------------------------------------------- |
| `/join`  | Join your voice channel and start listening |
| `/leave` | Leave the voice channel                     |
| `/ping`  | Check bot latency and status                |
| `/help`  | Show help information                       |

## 🎯 Usage

1. Join a voice channel in Discord
2. Use `/join` command to invite the bot
3. Start speaking - the bot will automatically detect your voice
4. Receive AI-powered spoken responses
5. Use `/leave` when done

## 🔧 Configuration

### Environment Variables

- `DISCORD_TOKEN` - Your Discord bot token
- `DISCORD_CLIENT_ID` - Your bot's client ID
- `OPENAI_API_KEY` - Your OpenAI API key
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level (debug/info/warn/error)

### Audio Settings

- `MAX_AUDIO_DURATION` - Maximum audio length (default: 30s)
- `VOICE_TIMEOUT` - Voice connection timeout
- `CONVERSATION_TIMEOUT` - Context retention time

## 🐳 Deployment

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start the bot
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Save configuration
pm2 save
pm2 startup
```

### Docker (Alternative)

```bash
# Build image
docker build -t discord-voice-bot .

# Run container
docker run -d --env-file .env discord-voice-bot
```

## 📊 Cost Estimation

### OpenAI API Costs (Approximate)

- **Small server** (100 interactions/day): ~$3-5/month
- **Medium server** (1000 interactions/day): ~$10-20/month
- **Large server** (5000+ interactions/day): ~$50-100/month

### Infrastructure (DigitalOcean Droplet)

- **Basic** (2GB RAM): $12/month
- **Performance** (4GB RAM): $24/month

## 🔍 Troubleshooting

### Common Issues

1. **Bot won't join voice channel**

   - Check bot permissions (Connect, Speak)
   - Verify Discord token is correct

2. **Audio processing errors**

   - Ensure FFmpeg is installed and in PATH
   - Check OpenAI API key and credits

3. **High latency**
   - Check internet connection
   - Consider server location

See [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for detailed solutions.

## 📖 Documentation

- [Commands Guide](docs/COMMANDS.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Complete Setup Guide](<discord_voice_ai_bot_guide%20(1).md>)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

This bot uses OpenAI's APIs and may incur costs based on usage. Monitor your API usage and set appropriate limits.
