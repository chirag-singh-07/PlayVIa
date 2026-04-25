import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { ShortsScreen } from '../screens/ShortsScreen';
import { UploadScreen } from '../screens/UploadScreen';
import { SubscriptionsScreen } from '../screens/SubscriptionsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.dark.background,
          borderTopColor: colors.dark.border,
          paddingBottom: 5,
          height: 60,
        },
        tabBarActiveTintColor: colors.dark.text,
        tabBarInactiveTintColor: colors.dark.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Shorts':
              // Using flash to represent shorts playfully
              iconName = focused ? 'flash' : 'flash-outline';
              break;
            case 'Upload':
              iconName = 'add-circle-outline';
              size = 40; // Make the upload button larger
              break;
            case 'Subscriptions':
              iconName = focused ? 'play-circle' : 'play-circle-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          if (route.name === 'Upload') {
            return (
              <View style={{ marginTop: 5 }}>
                <Ionicons name={iconName} size={size} color={colors.dark.text} />
              </View>
            );
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shorts" component={ShortsScreen} />
      <Tab.Screen 
        name="Upload" 
        component={UploadScreen} 
        options={{ tabBarLabel: () => null }} // Hide label for upload tab
      />
      <Tab.Screen name="Subscriptions" component={SubscriptionsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
