# Use Ubuntu 22.04 as base
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_ROOT=$ANDROID_HOME
ENV PATH="${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools"

# Install basic dependencies
RUN apt-get update && \
    apt-get install -y \
    wget \
    unzip \
    openjdk-11-jdk \
    git \
    curl \
    libpulse0 \
    libgl1-mesa-dri \
    libgl1-mesa-glx \
    libxcomposite1 \
    libxcursor1 \
    libxi6 \
    libxtst6 \
    libnss3 \
    libcups2 \
    libxss1 \
    libxrandr2 \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libpangocairo-1.0-0 \
    libgtk-3-0 \
    libgbm1 \
    libxshmfence1 \
    xvfb \
    qemu-kvm \
    libvirt-daemon-system \
    libvirt-clients \
    bridge-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g appium

# Install Android Command Line Tools
RUN mkdir -p $ANDROID_HOME/cmdline-tools/latest && \
    cd $ANDROID_HOME/cmdline-tools/latest && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip -O cmdline-tools.zip && \
    unzip cmdline-tools.zip && \
    rm cmdline-tools.zip && \
    mv cmdline-tools/* . && \
    rmdir cmdline-tools

# Accept licenses and install Android SDK components
RUN yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses && \
    $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager \
    "platform-tools" \
    "platforms;android-33" \
    "build-tools;33.0.0" \
    "emulator" \
    "system-images;android-33;google_apis;x86_64"

# List available devices and create AVD with a valid device ID
RUN $ANDROID_HOME/cmdline-tools/latest/bin/avdmanager list device && \
    echo 'Creating Android Virtual Device...' && \
    echo 'no' | $ANDROID_HOME/cmdline-tools/latest/bin/avdmanager create avd \
    --name test_avd \
    --package 'system-images;android-33;google_apis;x86_64' \
    --device 'pixel' \
    --force && \
    echo 'AVD created successfully'

# Copy project files
WORKDIR /app
COPY . .

# Install project dependencies
RUN npm install

# Expose ports
EXPOSE 5554 5555 4723 5900

# Start script
CMD ["bash", "start-emulator.sh"]
