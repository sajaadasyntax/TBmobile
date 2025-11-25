# TrustBuild Mobile App - Troubleshooting Guide

## White Screen Issue

If you're seeing a white screen when opening the mobile app, here are the most common causes and solutions:

### 1. Configuration Issue (Most Common)

**Problem**: The app is trying to connect to the production URL (`https://trustbuild.uk`) but you're developing locally.

**Solution**:
1. Find your local network IP address:
   - **Windows**: Open Command Prompt and run `ipconfig`. Look for "IPv4 Address"
   - **Mac/Linux**: Open Terminal and run `ifconfig`. Look for "inet" address (NOT 127.0.0.1)
   
2. Open `mobile/config.ts` and update:
   ```typescript
   export const config = {
     apiUrl: 'http://YOUR_IP_HERE:5000',  // e.g., http://192.168.1.100:5000
     webUrl: 'http://YOUR_IP_HERE:3000',  // e.g., http://192.168.1.100:3000
   };
   ```

3. Make sure your backend is running on port 5000 and web app on port 3000

4. Restart the Expo app: Stop and restart `npm start` in the mobile directory

**Important**: Do NOT use `localhost` or `127.0.0.1` - these won't work on a mobile device/emulator!

### 2. Backend/Web App Not Running

**Problem**: The mobile app can't connect because the backend or web app isn't running.

**Solution**:
1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the web app:
   ```bash
   cd project
   npm run dev
   ```

3. Verify they're accessible from your browser at:
   - Backend: `http://YOUR_IP:5000/health`
   - Web App: `http://YOUR_IP:3000`

### 3. Network/Firewall Issues

**Problem**: Your firewall is blocking connections from the mobile device.

**Solution**:
1. Temporarily disable your firewall to test
2. If that fixes it, add exceptions for ports 3000 and 5000
3. Make sure your mobile device is on the same WiFi network as your computer

### 4. WebView Not Loading

**Problem**: The WebView component is timing out or failing to load.

**Solution**:
1. Check the Metro console for error messages
2. Enable debug logging:
   - Shake device (iOS) or press Cmd+M/Ctrl+M (Android)
   - Select "Debug JS Remotely" or "Open Dev Tools"
3. Look for console errors in the browser dev tools

### 5. Authentication Issues

**Problem**: User can't log in or gets stuck on login screen.

**Solution**:
1. Make sure the API_URL in config.ts points to your backend
2. Clear app data:
   - iOS: Delete and reinstall the app
   - Android: Go to Settings > Apps > TrustBuild > Storage > Clear Data
3. Try logging in with a known contractor account

## Debugging Steps

1. **Check Metro Bundler Output**:
   - Look for red error messages in the terminal where you ran `npm start`

2. **Enable Debug Mode**:
   - Shake device or press Cmd+M (Android) / Cmd+D (iOS)
   - Select "Debug"
   - Open browser dev tools to see console logs

3. **Check Network Tab**:
   - In browser dev tools, check Network tab for failed requests
   - Look for 404, 500, or CORS errors

4. **Test API Connectivity**:
   - Open `http://YOUR_IP:5000/health` in your mobile browser
   - If this doesn't load, the backend isn't accessible

5. **Test Web App**:
   - Open `http://YOUR_IP:3000/dashboard/contractor` in your mobile browser
   - If this doesn't load, the web app isn't accessible or not responsive

## Common Error Messages

### "Failed to load dashboard: net::ERR_CONNECTION_REFUSED"
- Backend/web app is not running
- Wrong IP address in config
- Firewall blocking connection

### "Failed to load dashboard: 404"
- Wrong URL path in config
- Web app not built/deployed correctly

### "Session Expired" or 401 errors
- Token expired or invalid
- Clear app data and log in again

### "This app is only available for contractors"
- User account is not a contractor
- Need to register as contractor on web app first

## Production Deployment

For production, update `mobile/config.ts`:

```typescript
export const config = {
  apiUrl: 'https://api.trustbuild.uk',
  webUrl: 'https://trustbuild.uk',
};
```

Then rebuild the app for distribution.

## Need More Help?

1. Check logs in Metro bundler terminal
2. Enable remote debugging and check browser console
3. Verify network connectivity
4. Ensure all services are running
5. Check firewall settings
6. Confirm you're using your network IP, not localhost

