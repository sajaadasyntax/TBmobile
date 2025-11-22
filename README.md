# TrustBuild Contractor Mobile App

A React Native (Expo) WebView wrapper for the TrustBuild contractor dashboard, providing native mobile access to contractor features.

## Overview

This mobile app wraps the existing TrustBuild web application in a native WebView, providing contractors with:
- Native login experience
- Seamless access to the contractor dashboard
- Offline detection and error handling
- Support for file uploads and camera access
- Push notifications (future feature)
- Deep linking to specific dashboard pages

## Key Dashboard URLs

### Authentication
- **Web Base URL**: `https://trustbuild.uk` (production) or `http://localhost:3000` (development)
- **API Base URL**: `https://api.trustbuild.uk` (production) or `http://localhost:3000` (development)

### Main Routes
1. **Contractor Dashboard**: `/dashboard/contractor`
   - Entry point after login
   - Shows stats, pending jobs, commissions, and reviews

2. **Job Browsing**: `/jobs`
   - Browse and filter available jobs
   - Apply for jobs (requires credits or subscription)

3. **Current Jobs**: `/dashboard/contractor/current-jobs`
   - Active jobs in progress

4. **Job History**: `/dashboard/contractor/job-history`
   - Completed and past jobs

5. **Messages**: `/dashboard/contractor/messages`
   - Internal messaging system with customers

6. **Reviews**: `/dashboard/contractor/reviews`
   - Customer reviews and ratings

7. **Payments**: `/dashboard/contractor/payments`
   - Payment history and transactions

8. **Commissions**: `/dashboard/contractor/commissions`
   - Commission payments tracking

9. **Invoices**: `/dashboard/contractor/invoices`
   - Invoice management

10. **KYC Verification**: `/dashboard/kyc`
    - Identity verification and document upload

11. **Disputes**: `/dashboard/contractor/disputes`
    - Dispute management

12. **Profile**: `/dashboard/contractor/profile`
    - Edit contractor profile

## Authentication Contract

### Login API

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "contractor@example.com",
  "password": "password123"
}
```

**Response** (Success - 200):
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "clx1234567890",
      "email": "contractor@example.com",
      "name": "John Doe",
      "role": "CONTRACTOR",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "contractor": {
        "id": "clx0987654321",
        "userId": "clx1234567890",
        "businessName": "John's Construction",
        "status": "VERIFIED",
        "tier": "PREMIUM",
        "creditsBalance": 5,
        "weeklyCreditsLimit": 3,
        ...
      }
    }
  }
}
```

**Response** (Error - 401):
```json
{
  "status": "error",
  "message": "Invalid email or password"
}
```

### Token Storage & Usage

The JWT token returned from login must be:
1. **Stored securely** using `expo-secure-store` (never plain AsyncStorage for tokens)
2. **Sent with every API request** via the `Authorization` header:
   ```
   Authorization: Bearer <token>
   ```
3. **Injected into WebView** to maintain session when loading dashboard pages

### Token Injection for WebView

The web app expects the token in `localStorage`:
```javascript
// Injected JavaScript to set token in WebView
const injectedJS = `
  (function() {
    try {
      localStorage.setItem('token', '${token}');
      localStorage.setItem('user', '${JSON.stringify(user)}');
      window.ReactNativeWebView.postMessage('TOKEN_SET');
    } catch (e) {
      window.ReactNativeWebView.postMessage('TOKEN_ERROR');
    }
  })();
  true;
`;
```

### Refresh Token API

**Endpoint**: `POST /api/auth/refresh`

**Request Body**:
```json
{
  "refreshToken": "stored_refresh_token"
}
```

**Response**:
```json
{
  "data": {
    "token": "new_jwt_token"
  }
}
```

### Logout API

**Endpoint**: `POST /api/auth/logout`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

## User Roles

Only users with `role: "CONTRACTOR"` should access the contractor dashboard. The app should:
1. Check user role after login
2. Redirect to appropriate dashboard based on role
3. Show error if non-contractor tries to use the app

## Setup & Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your device (for testing)

### Installation
```bash
cd mobile
npm install
```

### Environment Variables

Create a `.env` file:
```env
API_URL=https://api.trustbuild.uk
WEB_URL=https://trustbuild.uk
```

For local development:
```env
API_URL=http://localhost:3000
WEB_URL=http://localhost:3000
```

### Running the App

**Development**:
```bash
npm start
# Then press 'a' for Android or 'i' for iOS
```

**Android**:
```bash
npm run android
```

**iOS** (macOS only):
```bash
npm run ios
```

### Building for Production

**Using Expo EAS Build**:
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure project
eas build:configure

# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

## Project Structure

```
mobile/
├── app/                    # Expo Router screens
│   ├── index.tsx          # Login screen
│   ├── dashboard.tsx      # WebView dashboard
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Reusable components
│   │   ├── LoadingScreen.tsx
│   │   └── ErrorScreen.tsx
│   ├── services/          # API and storage services
│   │   ├── api.ts         # Auth API calls
│   │   └── storage.ts     # Secure token storage
│   └── utils/             # Utility functions
│       └── navigation.ts  # Navigation helpers
├── app.json               # Expo configuration
├── package.json
└── README.md
```

## Features

### ✅ Implemented
- Native login screen
- WebView dashboard with token injection
- Secure token storage
- Offline detection
- Error handling
- Android back button handling
- Pull-to-refresh

### 🚧 Future Features
- Push notifications
- Deep linking
- Biometric authentication
- Camera/file upload support
- Offline caching

## Testing

### Manual Testing Checklist
- [ ] Login with valid credentials
- [ ] Login error handling (wrong password)
- [ ] Dashboard loads correctly
- [ ] Navigation within dashboard works
- [ ] Token persists after app restart
- [ ] Logout clears tokens
- [ ] Offline state shows error
- [ ] Android back button navigates within WebView
- [ ] Pull-to-refresh reloads dashboard

## Troubleshooting

### WebView not loading
- Check that `WEB_URL` in `.env` is correct
- Verify the web app is running/accessible
- Check network connectivity

### Login not working
- Verify `API_URL` in `.env`
- Check that backend API is accessible
- Review token injection in WebView

### Token not persisting
- Ensure `expo-secure-store` is properly configured
- Check platform compatibility (doesn't work in Expo Go for iOS simulator)

## Release Checklist

### Before Release
- [ ] Update `app.json` with correct bundle identifiers
- [ ] Set production API URLs
- [ ] Add app icons and splash screen
- [ ] Configure app permissions (camera, storage, etc.)
- [ ] Test on physical Android device
- [ ] Test on physical iOS device
- [ ] Set up Expo EAS Build
- [ ] Configure signing certificates
- [ ] Test production build

### Store Submission
- [ ] Prepare app store screenshots
- [ ] Write app description
- [ ] Add privacy policy URL
- [ ] Submit to Google Play Console
- [ ] Submit to Apple App Store Connect

## Support

For issues or questions:
- Backend API: See `backend/README.md`
- Web App: See `project/README.md`
- Mobile App: Create an issue in the project repository

## License

Proprietary - TrustBuild Ltd.

