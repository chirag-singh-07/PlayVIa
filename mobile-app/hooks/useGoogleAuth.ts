import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
// FIXED: replaced @react-native-google-signin/google-signin with
// expo-auth-session/providers/google
import * as SecureStore from "expo-secure-store";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = (onSuccess?: (accessToken: string) => void) => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    // You would place real client IDs here for production
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "YOUR_WEB_CLIENT_ID",
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "YOUR_IOS_CLIENT_ID",
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "YOUR_ANDROID_CLIENT_ID",
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "YOUR_WEB_CLIENT_ID",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        if (onSuccess) {
          onSuccess(authentication.accessToken);
        }
      }
    }
  }, [response]);

  return {
    request,
    response,
    promptAsync,
  };
};
