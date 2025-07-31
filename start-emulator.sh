#!/bin/bash

# Clean up any existing emulator processes and lock files
pkill -f emulator || true
adb kill-server || true
mkdir -p ~/.android/avd
# Remove any leftover lock files
rm -f ~/.android/avd/*.lock ~/.android/avd/*/*.lock || true
adb start-server

# Check if AVD exists, if not create it
if [ ! -f ~/.android/avd/test_avd.ini ]; then
    echo "AVD not found, creating new AVD..."
    echo 'no' | $ANDROID_HOME/cmdline-tools/latest/bin/avdmanager create avd \
        --name test_avd \
        --package 'system-images;android-33;google_apis_playstore;x86_64' \
        --device 'pixel' \
        --force
    echo 'AVD created successfully'
fi

# Start VNC server with smaller, more stable screen
echo "Starting VNC server..."
Xvfb :1 -screen 0 800x600x24 -ac +extension GLX +render -noreset &
sleep 2
export DISPLAY=:1
x11vnc -display :1 -nopw -listen 0.0.0.0 -xkb -forever -shared -ncache 10 -ncache_cr &
sleep 2


# Start emulator in the background with optimized settings
echo "Starting Android emulator..."
/opt/android-sdk/emulator/emulator \
    -avd test_avd \
    -no-audio \
    -no-boot-anim \
    -gpu guest \
    -cores 4 \
    -memory 12288 \
    -camera-back none \
    -camera-front none \
    -no-jni \
    -netdelay none \
    -netspeed full \
    -partition-size 4096 \
    &

# Wait for emulator to be ready
echo "Waiting for emulator to be ready..."
adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done; input keyevent 82'

# Unlock the device
echo "Unlocking the device..."
adb shell input keyevent 82

# Install Instagram APK if not already installed
echo "Checking for Instagram..."
if ! adb shell pm list packages | grep -q "com.instagram.android"; then
    echo "Instagram not found. Please install Instagram manually on the emulator first."
    echo "You can download Instagram APK and install it with: adb install instagram.apk"
else
    echo "Instagram is already installed."
fi

# Wait for emulator to fully stabilize
echo "Giving emulator time to stabilize..."
sleep 5

# Verify emulator is responding to ADB commands
echo "Testing emulator connection..."
adb shell input keyevent 82 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Emulator ADB connection test passed"
    # Optimize Android memory settings for Instagram
    echo "Optimizing memory settings for Instagram..."
    adb shell settings put global low_power_mode 0
    adb shell settings put global animator_duration_scale 0
    adb shell settings put global transition_animation_scale 0
    adb shell settings put global window_animation_scale 0
    # Force stop background apps to free memory
    adb shell am kill-all
    # Set aggressive memory management
    adb shell setprop dalvik.vm.heapsize 1024m
    adb shell setprop dalvik.vm.heapgrowthlimit 512m
    adb shell setprop dalvik.vm.heapmaxfree 32m
    adb shell setprop dalvik.vm.heapminfree 8m
    # Disable automatic updates and background sync
    adb shell settings put global auto_time 0
    adb shell settings put global development_settings_enabled 1
else
    echo "❌ Emulator ADB connection test failed"
fi

# Start Appium server in the background
echo "Starting Appium server..."
appium --log-timestamp --local-timezone &

# Wait for Appium to start
sleep 5

echo "✅ Emulator and Appium server are ready!"
echo "🔗 TigerVNC access: localhost:5900"
echo "📱 ADB connection: adb devices (should show emulator-5554)"
echo "🚀 Appium server: http://localhost:4723"
echo "📋 Run your scripts with: npm test"
echo ""
echo "The emulator is running and waiting for your commands..."

# Keep container running
tail -f /dev/null
