# Testing Guide - TrustBuild Contractor Mobile App

## Testing Approach

This document outlines the testing strategy for the mobile WebView wrapper app.

## Manual Testing

### 1. Authentication Tests

#### Test Case 1.1: Successful Login
**Steps:**
1. Open the app (fresh install)
2. Enter valid contractor email: `contractor@test.com`
3. Enter valid password
4. Tap "Login"

**Expected Result:**
- Loading indicator appears
- Dashboard loads successfully
- Contractor-specific content is visible

#### Test Case 1.2: Invalid Credentials
**Steps:**
1. Open the app
2. Enter email: `test@test.com`
3. Enter password: `wrongpassword`
4. Tap "Login"

**Expected Result:**
- Error alert appears
- Error message: "Invalid email or password"
- User remains on login screen

#### Test Case 1.3: Non-Contractor Login
**Steps:**
1. Open the app
2. Enter customer account credentials
3. Tap "Login"

**Expected Result:**
- Error alert appears
- Error message: "This app is only available for contractors"
- User remains on login screen
- Tokens are cleared

#### Test Case 1.4: Empty Fields
**Steps:**
1. Open the app
2. Leave email and password empty
3. Tap "Login"

**Expected Result:**
- Alert appears: "Please enter both email and password"
- No API call is made

### 2. Session Persistence Tests

#### Test Case 2.1: Token Persistence
**Steps:**
1. Login successfully
2. Close the app completely (swipe away)
3. Reopen the app

**Expected Result:**
- App opens directly to dashboard
- No login screen shown
- Session is maintained

#### Test Case 2.2: Logout
**Steps:**
1. Login successfully
2. Navigate to dashboard
3. Trigger logout (via WebView or back button alert)
4. Confirm logout

**Expected Result:**
- User returns to login screen
- Tokens are cleared
- Reopening app shows login screen

### 3. Navigation Tests

#### Test Case 3.1: Dashboard Navigation
**Steps:**
1. Login successfully
2. Click "Find Jobs" in dashboard
3. Navigate to a job detail page
4. Press Android back button / iOS swipe

**Expected Result:**
- Navigation within WebView works
- Back button goes to previous page in WebView
- History is maintained

#### Test Case 3.2: Exit Confirmation
**Steps:**
1. Login successfully
2. On dashboard home, press Android back button

**Expected Result:**
- Alert appears: "Exit App?"
- Options: "Cancel" and "Exit"
- Cancel keeps user in app
- Exit closes the app

#### Test Case 3.3: Deep Navigation
**Steps:**
1. Login successfully
2. Navigate through multiple pages: Dashboard → Jobs → Job Detail → Apply
3. Press back button multiple times

**Expected Result:**
- Each back press goes to previous page
- After all history is exhausted, shows exit confirmation

### 4. Network Handling Tests

#### Test Case 4.1: Offline Login
**Steps:**
1. Turn off WiFi and mobile data
2. Open app
3. Try to login

**Expected Result:**
- Red banner appears: "No Internet Connection"
- Login attempt shows network error
- Error message is user-friendly

#### Test Case 4.2: Offline Dashboard
**Steps:**
1. Login successfully
2. Turn off network connection
3. Try to navigate in dashboard

**Expected Result:**
- Offline banner appears at top
- WebView shows appropriate error
- Retry button is available

#### Test Case 4.3: Connection Recovery
**Steps:**
1. Login with network on
2. Turn off network
3. Wait for offline banner
4. Turn network back on

**Expected Result:**
- Offline banner disappears
- Dashboard continues to work
- Navigation is restored

#### Test Case 4.4: Slow Connection
**Steps:**
1. Enable network throttling (developer tools)
2. Login with slow 3G speed
3. Navigate dashboard

**Expected Result:**
- Loading indicators appear
- App doesn't freeze
- Content loads eventually

### 5. WebView Integration Tests

#### Test Case 5.1: Token Injection
**Steps:**
1. Login successfully
2. Open browser dev tools (if possible)
3. Check localStorage in WebView

**Expected Result:**
- `token` is set in localStorage
- `user` object is set in localStorage
- Token matches the one from API response

#### Test Case 5.2: Session Expiry
**Steps:**
1. Login successfully
2. Manually expire token on backend
3. Try to navigate in dashboard

**Expected Result:**
- 401 error is detected
- Alert appears: "Session Expired"
- User is redirected to login
- Tokens are cleared

#### Test Case 5.3: External Links
**Steps:**
1. Login successfully
2. Click an external link in dashboard (e.g., social media)

**Expected Result:**
- Link behavior is appropriate
- Either opens in WebView or external browser
- App doesn't crash

### 6. Pull-to-Refresh Tests (Android)

#### Test Case 6.1: Dashboard Refresh
**Steps:**
1. Login successfully
2. Pull down on dashboard
3. Release

