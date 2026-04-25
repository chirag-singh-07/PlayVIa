import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppNavigator } from './navigation/AppNavigator';
import { AuthNavigator } from './navigation/AuthNavigator';
import { ThemeProvider } from './theme/ThemeProvider';
import { ActivityIndicator, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from './theme';
import { AppTheme } from './navigation/AppNavigator';

const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.dark.background }}>
        <ActivityIndicator size="large" color={colors.dark.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={AppTheme}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark.background} />
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
