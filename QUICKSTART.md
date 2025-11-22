# Quick Start Guide

Get the TrustBuild Contractor mobile app running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn installed
- Smartphone with Expo Go app (or Android emulator/iOS simulator)

## Step 1: Install

```bash
cd mobile
./install.sh
# Or manually:
npm install
cp .env.example .env
```

## Step 2: Configure

Edit `.env` file:

```env
# For local testing
API_URL=http://localhost:3000
WEB_URL=http://localhost:3000

# For production
# API_URL=https://api.trustbuild.uk
# WEB_URL=https://trustbuild.uk
```

**Note for Android Emulator:** Use `http://10.0.2.2:3000` instead of `localhost`.

## Step 3: Start

```bash
npm start
```

This opens Metro bundler with a QR code.

## Step 4: Run

### Option A: Physical Device (Easiest)
1. Install **Expo Go** from App Store or Google Play
2. Scan the QR code
3. App opens automatically

### Option B: Android Emulator
```bash
npm run android
```

### Option C: iOS Simulator (macOS only)
```bash
npm run ios
```

## Step 5: Test

1. Login with test contractor account:
   - Email: `contractor@test.com`
   - Password: `Test123!`

2. Dashboard should load with contractor features

## Troubleshooting

### "Cannot connect to Metro"
- Ensure phone and computer are on same WiFi
- Try restarting Metro: `npm start --reset-cache`

### "Network error" on login
- Check API_URL in `.env`
- Verify backend is running
- For Android emulator, use `10.0.2.2` not `localhost`

### WebView shows blank page
- Check WEB_URL in `.env`
- Verify web app is accessible
- Check token injection in dashboard

## What's Next?

- **Full Setup Guide**: See `SETUP.md`
- **Testing Guide**: See `TESTING.md`
- **API Documentation**: See `README.md`

## Common Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Clear cache
npm start -- --clear

# Production build
eas build --platform android --profile production
```

## Project Structure

```
mobile/
├── app/              # Screens (Login, Dashboard)
├── src/
│   ├── components/   # UI components
│   ├── services/     # API, Storage
│   ├── hooks/        # Custom hooks
│   └── utils/        # Helpers
└── .env             # Configuration
```

## Support

- Issues? Check `SETUP.md` troubleshooting section
- Questions? See `README.md`
- Bugs? Create an issue in the repo

---

**Ready to ship?** See `SETUP.md` for production build instructions.

