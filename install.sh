#!/bin/bash

# TrustBuild Contractor Mobile App - Installation Script
# This script automates the initial setup of the mobile app

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== TrustBuild Contractor Mobile App Setup ===${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} npm is installed: $(npm --version)"

# Step 1: Install dependencies
echo -e "\n${YELLOW}[1/4]${NC} Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed successfully"
else
    echo -e "${RED}✗${NC} Failed to install dependencies"
    exit 1
fi

# Step 2: Setup environment file
echo -e "\n${YELLOW}[2/4]${NC} Setting up environment configuration..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓${NC} Created .env file"
    echo -e "${YELLOW}⚠${NC}  Please edit .env and configure your API URLs"
else
    echo -e "${YELLOW}⚠${NC}  .env file already exists, skipping"
fi

# Step 3: Check for Expo CLI
echo -e "\n${YELLOW}[3/4]${NC} Checking Expo CLI..."

if ! command -v expo &> /dev/null; then
    echo -e "${YELLOW}⚠${NC}  Expo CLI not found globally"
    echo -e "   You can install it with: npm install -g expo-cli"
    echo -e "   Or use: npx expo (included in dependencies)"
else
    echo -e "${GREEN}✓${NC} Expo CLI is installed: $(expo --version)"
fi

# Step 4: Display next steps
echo -e "\n${YELLOW}[4/4]${NC} Setup complete!\n"

echo -e "${GREEN}=== Next Steps ===${NC}"
echo -e "1. Edit your .env file with correct API URLs:"
echo -e "   ${YELLOW}nano .env${NC}"
echo -e ""
echo -e "2. Start the development server:"
echo -e "   ${YELLOW}npm start${NC}"
echo -e ""
echo -e "3. Run on your device:"
echo -e "   - Install Expo Go app on your phone"
echo -e "   - Scan the QR code from the terminal"
echo -e ""
echo -e "   Or run on emulator:"
echo -e "   ${YELLOW}npm run android${NC}  # For Android"
echo -e "   ${YELLOW}npm run ios${NC}      # For iOS (macOS only)"
echo -e ""
echo -e "4. For detailed setup instructions, see:"
echo -e "   ${YELLOW}SETUP.md${NC}"
echo -e ""
echo -e "${GREEN}Happy coding! 🚀${NC}\n"

