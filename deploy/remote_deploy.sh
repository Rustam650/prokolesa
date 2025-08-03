#!/bin/bash

# Remote deployment script for ProKolesa
# This script connects to the server and runs the deployment

SERVER_IP="217.199.252.133"
SERVER_USER="root"
SERVER_PASSWORD="yT+E3qPU4KNdg-"

echo "🚀 Connecting to server and deploying ProKolesa..."

# Function to execute command on remote server
execute_on_server() {
    sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "$1"
}

# Install sshpass if not available
if ! command -v sshpass &> /dev/null; then
    echo "📦 Installing sshpass..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install sshpass
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get install -y sshpass
    else
        echo "❌ Please install sshpass manually"
        exit 1
    fi
fi

# Test connection
echo "🔗 Testing connection to server..."
if execute_on_server "echo 'Connection successful'"; then
    echo "✅ Connection successful!"
else
    echo "❌ Failed to connect to server"
    exit 1
fi

# Run deployment on server
echo "🚀 Starting deployment on server..."
execute_on_server "curl -sSL https://raw.githubusercontent.com/Rustam650/prokolesa/main/deploy/deploy.sh | bash"

echo "✅ Deployment completed!"
echo "🌐 Your site should now be available at https://prokolesa.pro"
echo "🔧 Django admin: https://prokolesa.pro/admin/"
echo "📧 Admin credentials: prokolesa@mail.ru / pro123kolesa45678" 