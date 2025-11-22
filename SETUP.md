# TrustBuild Contractor Mobile App - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Environment

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your API URLs:

**For Production:**
```env
API_URL=https://api.trustbuild.uk
WEB_URL=https://trustbuild.uk
APP_ENV=production
```

**For Local Development:**
```env
API_URL=http://localhost:3000
WEB_URL=http://localhost:3000
APP_ENV=development
```

**Note for Android Emulator:** If testing with local backend on Android emulator, use `http://10.0.2.2:3000` instead of `localhost`.

### 3. Start Development Server

```bash
npm start
```

This will start the Expo development server. You'll see a QR code in the terminal.

### 4. Run on Device/Emulator

**Option A: Physical Device (Recommended)**
1. Install Expo Go app from App Store (iOS) or Google Play (Android)
2. Scan the QR code from terminal

**Option B: Android Emulator**
```bash
npm run android
```
Requirements:
- Android Studio installed
- Android SDK configured
- An emulator created and running

**Option C: iOS Simulator (macOS only)**
```bash
npm run ios
```
Requirements:
- Xcode installed
- iOS Simulator available

## Project Structure

```
mobile/
├── app/                          # Expo Router screens
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Login screen
│   └── dashboard.tsx            # WebView dashboard
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── LoadingScreen.tsx   # Loading indicator
│   │   ├── ErrorScreen.tsx     # Error display
│   │   └── OfflineNotice.tsx   # Network status banner
│   ├── services/                # Business logic services
│   │   ├── api.ts              # API client (login, logout)
│   │   └── storage.ts          # Secure token storage
│   ├── hooks/                   # Custom React hooks
│   │   └── useNetworkStatus.ts # Network connectivity hook
│   └── utils/                   # Utility functions
│       ├── navigation.ts        # URL helpers
│       └── permissions.ts       # Camera/gallery permissions
├── assets/                       # Images, icons, fonts
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── babel.config.js               # Babel config
└── .env                          # Environment variables
```

## Testing

### Manual Testing Checklist

#### Authentication Flow
- [ ] App starts and shows login screen
- [ ] Login with valid contractor credentials succeeds
- [ ] Login with invalid credentials shows error
- [ ] Login with non-contractor account shows appropriate error
- [ ] Token persists after app restart
- [ ] Logout clears token and returns to login

#### Dashboard Navigation
- [ ] Dashboard loads after successful login
- [ ] Dashboard shows contractor-specific content
- [ ] Can navigate to different sections (Jobs, Payments, etc.)
- [ ] Android back button works within WebView
- [ ] Pressing back on home shows exit confirmation

#### Network Handling
- [ ] Offline banner appears when network is disconnected
- [ ] Error shown if dashboard fails to load
- [ ] Retry button works after network error
- [ ] Pull-to-refresh reloads dashboard (Android)

#### Session Management
- [ ] Session persists across app restarts
- [ ] Expired session redirects to login
- [ ] Multiple login attempts don't cause issues

#### Performance
- [ ] Dashboard loads within reasonable time
- [ ] WebView scrolling is smooth
- [ ] No memory leaks on navigation

### Testing with Different Accounts

Test with:
1. **Verified Contractor**: Full access to dashboard
2. **Pending Contractor**: Should see verification status
3. **Customer Account**: Should see error (contractors only)
4. **Invalid Credentials**: Should show login error

### Network Scenarios

Test under:
1. **WiFi**: Normal operation
2. **Mobile Data**: Normal operation
3. **Slow Connection**: Loading indicators work
4. **No Connection**: Offline notice appears
5. **Intermittent**: Handles reconnection gracefully

## Troubleshooting

### Common Issues

#### "Unable to connect to development server"
**Solution**: Ensure your phone and computer are on the same network.

#### "Network request failed" on Android emulator
**Solution**: Use `http://10.0.2.2:3000` instead of `localhost` in `.env`.

