import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { VideoPlayerScreen } from '../screens/VideoPlayerScreen';
import { ChannelCreateScreen } from '../screens/ChannelCreateScreen';
import { ChannelDashboardScreen } from '../screens/ChannelDashboardScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import { DownloadManagerScreen } from '../screens/DownloadManagerScreen';
import { YourVideosScreen } from '../screens/YourVideosScreen';
import { ChannelProfileScreen } from '../screens/ChannelProfileScreen';
import { ChannelEditScreen } from '../screens/ChannelEditScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { WithdrawalScreen } from '../screens/WithdrawalScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SearchResultsFilterScreen } from '../screens/SearchResultsFilterScreen';
import { colors } from '../theme';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator();

// Custom theme mapping to our dark theme
export const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.dark.background,
    card: colors.dark.background,
    text: colors.dark.text,
    border: colors.dark.border,
  },
};

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main Tabs */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      
      {/* Detail Screens */}
      <Stack.Screen 
        name="VideoPlayer" 
        component={VideoPlayerScreen} 
        options={{
          animation: 'slide_from_bottom',
          presentation: 'fullScreenModal',
        }}
      />
      
      {/* New Screens */}
      <Stack.Screen name="CreateChannel" component={ChannelCreateScreen} />
      <Stack.Screen name="ChannelDashboard" component={ChannelDashboardScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen name="DownloadManager" component={DownloadManagerScreen} />
      <Stack.Screen name="YourVideos" component={YourVideosScreen} />
      <Stack.Screen name="ChannelProfile" component={ChannelProfileScreen} />
      <Stack.Screen name="ChannelEdit" component={ChannelEditScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Withdrawal" component={WithdrawalScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      
      <Stack.Screen 
        name="SearchResultsFilter" 
        component={SearchResultsFilterScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }}
      />
    </Stack.Navigator>
  );
};
