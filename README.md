# Android Emulator Test Automation

This project provides a Dockerized environment for running Android UI tests using Appium and WebdriverIO.

## Prerequisites

- Docker Desktop (with WSL 2 backend on Windows)
- X Server (VcXsrv or similar) for GUI display
- At least 8GB RAM allocated to Docker

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd emulatorInstaBot
   ```

2. **Build the Docker image**
   ```bash
   docker-compose build
   ```

3. **Start the container**
   ```bash
   docker-compose up -d
   ```

4. **Run the tests**
   ```bash
   docker exec -it android-dev ./start-emulator.sh
   ```

## Project Structure

- `test/specs/` - Test files
- `wdio.conf.ts` - WebdriverIO configuration
- `Dockerfile` - Docker configuration
- `docker-compose.yml` - Docker Compose configuration

## Environment Variables

Create a `.env` file with the following variables:
```
# Add any required environment variables here
```

## License

This project is licensed under the MIT License.
