/**
 * Parses Axios/network errors into user-friendly messages with suggestions.
 */

interface ParsedError {
  title: string;
  message: string;
  suggestion?: string;
}

export const parseAuthError = (error: any): ParsedError => {
  // Network error (no internet / server down)
  if (!error.response) {
    return {
      title: '🌐 Connection Error',
      message: 'Could not connect to the server.',
      suggestion: 'Please check your internet connection and try again.',
    };
  }

  const status = error.response?.status;
  const serverMessage: string = error.response?.data?.message || '';

  // --- 400 Bad Request ---
  if (status === 400) {
    if (serverMessage.toLowerCase().includes('email already exists') || serverMessage.toLowerCase().includes('already exists')) {
      return {
        title: '📧 Account Already Exists',
        message: 'An account with this email is already registered.',
        suggestion: 'Try logging in instead, or use a different email address.',
      };
    }
    if (serverMessage.toLowerCase().includes('username is already taken')) {
      return {
        title: '👤 Username Taken',
        message: 'This username is already in use.',
        suggestion: 'Try a different username (e.g., add numbers or underscores).',
      };
    }
    if (serverMessage.toLowerCase().includes('already registered')) {
      return {
        title: '⚠️ Already Registered',
        message: serverMessage,
        suggestion: 'Try a different value or log in with your existing account.',
      };
    }
    if (serverMessage.toLowerCase().includes('already verified')) {
      return {
        title: '✅ Already Verified',
        message: 'Your account is already verified.',
        suggestion: 'Go back to the login screen and sign in.',
      };
    }
    if (serverMessage.toLowerCase().includes('otp has expired')) {
      return {
        title: '⏰ OTP Expired',
        message: 'Your verification code has expired.',
        suggestion: 'Tap "Resend OTP" to get a new code.',
      };
    }
    if (serverMessage.toLowerCase().includes('invalid otp')) {
      return {
        title: '❌ Wrong OTP',
        message: 'The code you entered is incorrect.',
        suggestion: 'Double-check your email and re-enter the 6-digit code.',
      };
    }
    if (serverMessage.toLowerCase().includes('provide username') || serverMessage.toLowerCase().includes('provide email')) {
      return {
        title: '📋 Missing Information',
        message: 'Please fill in all required fields.',
        suggestion: 'Make sure username, email, and password are all filled in.',
      };
    }
    return {
      title: '⚠️ Invalid Request',
      message: serverMessage || 'The information provided is invalid.',
      suggestion: 'Please review your details and try again.',
    };
  }

  // --- 401 Unauthorized ---
  if (status === 401) {
    if (serverMessage.toLowerCase().includes('verify your email')) {
      return {
        title: '📧 Email Not Verified',
        message: 'Please verify your email before logging in.',
        suggestion: 'Check your inbox for the OTP we sent during registration.',
      };
    }
    return {
      title: '🔐 Login Failed',
      message: 'Incorrect email or password.',
      suggestion: 'Double-check your credentials. If you forgot your password, use "Forgot Password".',
    };
  }

  // --- 403 Forbidden ---
  if (status === 403) {
    if (serverMessage.toLowerCase().includes('too many')) {
      return {
        title: '🚫 Too Many Attempts',
        message: 'You\'ve entered the wrong OTP too many times.',
        suggestion: 'Tap "Resend OTP" to get a fresh code and try again.',
      };
    }
    if (serverMessage.toLowerCase().includes('banned')) {
      return {
        title: '🚫 Account Suspended',
        message: 'Your account has been suspended.',
        suggestion: 'Contact support for help.',
      };
    }
    return {
      title: '🚫 Access Denied',
      message: serverMessage || 'You are not allowed to perform this action.',
    };
  }

  // --- 404 Not Found ---
  if (status === 404) {
    return {
      title: '🔍 Account Not Found',
      message: 'No account found with this email address.',
      suggestion: 'Check the email or create a new account.',
    };
  }

  // --- 429 Rate Limited ---
  if (status === 429) {
    return {
      title: '⏳ Too Many Requests',
      message: 'You\'ve made too many requests in a short time.',
      suggestion: 'Please wait a moment and try again.',
    };
  }

  // --- 500 Server Error ---
  if (status >= 500) {
    return {
      title: '🔧 Server Error',
      message: 'Something went wrong on our end.',
      suggestion: 'Please try again in a few seconds. If the issue persists, contact support.',
    };
  }

  // Fallback
  return {
    title: '⚠️ Something Went Wrong',
    message: serverMessage || 'An unexpected error occurred.',
    suggestion: 'Please try again.',
  };
};

/**
 * Show an Alert with parsed error + suggestion
 */
import { Alert } from 'react-native';

export const showAuthError = (error: any) => {
  const parsed = parseAuthError(error);
  Alert.alert(
    parsed.title,
    parsed.suggestion ? `${parsed.message}\n\n${parsed.suggestion}` : parsed.message,
    [{ text: 'OK' }]
  );
};
