#!/bin/bash

# CNA Voice Notes AI - Quick Setup Script
# This script helps you set up the application with your OpenAI API key

set -e

echo "[ROCKET] CNA Voice Notes AI - Setup Script"
echo "===================================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "[CHECK] .env.local already exists"
    read -p "Do you want to reconfigure it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping configuration..."
        exit 0
    fi
fi

# Copy .env.example to .env.local
echo "[CLIPBOARD] Creating .env.local from .env.example..."
cp .env.example .env.local
echo "[CHECK] Created .env.local"
echo ""

# Prompt for API key
echo "[KEY] OpenAI API Key Setup"
echo "======================"
echo "Get your API key from: https://platform.openai.com/api-keys"
echo ""
read -p "Enter your OpenAI API key (sk-...): " api_key

if [ -z "$api_key" ]; then
    echo "[X] API key cannot be empty"
    exit 1
fi

# Update .env.local with the API key
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/sk-your-api-key-here/$api_key/" .env.local
else
    # Linux
    sed -i "s/sk-your-api-key-here/$api_key/" .env.local
fi

echo "[CHECK] API key configured in .env.local"
echo ""

# Test the API key
echo "[TEST] Testing API key..."
if command -v node &> /dev/null; then
    node test-openai-api.js "$api_key"
else
    echo "[WARNING] Node.js not found. Skipping API test."
    echo "You can test manually with: node test-openai-api.js"
fi

echo ""
echo "[STAR] Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the dev server: npm run dev"
echo "2. Open http://localhost:5174 in your browser"
echo "3. Start chatting!"
echo ""

