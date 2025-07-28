#!/bin/bash

# Start ADB server
adb start-server

# Start emulator in the background
echo "Starting Android emulator..."
/opt/android-sdk/emulator/emulator \
    -avd test_avd \
    -no-audio \
    -no-boot-anim \
    -no-window \
    -gpu swiftshader \
    -no-snapshot \
    -no-snapshot-save \
    -wipe-data \
    -qemu -m 2048 \
    -accel on \
    -netdelay none &

# Wait for emulator to be ready
echo "Waiting for emulator to be ready..."
adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done; input keyevent 82'

# Unlock the device
echo "Unlocking the device..."
adb shell input keyevent 82

# Start Appium server in the background
echo "Starting Appium server..."
appium --log-timestamp --local-timezone &

# Wait for Appium to start
sleep 5

# Run tests
echo "Running tests..."
npm test

# Keep container running
tail -f /dev/null