**Expected Result:**
- Refresh indicator appears
- Dashboard reloads
- Fresh data is loaded

### 7. Permission Tests

#### Test Case 7.1: Camera Access (Future)
**Steps:**
1. Navigate to KYC page
2. Try to upload a photo
3. Select "Take Photo"

**Expected Result:**
- Permission prompt appears
- If granted, camera opens
- If denied, appropriate message shown

#### Test Case 7.2: Photo Library Access (Future)
**Steps:**
1. Navigate to KYC page
2. Try to upload a photo
3. Select "Choose from Library"

**Expected Result:**
- Permission prompt appears
- If granted, photo library opens
- If denied, appropriate message shown

## Device-Specific Testing

### Test on Multiple Devices

Test the app on various devices and OS versions:

**Android Devices:**
- [ ] Android 11 (API 30)
- [ ] Android 12 (API 31)
- [ ] Android 13 (API 33)
- [ ] Android 14 (API 34)

**iOS Devices:**
- [ ] iOS 14
- [ ] iOS 15
- [ ] iOS 16
- [ ] iOS 17

**Screen Sizes:**
- [ ] Small phone (< 5")
- [ ] Medium phone (5-6")
- [ ] Large phone (> 6")
- [ ] Tablet

## Performance Testing

### Load Time Tests

Measure and optimize:
- [ ] App launch time (cold start)
- [ ] App launch time (warm start)
- [ ] Login API response time
- [ ] Dashboard initial load time
- [ ] Navigation between pages

**Acceptable Thresholds:**
- Cold start: < 3 seconds
- Warm start: < 1 second
- API calls: < 2 seconds
- Dashboard load: < 5 seconds

### Memory Tests

Check for memory leaks:
- [ ] Navigate between screens 50 times
- [ ] Monitor memory usage
- [ ] Ensure memory is released

### Battery Tests

Test battery impact:
- [ ] Leave app open for 1 hour
- [ ] Check battery drain
- [ ] Should be < 5% per hour when idle

## Security Testing

### Token Security
- [ ] Tokens stored in SecureStore (not AsyncStorage)
- [ ] Tokens cleared on logout
- [ ] Tokens cleared on 401 error
- [ ] No tokens in logs

### Communication Security
- [ ] HTTPS only in production
- [ ] No sensitive data in URLs
- [ ] WebView messages validated

## Regression Testing

Before each release, run full regression:

**Critical Path:**
1. [ ] Login with valid credentials
2. [ ] Dashboard loads
3. [ ] Navigate to Jobs
4. [ ] View job details
5. [ ] Navigate back
6. [ ] Logout
7. [ ] Login again (session cleared)

**Extended Path:**
8. [ ] Check all menu items
9. [ ] Test offline mode
10. [ ] Test session persistence
11. [ ] Test on 3 different devices
12. [ ] Verify no crashes or errors

## Test Data

### Test Accounts

**Contractor Account (Verified):**
- Email: `contractor1@test.com`
- Password: `Test123!`
- Status: Verified
- Tier: Premium

**Contractor Account (Pending):**
- Email: `contractor2@test.com`
- Password: `Test123!`
- Status: Pending
- Tier: Standard

**Customer Account:**
- Email: `customer@test.com`
- Password: `Test123!`
- Role: Customer

**Invalid Account:**
- Email: `invalid@test.com`
- Password: `wrong`

## Automated Testing (Future)

Consider adding:
- Unit tests for services and utilities
- Integration tests for API calls
- E2E tests with Detox or Maestro
- Visual regression tests

## Bug Reporting

When reporting bugs, include:
1. **Device**: Model and OS version
2. **App Version**: From app.json
3. **Steps to Reproduce**: Clear, numbered steps
4. **Expected Result**: What should happen
5. **Actual Result**: What actually happened
6. **Screenshots**: If applicable
7. **Logs**: Console errors if available

## Test Report Template

```
## Test Session: [Date]
**Tester**: [Name]
**Device**: [Device info]
**App Version**: [Version]
**Backend**: [Production/Staging/Local]

### Test Results
- Tests Passed: X/Y
- Tests Failed: X/Y
- Blocked: X/Y

### Critical Issues
1. [Issue description]

### Minor Issues
1. [Issue description]

### Notes
[Any additional observations]
```

## Continuous Testing

### Before Each Commit
- [ ] Login flow works
- [ ] No console errors
- [ ] No TypeScript errors

### Before Each Release
- [ ] Full regression test
- [ ] Test on 3+ devices
- [ ] Performance benchmarks
- [ ] Security checklist

### After Each Release
- [ ] Monitor crash reports
- [ ] Check user feedback
- [ ] Review analytics

## Success Criteria

App is ready for release when:
- [ ] All critical tests pass
- [ ] No P0/P1 bugs
- [ ] Performance meets thresholds
- [ ] Tested on 3+ devices
- [ ] Security checklist complete
- [ ] User acceptance testing passed