#### WebView shows blank page
**Solutions**:
- Check that `WEB_URL` in `.env` is correct and accessible
- Verify the web app is running
- Check browser console in WebView for errors
- Clear app data and restart

#### Token not persisting on iOS simulator
**Solution**: `expo-secure-store` doesn't work on iOS simulator. Test on a physical device or use Android emulator.

#### Login succeeds but dashboard doesn't load
**Solutions**:
- Check token injection in `dashboard.tsx`
- Verify `localStorage` is being set in WebView
- Check for CORS issues in backend

### Debug Mode

Enable debug mode in WebView to see console logs:

In `app/dashboard.tsx`, add:
```typescript
<WebView
  ...
  onMessage={(event) => {
    console.log('WebView message:', event.nativeEvent.data);
  }}
/>
```

Then in your web app, add:
```javascript
window.ReactNativeWebView.postMessage(JSON.stringify({
  type: 'debug',
  message: 'Your debug info'
}));
```

## Building for Production

### Prerequisites

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure the project:
```bash
eas build:configure
```

### Android Build

**Development Build:**
```bash
eas build --platform android --profile development
```

**Production Build:**
```bash
eas build --platform android --profile production
```

### iOS Build

**Note**: Requires Apple Developer account ($99/year).

**Development Build:**
```bash
eas build --platform ios --profile development
```

**Production Build:**
```bash
eas build --platform ios --profile production
```

### Build Profiles

Edit `eas.json` to configure build profiles:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

## App Store Submission

### Android (Google Play)

1. Build production APK/AAB
2. Create app listing in Google Play Console
3. Upload APK/AAB
4. Fill in required information
5. Submit for review

**Required Assets:**
- App icon (512x512 PNG)
- Feature graphic (1024x500 PNG)
- Screenshots (at least 2)
- Privacy policy URL

### iOS (Apple App Store)

1. Build production IPA
2. Create app listing in App Store Connect
3. Upload IPA via Transporter or Xcode
4. Fill in required information
5. Submit for review

**Required Assets:**
- App icon (1024x1024 PNG)
- Screenshots for all device sizes
- App preview video (optional)
- Privacy policy URL

## Environment-Specific Setup

### Development
- Use local backend (`http://localhost:3000`)
- Enable debug logging
- Test with Expo Go

### Staging
- Use staging backend
- Test with development build
- Internal distribution via TestFlight/Firebase

### Production
- Use production backend
- Disable debug logging
- Distributed via App Store/Play Store

## Performance Optimization

### Tips for Better Performance

1. **Optimize WebView Loading**
   - Enable caching
   - Use appropriate cache mode
   - Preload dashboard URL

2. **Reduce App Size**
   - Use vector images (SVG)
   - Optimize PNG/JPG images
   - Remove unused dependencies

3. **Improve Startup Time**
   - Minimize work in initial load
   - Lazy load non-critical components
   - Cache authentication state

4. **Network Optimization**
   - Implement request caching
   - Use compression
   - Minimize API calls

## Security Considerations

1. **Token Storage**: Always use `expo-secure-store` for tokens
2. **HTTPS Only**: Use HTTPS in production
3. **Certificate Pinning**: Consider for production
4. **Code Obfuscation**: Enable in production builds
5. **Secure Communication**: Validate WebView messages

## Next Steps

1. ✅ Complete setup and test locally
2. ✅ Test on physical devices
3. ✅ Configure production environment
4. ✅ Set up EAS Build
5. ✅ Prepare store assets
6. ✅ Submit for review

## Support

For issues or questions:
- Check the main README: `mobile/README.md`
- Review troubleshooting section above
- Check Expo documentation: https://docs.expo.dev
- Create an issue in the repository

## Additional Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native WebView](https://github.com/react-native-webview/react-native-webview)
- [Expo Router](https://expo.github.io/router/docs)
- [EAS Build](https://docs.expo.dev/build/introduction/)

