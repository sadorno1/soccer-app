export default {
  expo: {
    name: "soccer-app",
    slug: "soccer-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "soccerapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.sadorno1.soccerapp",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSCameraUsageDescription: "Camera is used to record training videos.",
        NSMicrophoneUsageDescription: "Microphone is used when recording videos.",
        NSPhotoLibraryUsageDescription: "Allow selecting media for workouts.",
        NSPhotoLibraryAddUsageDescription: "Allow saving exported media.",
        NSUserTrackingUsageDescription: "Used to improve app experience.",
        NSLocationWhenInUseUsageDescription: "Used to show nearby fields.",
        NSMotionUsageDescription: "Used for motion-based drills."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.sadorno1.soccerapp"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-video",
      "expo-secure-store",
      "expo-web-browser"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "5637edfa-11b4-40c7-8da1-ddebec66f525"
      },
      firebase: {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      }
    }
  }
};
