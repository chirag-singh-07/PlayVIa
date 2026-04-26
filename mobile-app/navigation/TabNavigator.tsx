import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeScreen } from "../screens/HomeScreen";
import { ShortsScreen } from "../screens/ShortsScreen";
import { UploadScreen } from "../screens/UploadScreen";
import { SubscriptionsScreen } from "../screens/SubscriptionsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { colors } from "../theme";

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 70;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.dark.text,
        tabBarInactiveTintColor: colors.dark.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.dark.background,
          borderTopColor: colors.dark.border,
          height: TAB_BAR_HEIGHT + Math.max(insets.bottom, 0),
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          position: 'absolute',
          borderTopWidth: 1,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: -4,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = "home";

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Shorts":
              iconName = focused ? "video" : "video-outline";
              break;
            case "Upload":
              return (
                <View style={[
                  styles.uploadButton,
                  focused && styles.uploadButtonFocused
                ]}>
                  <MaterialCommunityIcons 
                    name="plus" 
                    size={28} 
                    color={focused ? colors.dark.background : colors.dark.text} 
                  />
                </View>
              );
            case "Subscriptions":
              iconName = focused ? "bell" : "bell-outline";
              break;
            case "Profile":
              iconName = focused ? "account-circle" : "account-circle-outline";
              break;
          }

          return <MaterialCommunityIcons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Shorts" 
        component={ShortsScreen} 
        options={{ tabBarLabel: 'Shorts' }}
      />
      <Tab.Screen
        name="Upload"
        component={UploadScreen}
        options={{ 
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen 
        name="Subscriptions" 
        component={SubscriptionsScreen} 
        options={{ tabBarLabel: 'Subs' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    width: 48,
    height: 32,
    borderWidth: 2,
    borderColor: colors.dark.text,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  uploadButtonFocused: {
    backgroundColor: colors.dark.text,
  },
});
