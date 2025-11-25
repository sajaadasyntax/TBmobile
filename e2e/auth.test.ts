/**
 * E2E tests for mobile app authentication
 */

import { device, element, by, expect as detoxExpect } from 'detox';

describe('Mobile App - Authentication', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display login screen on first launch', async () => {
    await detoxExpect(element(by.text('Login'))).toBeVisible();
    await detoxExpect(element(by.id('email-input'))).toBeVisible();
    await detoxExpect(element(by.id('password-input'))).toBeVisible();
  });

  it('should login successfully with valid credentials', async () => {
    await element(by.id('email-input')).typeText('contractor@test.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    // Wait for navigation to home screen
    await detoxExpect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should show error with invalid credentials', async () => {
    await element(by.id('email-input')).typeText('wrong@test.com');
    await element(by.id('password-input')).typeText('wrongpassword');
    await element(by.id('login-button')).tap();

    // Error message should appear
    await detoxExpect(element(by.text(/invalid|incorrect/i))).toBeVisible();
  });

  it('should require both email and password', async () => {
    await element(by.id('login-button')).tap();

    // Validation error should appear
    await detoxExpect(element(by.text(/required|email|password/i))).toBeVisible();
  });

  it('should logout successfully', async () => {
    // Login first
    await element(by.id('email-input')).typeText('contractor@test.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    await detoxExpect(element(by.id('home-screen'))).toBeVisible();

    // Navigate to profile/settings
    await element(by.id('profile-tab')).tap();

    // Tap logout
    await element(by.id('logout-button')).tap();

    // Should return to login screen
    await detoxExpect(element(by.text('Login'))).toBeVisible();
  });
});

describe('Mobile App - Offline Mode', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show offline notice when disconnected', async () => {
    // Login first
    await element(by.id('email-input')).typeText('contractor@test.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    // Disable network
    await device.setURLBlacklist(['.*']);

    // Offline notice should appear
    await detoxExpect(element(by.id('offline-notice'))).toBeVisible();
  });

  it('should hide offline notice when reconnected', async () => {
    // Login first
    await element(by.id('email-input')).typeText('contractor@test.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    // Disable network
    await device.setURLBlacklist(['.*']);
    await detoxExpect(element(by.id('offline-notice'))).toBeVisible();

    // Re-enable network
    await device.setURLBlacklist([]);

    // Wait a moment for reconnection
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Offline notice should disappear
    await detoxExpect(element(by.id('offline-notice'))).not.toBeVisible();
  });
});

describe('Mobile App - Job Browsing', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    
    // Login
    await element(by.id('email-input')).typeText('contractor@test.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    await detoxExpect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should display list of jobs', async () => {
    // Navigate to jobs tab
    await element(by.id('jobs-tab')).tap();

    // Job list should be visible
    await detoxExpect(element(by.id('job-list'))).toBeVisible();

    // At least one job should be displayed
    await detoxExpect(element(by.id('job-item-0'))).toBeVisible();
  });

  it('should scroll through job list', async () => {
    await element(by.id('jobs-tab')).tap();

    // Scroll down
    await element(by.id('job-list')).scrollTo('bottom');

    // Scroll back up
    await element(by.id('job-list')).scrollTo('top');
  });

  it('should pull to refresh jobs', async () => {
    await element(by.id('jobs-tab')).tap();

    // Pull to refresh
    await element(by.id('job-list')).swipe('down', 'fast', 0.9);

    // Loading indicator should appear briefly
    await detoxExpect(element(by.id('loading-indicator'))).toBeVisible();
  });

  it('should open job details when tapped', async () => {
    await element(by.id('jobs-tab')).tap();

    // Tap first job
    await element(by.id('job-item-0')).tap();

    // Job details screen should open
    await detoxExpect(element(by.id('job-details-screen'))).toBeVisible();
  });

  it('should use credit to unlock job details', async () => {
    await element(by.id('jobs-tab')).tap();
    await element(by.id('job-item-0')).tap();

    // Tap unlock button
    await element(by.id('unlock-job-button')).tap();

    // Confirm dialog
    await element(by.text('Confirm')).tap();

    // Contact details should appear
    await detoxExpect(element(by.id('contact-details'))).toBeVisible();
  });
});

