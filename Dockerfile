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
    x11vnc \
    qemu-kvm \
    libvirt-daemon-system \
    libvirt-clients \
    bridge-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js and noVNC for web interface
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs python3-websockify git && \
    npm install -g appium && \
    appium driver install uiautomator2 && \
    git clone https://github.com/novnc/noVNC.git /opt/noVNC && \
    ln -s /opt/noVNC/vnc.html /opt/noVNC/index.html

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
    "system-images;android-33;google_apis_playstore;x86_64"

# List available devices (AVD will be created at runtime in persistent volume)
RUN $ANDROID_HOME/cmdline-tools/latest/bin/avdmanager list device

# Create volume mount points for persistent data
RUN mkdir -p /root/.android/avd
VOLUME ["/root/.android"]

# Copy project files
WORKDIR /app
COPY . .

# Install project dependencies
RUN npm install

# Expose ports
EXPOSE 5554 5555 4723 5900

# Start script
CMD ["bash", "start-emulator.sh"]
