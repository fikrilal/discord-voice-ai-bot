# Discord Voice AI Bot - Complete Project Guide

## Project Description

A Discord bot that connects to voice channels and provides AI-powered voice interactions. Users can speak directly to the bot in voice channels, and the bot responds with natural speech using advanced AI models. The bot processes voice input, generates intelligent responses, and speaks back to users in real-time.

### Key Features
- **Voice-to-Voice Communication**: Speak naturally to the bot and receive spoken responses
- **Real-time Processing**: Low-latency voice processing for smooth conversations
- **Multi-user Support**: Handle multiple users in voice channels simultaneously
- **Context Awareness**: Maintain conversation context during voice sessions
- **Flexible Deployment**: Easy deployment on DigitalOcean or other cloud providers

## Technical Flow

### Overview Architecture
```
Discord Voice Channel → Bot → Speech Processing → AI → Voice Response → Discord
```

### Detailed Processing Flow

#### 1. Audio Capture & Voice Detection
```
Raw Discord Audio Stream → Audio Buffer → Voice Activity Detection → Audio Chunks
```
- Bot connects to Discord voice channel
- Captures PCM audio data from voice channel
- Implements voice activity detection to identify when users speak
- Buffers audio into processable chunks (1-3 seconds)

#### 2. Speech-to-Text Processing
```
Audio Chunk → Format Conversion → OpenAI gpt-4o-mini-transcribe → Text Transcript
```
- Convert Discord's Opus audio to format suitable for STT
- Send audio chunks to OpenAI gpt-4o-mini-transcribe API
- Receive accurate text transcription with better context awareness
- Handle audio processing errors and retries

#### 3. AI Response Generation
```
Text Input → Context + System Prompt → OpenAI GPT API → AI Response
```
- Combine user input with conversation context
- Send to GPT-4o-mini with appropriate system prompts
- Generate contextually relevant responses
- Maintain conversation history and context

#### 4. Text-to-Speech Synthesis
```
AI Response Text → OpenAI gpt-4o-mini-tts → Audio File → Format Conversion
```
- Convert AI response text to speech using OpenAI gpt-4o-mini-tts
- Receive high-quality audio with better context integration
- Convert to PCM format for Discord playback

#### 5. Audio Playback
```
Processed Audio → Audio Stream → Discord Voice Channel
```
- Stream converted audio back to Discord voice channel
- Handle audio queue for multiple simultaneous responses
- Manage audio playback state and cleanup

## Tech Stack

### Backend Framework
- **Runtime**: Node.js 20.x
- **Framework**: Express.js (for health checks and webhooks)
- **Process Management**: PM2 for production deployment

### Discord Integration
- **discord.js**: v14.x - Main Discord API wrapper
- **@discordjs/voice**: Voice channel connectivity and audio streaming
- **@discordjs/opus**: Opus audio codec for Discord audio processing
- **prism-media**: Advanced audio processing utilities

### AI Services (OpenAI Single Provider)
- **OpenAI SDK**: Official OpenAI JavaScript SDK
- **gpt-4o-mini-transcribe**: Speech-to-text conversion ($0.003/minute)
- **GPT-4o-mini**: Text generation ($0.15 input/$0.60 output per 1M tokens)
- **gpt-4o-mini-tts**: Text-to-speech synthesis ($0.015/minute)

### Audio Processing
- **FFmpeg**: System-level audio processing (required dependency)
- **fluent-ffmpeg**: Node.js wrapper for FFmpeg operations
- **Audio Format Support**: Opus, PCM, MP3, WAV

### Database & Caching
- **Redis**: In-memory storage for conversation context and caching
- **Node Redis**: Redis client for Node.js
- **Optional**: SQLite for persistent conversation logs

### Development & Configuration
- **dotenv**: Environment variable management
- **eslint**: Code linting and formatting
- **nodemon**: Development auto-reload

## Deployment Guide

### DigitalOcean Droplet Specifications

#### Recommended Configuration
- **Plan**: Basic Droplet
- **Size**: 2 GB RAM / 1 vCPU ($12/month) - suitable for small to medium servers
- **Upgrade**: 4 GB RAM / 2 vCPU ($24/month) - for high-traffic servers
- **OS**: Ubuntu 22.04 LTS
- **Storage**: 50 GB SSD (included)

### Server Setup Process

#### 1. Initial Server Configuration
```bash
# Connect to droplet
ssh root@your_droplet_ip

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git build-essential
```

#### 2. Node.js Installation
```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### 3. Audio Dependencies
```bash
# Install FFmpeg (critical for audio processing)
sudo apt install -y ffmpeg

# Install additional audio libraries
sudo apt install -y libopus-dev libsodium-dev
```

#### 4. Redis Installation (Optional)
```bash
# Install Redis for conversation caching
sudo apt install -y redis-server

# Configure Redis
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Test Redis
redis-cli ping
```

#### 5. Application Deployment
```bash
# Create application directory
mkdir -p /opt/discord-bot
cd /opt/discord-bot

# Clone repository or upload files
git clone https://github.com/yourusername/discord-voice-bot.git .

# Install dependencies
npm install --production

# Install PM2 globally
sudo npm install -g pm2
```

#### 6. Environment Configuration
```bash
# Create environment file
nano .env
```

#### 7. Process Management Setup
```bash
# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup ubuntu
# Follow the generated command

