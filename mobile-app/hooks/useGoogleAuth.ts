import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
// FIXED: replaced @react-native-google-signin/google-signin with
// expo-auth-session/providers/google
import * as SecureStore from "expo-secure-store";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    // You would place real client IDs here for production
    clientId: "YOUR_EXPO_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        // Here you would send the token to your backend
        // For now, we simulate storing it securely
        SecureStore.setItemAsync("google_token", authentication.accessToken);
      }
    }
  }, [response]);

  return {
    request,
    response,
    promptAsync,
  };
};
