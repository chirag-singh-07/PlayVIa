import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = (onSuccess?: (accessToken: string) => void) => {
  /**
   * We provide webClientId, androidClientId, and iosClientId to support
   * Google authentication across all platforms.
   * 
   * On Android/iOS, this will use the native redirect URIs:
   * Android: com.rudnex.app:/oauth2redirect/google
   * iOS: com.rudnex.app:/oauth2redirect/google (or similar based on bundle ID)
   * 
   * These MUST be registered in the Google Cloud Console for the respective
   * OAuth 2.0 Client IDs.
   */
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
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
