# EAS Build Setup Guide

## Initial Configuration

### Step 1: Remove Placeholder Project ID

The `app.json` file has been updated to remove the placeholder project ID. EAS will generate a proper project ID when you configure the project.

### Step 2: Configure EAS Project

Run the following command to set up your EAS project:

```bash
eas build:configure
```

This will:
- Create a new Expo project (if needed)
- Generate a proper project ID
- Create/update `app.json` with the project ID
- Set up build profiles in `eas.json`

### Step 3: Create EAS Project (if needed)

If you don't have an Expo account project yet, you can create one:

```bash
eas project:init
```

Or visit https://expo.dev and create a project there, then link it:

```bash
eas project:init --id <your-project-id>
```

## Building

### Development Build

For testing with development client:

```bash
eas build --platform android --profile development
```

**Note**: Development builds require `expo-dev-client` (already installed).

### Preview Build (APK)

For internal testing:

```bash
eas build --platform android --profile preview
```

### Production Build

For store submission:

```bash
eas build --platform android --profile production
```

## Troubleshooting

### "Invalid UUID appId" Error

**Solution**: The placeholder project ID has been removed. Run:
```bash
eas build:configure
```

This will generate a proper project ID.

### "cli.appVersionSource" Warning

**Solution**: Added `runtimeVersion` policy to `app.json`. This is now configured.

### Git Repository Required

EAS requires a git repository. If you see this error:

```bash
git init
git add .
git commit -m "Initial commit"
```

Then run your EAS command again.

## Project ID

After running `eas build:configure`, your `app.json` will be updated with a proper project ID like:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      }
    }
  }
}
```

**Important**: Don't manually edit this ID. Let EAS manage it.

## Next Steps

1. ✅ Run `eas build:configure` to set up the project
2. ✅ Run `eas build --platform android --profile development` for your first build
3. ✅ Download and install the APK on your device
4. ✅ Test the app thoroughly
5. ✅ Create production build when ready

## Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Build Configuration](https://docs.expo.dev/build/eas-json/)
- [Expo Project Management](https://docs.expo.dev/accounts/projects/)