# Monitor application
pm2 monit
```

### Security Configuration

#### Firewall Setup
```bash
# Configure UFW firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status
```

#### SSL Certificate (Optional)
```bash
# Install Certbot for SSL
sudo apt install -y certbot
sudo certbot certonly --standalone -d yourdomain.com
```

## Project Structure

```
discord-voice-ai-bot/
├── README.md
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
├── ecosystem.config.js          # PM2 configuration
├── app.js                       # Main application entry point
├── 
├── src/
│   ├── bot/
│   │   ├── index.js            # Discord bot initialization
│   │   ├── client.js           # Discord client setup
│   │   └── deploy-commands.js  # Command deployment script
│   │
│   ├── commands/
│   │   ├── voice/
│   │   │   ├── join.js         # Join voice channel command
│   │   │   ├── leave.js        # Leave voice channel command
│   │   │   └── toggle.js       # Toggle voice AI on/off
│   │   └── utility/
│   │       ├── ping.js         # Bot health check
│   │       └── help.js         # Help command
│   │
│   ├── events/
│   │   ├── ready.js            # Bot ready event
│   │   ├── interactionCreate.js # Slash command handling
│   │   └── voiceStateUpdate.js # Voice channel events
│   │
│   ├── services/
│   │   ├── audioProcessor.js   # Audio processing service
│   │   ├── openaiService.js    # OpenAI API integration
│   │   ├── voiceManager.js     # Voice connection management
│   │   └── conversationManager.js # Context management
│   │
│   ├── utils/
│   │   ├── audioUtils.js       # Audio utility functions
│   │   ├── logger.js           # Logging utility
│   │   ├── errorHandler.js     # Error handling
│   │   └── constants.js        # Application constants
│   │
│   └── config/
│       ├── discord.js          # Discord configuration
│       ├── openai.js           # OpenAI configuration
│       └── redis.js            # Redis configuration
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   └── integration/
│       └── bot.test.js
│
├── docs/
│   ├── API.md
│   ├── COMMANDS.md
│   └── TROUBLESHOOTING.md
│
├── scripts/
│   ├── setup.sh               # Initial setup script
│   ├── deploy.sh              # Deployment script
│   └── backup.sh              # Backup script
│
└── logs/                      # Application logs (created at runtime)
    ├── error.log
    └── combined.log
```

### Key Configuration Files

#### package.json
```json
{
  "name": "discord-voice-ai-bot",
  "version": "1.0.0",
  "description": "Discord bot with AI voice capabilities",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "deploy": "node src/bot/deploy-commands.js",
    "test": "jest",
    "lint": "eslint src/"
  },
  "dependencies": {
    "discord.js": "^14.14.1",
    "@discordjs/voice": "^0.16.1",
    "@discordjs/opus": "^0.9.0",
    "prism-media": "^1.3.5",
    "openai": "^4.20.1",
    "express": "^4.18.2",
    "dotenv": "^16.3.1",
    "fluent-ffmpeg": "^2.1.2",
    "redis": "^4.6.10",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "eslint": "^8.55.0",
    "jest": "^29.7.0"
  }
}
```

#### ecosystem.config.js (PM2)
```javascript
module.exports = {
  apps: [{
    name: 'discord-voice-bot',
    script: 'app.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

#### .env.example
```env
# Discord Configuration
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_bot_client_id_here
DISCORD_GUILD_ID=your_test_guild_id_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Application Configuration
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# Voice Configuration
MAX_AUDIO_DURATION=30000
VOICE_TIMEOUT=300000
CONVERSATION_TIMEOUT=900000
```

## Cost Estimation

### Monthly Operating Costs

#### Infrastructure (DigitalOcean)
- **Basic Droplet** (2GB RAM): $12/month
- **Performance Droplet** (4GB RAM): $24/month
- **Load Balancer** (optional): $12/month
- **Backup** (optional): $1.20/month (10% of droplet cost)

#### AI Services (OpenAI)
- **Small Server** (100 voice interactions/day): ~$3-5/month
- **Medium Server** (1000 voice interactions/day): ~$10-20/month
- **Large Server** (5000+ voice interactions/day): ~$50-100/month

#### Total Estimated Monthly Cost
- **Small Setup**: $17-20/month
- **Medium Setup**: $25-45/month
- **Large Setup**: $65-125/month

### Performance Metrics
- **Latency**: 2-4 seconds end-to-end processing
- **Concurrent Users**: 10-20 simultaneous voice interactions
- **Uptime**: 99.5%+ with proper monitoring
- **Audio Quality**: High-quality voice synthesis and recognition

## Next Steps

1. **Set up development environment** using the project structure
2. **Configure Discord bot** and obtain necessary tokens
3. **Implement core voice processing** using the technical flow
4. **Deploy to DigitalOcean** following the deployment guide
5. **Monitor and optimize** performance based on usage patterns
6. **Scale infrastructure** as user base grows

## Support and Maintenance

- **Monitoring**: Use PM2 monitoring and Discord bot status
- **Logging**: Winston for structured logging
- **Updates**: Regular dependency updates and security patches
- **Backup**: Automated backups of configuration and logs
- **Scaling**: Horizontal scaling with load balancers for high traffic