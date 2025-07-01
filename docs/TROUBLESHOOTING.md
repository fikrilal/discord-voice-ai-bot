# Troubleshooting Guide

## Common Issues

### 1. Bot Won't Start

#### Error: "Invalid Discord Token"

- Check your `.env` file has the correct `DISCORD_TOKEN`
- Ensure the token is from the Bot section of Discord Developer Portal
- Verify there are no extra spaces or characters

#### Error: "Missing OpenAI API Key"

- Add your OpenAI API key to `.env` file as `OPENAI_API_KEY`
- Make sure you have credits available in your OpenAI account

#### Error: "Cannot find module"

- Run `npm install` to install all dependencies
- Check if all required packages are in `package.json`

### 2. Voice Connection Issues

#### Bot joins but no audio

- Ensure FFmpeg is installed on your system
- Windows: Download from https://ffmpeg.org/
- Linux: `sudo apt install ffmpeg`
- macOS: `brew install ffmpeg`

#### Bot immediately disconnects

- Check voice channel permissions
- Ensure bot has "Connect" and "Speak" permissions
- Verify channel isn't full or restricted

#### Poor audio quality

- Check your internet connection
- Reduce other network usage during voice chat
- Try a different voice channel or server region

### 3. AI Processing Issues

#### Transcription not working

- Speak clearly and avoid background noise
- Ensure microphone is working properly
- Check OpenAI API status and quotas

#### AI responses are slow

- This is normal - processing takes 2-4 seconds
- Check your OpenAI account for rate limits
- Consider upgrading your OpenAI plan for faster processing

#### Bot responds to wrong audio

- The bot processes all voice in the channel
- Use push-to-talk in Discord to reduce false triggers
- Speak distinctly when addressing the bot

### 4. Deployment Issues

#### PM2 process keeps crashing

```bash
# Check PM2 logs
pm2 logs discord-voice-bot

# Restart the process
pm2 restart discord-voice-bot

# Check system resources
pm2 monit
```

#### High memory usage

- Monitor with `pm2 monit`
- Restart periodically: `pm2 restart discord-voice-bot`
- Consider upgrading server memory

#### SSL/HTTPS issues

```bash
# Renew certificates
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

## Debug Mode

Enable debug logging by setting `LOG_LEVEL=debug` in your `.env` file:

```env
LOG_LEVEL=debug
```

This will provide detailed logs for troubleshooting.

## Performance Monitoring

### Check Bot Status

```bash
# View logs
pm2 logs discord-voice-bot

# Monitor resources
pm2 monit

# Check process status
pm2 status
```

### Audio Processing Monitoring

- Check `logs/combined.log` for audio processing errors
- Monitor OpenAI API usage in their dashboard
- Track response times in application logs

## Getting Help

1. **Check logs first**: Look at `logs/error.log` and `logs/combined.log`
2. **Test basic functionality**: Use `/ping` command to verify bot is responsive
3. **Verify configuration**: Double-check all environment variables
4. **Test voice separately**: Ensure Discord voice works without the bot

## Common Error Messages

### "Failed to join voice channel"

- Bot missing voice permissions
- Voice channel is full
- Network connectivity issues

### "OpenAI API Error"

- Invalid API key
- Insufficient credits
- Rate limit exceeded
- Service temporarily unavailable

### "Audio processing failed"

- FFmpeg not installed or not in PATH
- Corrupted audio data
- Unsupported audio format

### "Connection timeout"

- Network issues
- Discord API problems
- Server overload

## Performance Optimization

### Reduce Latency

- Use a server close to your location
- Optimize network settings
- Reduce conversation history length

### Reduce Costs

- Monitor OpenAI usage
- Implement conversation timeouts
- Use shorter responses
- Cache frequent responses

### Improve Reliability

- Set up monitoring
- Implement automatic restarts
- Use health checks
- Regular log rotation
