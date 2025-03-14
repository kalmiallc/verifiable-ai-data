#!/bin/sh
set -e

echo "=== Starting services ==="

# Initialize Nginx directories
echo "Initializing Nginx directories..."
mkdir -p /run/nginx
mkdir -p /var/lib/nginx
mkdir -p /var/log/nginx
mkdir -p /usr/share/nginx/html
touch /run/nginx/nginx.pid
chown -R root:root /run/nginx
chown -R root:root /var/lib/nginx
chown -R root:root /var/log/nginx
chown -R root:root /usr/share/nginx/html
chmod 755 /run/nginx
chmod 755 /var/lib/nginx
chmod 755 /var/log/nginx
chmod 755 /usr/share/nginx/html
chmod 644 /run/nginx/nginx.pid

# Kill any existing Node.js processes on port 3000
echo "Cleaning up any existing processes..."
pkill -f "node.*dist/index.js" || true
sleep 2

# Ensure port 3000 is free
while netstat -tuln | grep -q ":3000 "; do
    echo "Port 3000 is still in use, waiting..."
    sleep 1
done


echo "Starting application..."
cd /app
echo "Current directory: $(pwd)"
echo "Directory contents: $(ls -la)"
echo "Starting Node.js application..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "PNPM version: $(pnpm --version)"
echo "Environment variables:"
env | sort

echo "Starting application with Node.js..."
# Use tee to show logs in real-time while also saving to file
HOST=0.0.0.0 node dist/index.js 2>&1 | tee /app/app.log &
APP_PID=$!

echo "Application started with PID: $APP_PID"
echo "Waiting for application to start..."
sleep 5

echo "Checking if application is running..."
if kill -0 $APP_PID 2>/dev/null; then
    echo "Application is running"
    echo "Application logs:"
    tail -n 20 /app/app.log
else
    echo "Application failed to start"
    echo "Last 20 lines of application logs:"
    tail -n 20 /app/app.log
    exit 1
fi

# Keep the script running and monitor the process
while true; do
    if ! kill -0 $APP_PID 2>/dev/null; then
        echo "Application process died"
        echo "Last 20 lines of application logs:"
        tail -n 20 /app/app.log
        exit 1
    fi
    sleep 5
done 