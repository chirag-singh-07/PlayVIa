import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = (onSuccess?: (accessToken: string) => void) => {
  /**
   * Only pass webClientId (= web OAuth client from Google Cloud Console).
   * Do NOT pass androidClientId here — when androidClientId is given,
   * expo-auth-session sends "com.rudnex.app:/oauth2redirect/google" as
   * the redirect_uri which Google rejects with Error 400: invalid_request.
   *
   * Using only webClientId routes the OAuth flow through Expo's auth proxy:
   *   https://auth.expo.io/@growthnations-developer/playvia
   * which IS registered in Google Cloud Console → no more 400/401 errors.
   */
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    redirectUri: makeRedirectUri({
      scheme: "playvia",
    }),
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
