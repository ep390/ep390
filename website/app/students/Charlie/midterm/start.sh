#!/bin/bash

# Jazz Chord Progression Generator - Startup Script
echo "🎵 Starting Jazz Chord Progression Generator..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📦 Installing Python dependencies..."
    pip install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies. Please check requirements.txt"
        exit 1
    fi
else
    echo "⚠️  No requirements.txt found. Make sure dependencies are installed."
fi

# Check if model file exists
if [ ! -f "checkpoints/mtsf_model_full.pt" ]; then
    echo "❌ Model file not found at checkpoints/mtsf_model_full.pt"
    echo "   Please make sure your trained model is in the correct location."
    exit 1
fi

echo "✅ Model file found!"

# Start the Flask server
echo "🚀 Starting Flask API server..."
echo "   The web interface will be available at: http://localhost:3000"
echo "   The API will be available at: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python api.py
