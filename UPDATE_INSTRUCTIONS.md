# Updating to Expo SDK 54

## Quick Update Steps

### Option 1: Clean Install (Recommended for Windows)

Run this PowerShell script:

```powershell
.\update-expo.ps1
```

Or manually:

```powershell
# 1. Remove node_modules and lock file
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# 2. Clear npm cache
npm cache clean --force

# 3. Install dependencies
npm install

# 4. Fix Expo versions
npx expo install --fix
```

### Option 2: Using npm directly

```powershell
# Clean install
npm ci --force

# Or if that doesn't work:
Remove-Item -Recurse -Force node_modules
npm install
npx expo install --fix
```

## What Changed

All dependencies have been updated to Expo SDK 54 compatible versions:

- **expo**: ~50.0.0 → ~54.0.0
- **react-native**: 0.73.6 → 0.76.5
- **react**: 18.2.0 → 18.3.1
- **expo-router**: ~3.4.0 → ~4.0.0
- **expo-camera**: ~14.1.0 → ~16.0.0
- **expo-image-picker**: ~14.7.1 → ~16.0.0
- **expo-secure-store**: ~12.8.1 → ~14.0.0
- **expo-constants**: ~15.4.0 → ~17.0.0
- **expo-dev-client**: ~3.3.12 → ~5.0.0
- **expo-linking**: ~6.2.0 → ~7.0.0
- **expo-notifications**: ~0.27.0 → ~0.29.0
- **expo-status-bar**: ~1.11.1 → ~2.0.0
- And all other dependencies updated to latest compatible versions

## Troubleshooting

### ENOTEMPTY Error

If you get `ENOTEMPTY: directory not empty` error:

1. Close any running processes (Metro bundler, etc.)
2. Delete `node_modules` folder manually
3. Delete `package-lock.json`
4. Run `npm cache clean --force`
5. Run `npm install`

### Version Conflicts

If you see version conflicts after installation:

```powershell
npx expo install --fix
```

This will automatically fix all Expo packages to compatible versions.

### Still Having Issues?

Try a complete clean:

```powershell
# Remove everything
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
Remove-Item -Recurse -Force .expo

# Clear all caches
npm cache clean --force
npx expo start --clear

# Reinstall
npm install
npx expo install --fix
```

## After Update

1. Test the app: `npm start`
2. Check for any breaking changes in Expo SDK 54
3. Update any deprecated APIs if needed
4. Test on both Android and iOS if possible

## Breaking Changes

Expo SDK 54 may have breaking changes. Check:
- [Expo SDK 54 Release Notes](https://expo.dev/changelog/)
- [Migration Guide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)

## Verify Installation

After updating, verify versions:

```powershell
npx expo --version
npm list expo
```

You should see Expo SDK 54.x.x

