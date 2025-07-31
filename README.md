# Instagram AI Comment Bot

An automated Instagram commenting bot that uses OpenAI to generate human-like comments on posts. The bot runs in a Dockerized Android emulator environment for safe and isolated testing.

## Features

- **AI-Powered Comments**: Uses OpenAI GPT-3.5 to generate contextual, human-like comments based on post captions
- **Instagram Automation**: Automatically navigates Instagram, finds posts, and posts comments
- **Dockerized Environment**: Runs in an isolated Android emulator container
- **VNC Access**: Remote access to the Android emulator via VNC for monitoring
- **Configurable**: Easy to configure with different post selectors and comment strategies

## Prerequisites

- Docker Desktop (with WSL 2 backend on Windows) 
- At least 12GB RAM allocated to Docker for optimal performance
- OpenAI API key
- Instagram account credentials

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd emulatorBot
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your credentials:
   ```
   OPENAI_API_KEY=your-openai-api-key-here
   INSTAGRAM_USERNAME=your_instagram_username  
   INSTAGRAM_PASSWORD=your_instagram_password
   ```

3. **Build and start the container**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

4. **Start the emulator and services**
   ```bash
   docker exec -it android-dev ./start-emulator.sh
   ```

5. **Access the emulator via VNC** (optional)
   - Connect to `localhost:5900` using any VNC client
   - No password required

6. **Log into Instagram manually** (first time only)
   - Use VNC to access the emulator
   - Open Instagram app and log in with your credentials
   - Navigate to a post grid (hashtag, location, or profile)

7. **Run the AI comment bot**
   ```bash
   docker exec -it android-dev npm test
   ```

## How It Works

1. **Post Detection**: The bot scans Instagram post grids and selects posts to comment on
2. **Content Analysis**: Extracts the post caption and analyzes the content
3. **AI Comment Generation**: Sends the caption to OpenAI to generate a relevant, human-like comment
4. **Automated Posting**: Posts the AI-generated comment and navigates back to continue with the next post
5. **Smart Navigation**: Handles keyboard dismissal, modal closing, and grid navigation automatically

## Project Structure

```
├── test/specs/
│   ├── aiComment.e2e.ts    # Main AI commenting bot script
│   ├── test.e2e.ts         # Instagram login automation
│   └── ...                 # Other test files
├── wdio.conf.ts            # WebdriverIO configuration
├── start-emulator.sh       # Emulator startup script
├── Dockerfile              # Docker container setup
├── docker-compose.yml      # Docker services configuration
└── .env.example           # Environment variables template
```

## Configuration

### Emulator Settings
- **Memory**: 12GB RAM allocation for smooth performance
- **CPU Cores**: 4 cores for optimal speed
- **Screen**: 800x600 display via VNC
- **Platform**: Android 13 with Google Play Store

### Bot Settings
- **Posts per session**: Configurable (default: 5 posts)
- **AI Model**: GPT-3.5-turbo for cost-effective comment generation
- **Timeout**: 5-minute test timeout for complete execution
- **Navigation**: Smart back-button handling with verification

### Comment Generation
The AI generates comments based on:
- Post caption content
- Positive and engaging tone
- 1-2 sentence length
- Relevant emojis (1-2 per comment)
- Natural, non-bot-like language

## Usage Tips

- **Performance**: Ensure Docker has at least 12GB RAM allocated
- **Navigation**: Let the bot handle all navigation automatically
- **Monitoring**: Use VNC to watch the bot in action
- **Grid Selection**: Start from Instagram post grids (hashtags, locations, profiles)
- **Rate Limiting**: The bot includes natural delays to avoid detection

## Troubleshooting

### Common Issues
- **Timeout errors**: Increase memory allocation or reduce number of posts
- **Element not found**: Instagram UI may have changed; update selectors
- **Navigation stuck**: Check if comments modal is properly dismissed
- **VNC connection**: Ensure port 5900 is available

### Performance Optimization
- Allocate more RAM to Docker if the emulator is slow
- Close other resource-intensive applications
- Use SSD storage for better Docker performance

## Security & Privacy

- All credentials are stored in `.env` (gitignored)
- No hardcoded passwords or API keys in source code
- Isolated Docker environment prevents system interference
- Uses environment variables for all sensitive data

## Disclaimer

This bot is for educational and testing purposes only. Users are responsible for complying with Instagram's Terms of Service and applicable laws. Use responsibly and respect platform guidelines.

## License

This project is licensed under the MIT License.
