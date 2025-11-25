/**
 * TrustBuild Mobile App Configuration
 * 
 * IMPORTANT: Copy this file to config.ts and update with your local values
 * DO NOT commit config.ts to version control (it's in .gitignore)
 */

export const config = {
  // Backend API URL
  // For local development: Use your computer's local network IP (NOT localhost!)
  // Example: http://192.168.1.100:5000
  // For production: https://api.trustbuild.uk
  apiUrl: 'https://api.trustbuild.uk',
  
  // Web App URL (for WebView)
  // For local development: Use your computer's local network IP (NOT localhost!)
  // Example: http://192.168.1.100:3000
  // For production: https://trustbuild.uk
  webUrl: 'https://trustbuild.uk',
};

/**
 * How to find your local network IP:
 * 
 * Windows:
 * 1. Open Command Prompt
 * 2. Run: ipconfig
 * 3. Look for "IPv4 Address" under your active network adapter
 * 
 * Mac/Linux:
 * 1. Open Terminal
 * 2. Run: ifconfig
 * 3. Look for "inet" address (not 127.0.0.1)
 * 
 * Note: Your IP might look like:
 * - 192.168.x.x (home network)
 * - 10.0.x.x (office network)
 * - 172.16.x.x to 172.31.x.x (other private networks)
 */

