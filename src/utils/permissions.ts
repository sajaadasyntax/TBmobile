import { Platform, Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

/**
 * Request camera permissions
 */
export async function requestCameraPermission(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      const { status } = await Camera.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'This app needs camera access to upload photos for verification.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }
      
      return true;
    }
    
    // iOS
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
}

/**
 * Request media library permissions
 */
export async function requestMediaLibraryPermission(): Promise<boolean> {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Photo Library Permission Required',
        'This app needs access to your photo library to upload images.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting media library permission:', error);
    return false;
  }
}

/**
 * Check if camera permission is granted
 */
export async function hasCameraPermission(): Promise<boolean> {
  const { status } = await Camera.getCameraPermissionsAsync();
  return status === 'granted';
}

/**
 * Check if media library permission is granted
 */
export async function hasMediaLibraryPermission(): Promise<boolean> {
  const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
  return status === 'granted';
}

/**
 * Pick image from library
 */
export async function pickImage(): Promise<string | null> {
  try {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) {
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
}

/**
 * Take photo with camera
 */
export async function takePhoto(): Promise<string | null> {
  try {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error('Error taking photo:', error);
    return null;
  }
}

